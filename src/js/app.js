"use strict";

var cluster = require('cluster');

var Arduino = require("./arduino");
var Twitter = require("./twitter");

var fs = require('fs');

// Audio
var lame = require('lame');
var Speaker = require('speaker');

// Fichier contenant le nombre de tweets reçu
var rankFile = 'rank.txt';
// Contenus de l'ensemble des tweets reçu
var tweetsDB = 'tweets.json';
// Fichier contenant les paliers de la gamification
var gamificationFile = 'gamification.json';

// Le modèle Tweet
import Tweet from "./models/tweet";

/*
 * La liste des tweets jamais affiché par l'Arduino.
 * Ces Tweets doivent être affiché par le LCD de Léa
 * de manière prioritaire.
 */
var freshTweets = [];

/*
 * La liste des tweets déjà affiché par l'Arduino.
 * En l'absence de nouveaux tweet, le programme
 * pioche aléatoirement dans les anciens tweets
 * pour les afficher.
 */
var historicTweets = [];

/*
 * Indique si un tweet est en cours d'affichage par l'Arduino.
 * Dans ce cas, il ne faut pas déclencher l'affichage d'un
 * tweet plus récent.
 */
var isTweetDisplayed = false;

/*
 * Indique si Léa est en état de marche ou pas.
 * Léa est désactivable à distance par l'intermédiaire
 * d"un envoi de tweet. Elle réactivable par le même biai.
 */
var isLeaSpeaking  = true;

/*
 * Indique le numéro d'arrivée du tweet.
 * Il faut prévoir la sauvegarde pour chaque twet reçu
 */
var rank;

/*
 * Les clusters Node
 */
var clusterArduino;
var clusterTwitter;

/*
 * Listes des commandes d'action pour Léa
 */
var classicCommands = ["AMELIE_POULAIN", "TWIN_PEAKS"];

/*
 * Liste des paliers gagnants
 */
var gamification;

/*
 * Constante représentant les textes des tweets pour arrêter ou démarrer léa
 * Cela représente aussi le texte qu'affiche Léa quand elle est en pause.
 */
const TWEET_LEA_START = '@sqli_leo start';
const TWEET_LEA_STOP = '@sqli_leo stop';
const TEXT_LEA_PAUSE = '  Tweetez moi sur                          @devfest_lea';


/*
 * Constantes des différentes commandes des clusters.
 */
var processConst = {
    TYPE: {
        CLUSTER_TWITTER: 'CLUSTER_TWITTER',
        CLUSTER_ARDUINO: 'CLUSTER_ARDUINO'
    },
    ACTION: {
        SHOW_TWEET: 'SHOW_TWEET',
        SEND_TWEET: 'SEND_TWEET',
        LISTEN_TWEET: 'LISTEN_TWEET',
        END_SHOW_TWEET_ON_ARDUINO: 'END_SHOW_TWEET_ON_ARDUINO'
    }
};

/*
 * Compte twitter des admin de Léa
 */
var admins = ["thedireizh", "lynchmaniacPL", "devfest_lea", "fwlodarezack", "ahoudre"];

/**
 * Cas quand le cluster est esclave. Il ne peut alors s'agir que
 * soit du cluster Twitter ou du cluster Arduino.
 * Dans le cas du cluster Twitter, on fixe le process pour déclencher
 * ultérieurement l'appel au cluster.
 * Le programme fait exactement la même chose pour le cluster Arduino.
 */
if (cluster.isWorker) {

  console.log('Worker ' + process.pid + ' has started.');

  if (process.env['type'] == processConst.TYPE.CLUSTER_TWITTER) {
    console.log('Je fixe le process pour twitter');
    Twitter.process = process;
    process.on('message', Twitter.messageHandler);
  } else if (process.env['type'] == processConst.TYPE.CLUSTER_ARDUINO) {
    console.log('Je fixe le process pour arduino');
    Arduino.process = process;
    process.on('message', Arduino.messageHandler);
  }
}


/**
 * Cas pour le cluster master. Il s'agit du chef d'orchestre.
 * Il crée et met en relation ses deux clusters esclave.
 */
if (cluster.isMaster) {

    // Salutations de Léa
    playSound("ouverture");
    
    // Mise à jour des paliers
    updateGamification();

    // Mise à jour du nombre de tweet reçu
    updateRankTweet();

    // Fork workers.
    clusterTwitter = cluster.fork({type: processConst.TYPE.CLUSTER_TWITTER});
  
    // Fork workers.
    clusterArduino = cluster.fork({type: processConst.TYPE.CLUSTER_ARDUINO});

    // Ajout du handler message pour le cluster Twitter
    clusterTwitter.on('message', function(msg) {

      // TODO Code Wil clusterTwitter.onMessage(msg);
      var tweet = msg.tweet;

      if (msg.action == processConst.ACTION.SHOW_TWEET) {
        console.log("j'ai un tweet à envoyé à l'arduino");

          // Gestion de l'arrêt et du redémarrage à distance de Léa
          startAndStopLea(tweet);

          // Configuration et stockage d'un tweet récemment reçu
          if (isLeaSpeaking && !tweet.text.startsWith(TWEET_LEA_START)) {
              if (admins.indexOf(tweet.screenName) == -1) {
                  rank =  parseInt(rank) + 1;
              }
              var gamificationLevel = isTweetWinner();
              if (gamificationLevel != null)  {
                  clusterTwitter.send({action: processConst.ACTION.SEND_TWEET, winner: tweet.screenName, rank: rank});
                  tweet.motion  = gamificationLevel.motion;
              } else {
                  tweet.commande  = getRandomCommand();
              }
              if (admins.indexOf(tweet.screenName) == -1) {
                  console.log("Le numéro de tweet est " + rank);
                  tweet.rank = rank;
              } else {
                  console.log("Le numéro de tweet est admin");
                  tweet.rank = "ADMIN";
              }

              saveRankTweet(rank);
              saveTweet(tweet);
              freshTweets.push(tweet);
              console.log("**********************************************");
              console.log("**     Récupération d'un tweet récent       **");
              console.log("**********************************************");
              isTweetDisplayed = true;
              var freshTweet = freshTweets[0];
              console.log(freshTweet);
              // Gestion du son pour Léa
              if (gamificationLevel != null) {
                playSound("winner");
                gamificationLevel = null;
              } else {
                chooseSound(tweet);
              }

              clusterArduino.send(freshTweet);
              freshTweets.splice(0, 1);
          }
	}

	});

	// Ajout du handler message pour le cluster Arduino
	clusterArduino.on('message', function(msg) {
		var tweet = msg.tweet;
        if (isLeaSpeaking) {
            if (msg.action == processConst.ACTION.END_SHOW_TWEET_ON_ARDUINO) {
              isTweetDisplayed = false;
              console.log("j'ai un tweet terminé : " + tweet.fresh);
              if (tweet.fresh) {
                  console.log("Ceci est un tweet neuf " + tweet);
                  tweet.fresh = false;
                  tweet.command = null;
                  historicTweets.push(tweet);
              }
              var index = freshTweets.indexOf(tweet);
              freshTweets.splice(index, 1);
            }

            // Si des tweets plus récent sont apparu, on les affiche
            if (freshTweets.length > 0) {
                console.log("**********************************************");
                console.log("**       Affichage d'un tweet nouveau !     **");
                console.log("**********************************************");
                isTweetDisplayed = true;
                var freshTweet = freshTweets[0];
                //console.log(freshTweet);
                clusterArduino.send(freshTweet);
                freshTweets.splice(0, 1);
            }

            // Si la liste des tweets historique est plus grande, le progamme la tronque
            if (historicTweets.length > 10) {
                historicTweets  = historicTweets.slice(0, 10);
            }

            // Si il existe des tweets historique, le programme les affiche de manière aléatoire
            if (historicTweets.length > 0) {
                console.log("Affichage d'un tweet historique !");
                isTweetDisplayed = true;
                console.log(historicTweets);
                var historicTweet = historicTweets[Math.floor(Math.random() * historicTweets.length)];
                clusterArduino.send(historicTweet);
            }
        }
	});

	// Temps de latence pour permettre l'initialisation des workers
	// avant de lancer l'API streaming Twitter
	setTimeout(function() {
		console.log("Branchement de l'API Streaming Twitter !!!\n");
		clusterTwitter.send({action: processConst.ACTION.LISTEN_TWEET});
	}, 1000);

}

/**
 * Mets à jour le nombre de tweet réçu par Léa.
 * Le nombre est stocké sur un fichier présent sur
 * le raspberry.
 */
function updateRankTweet() {
    rank  = fs.readFileSync(rankFile, "utf8");
    console.log("NOMBRE DE TWEET DEJA RECU : "  + rank);
}

/**
 * Sauvegarde le nombre de tweets reçu par Léa.
 * Le nombre est stocké sur un fichier présent sur
 * le raspberry.
 * @param rank le nombre de tweet reçu
 */
function saveRankTweet(rank) {
    console.log("Sauvegarde du nombre de tweet");
    fs.writeFileSync(rankFile, rank, {"encoding":'utf8'});
}

function saveTweet(tweet) {
    console.log("Sauvegarde du tweet courant");
    var configFile = fs.readFileSync(tweetsDB);
    var config = JSON.parse(configFile);
    config.push(tweet);
    var configJSON = JSON.stringify(config);
    fs.writeFileSync(tweetsDB, configJSON);
}


/**
 * Permets de démarrer ou de stopper Léa par l'envoi d'un
 * simple tweet. L'expéditeur doit faire parti des admins
 * et doit respecter un formalisme de texte.
 *
 * @param tweet le tweet reçu
 */
function startAndStopLea(tweet) {

    if (admins.indexOf(tweet.screenName) != -1) {
        console.log("Je suis un ADMIN");
        if (tweet.text.startsWith(TWEET_LEA_STOP)) {
            console.log('Je suis passé dans le Léa stop');
            isLeaSpeaking = false;
            var stopTweet = new Tweet('', '', TEXT_LEA_PAUSE);
            clusterArduino.send(stopTweet);
        } else  if (tweet.text.startsWith(TWEET_LEA_START)) {
            console.log('Je suis passé dans le Léa start');
            isLeaSpeaking = true;
        }
    }
}

/**
 * Indique si le tweet courant est gagnant en atteignant un palier
 * particulier. Ces paliers sont dynamiques et sont rechargé à chaque
 * lecture de tweet.
 *
 * @returns {boolean} true si le tweet est gagnant, false sinon
 */
function isTweetWinner() {
    var result = null;
    for (var prop in gamification) {
        if (rank == gamification[prop].rank) {
            console.log(prop + " atteint");
            result = gamification[prop];
        }
    }
    return result
}

/**
 * Mets à jour les paliers gagnants.
 */
function updateGamification() {
    //console.log("PALIER LEA AVANT : "  + JSON.stringify(gamification, null, 2));
    gamification  = JSON.parse(fs.readFileSync(gamificationFile, "utf8"));
    //console.log("PALIER LEA APRES : "  + JSON.stringify(gamification, null, 2));
    //console.log(gamification["PALIER_2"].RANK);
    //console.log(gamification["PALIER_2"].COMMAND);
    console.log(getRandomCommand());
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCommand() {
    //var randomNumber = getRandomInt(0,9);
    if (getRandomInt(0,9)%2 == 0) {
        return classicCommands[0];
    } else {
        return classicCommands[1];
    }
}

function chooseSound(tweet) {
    if (tweet.text.startsWith("cri") || tweet.text.startsWith("@sqli_leo cri")) {
        playSound("gemissement");
    } else if (tweet.text.startsWith("rigole") || tweet.text.startsWith("@sqli_leo rigole")) {
        playSound("sos");
    } else if (tweet.text.startsWith("gangster") || tweet.text.startsWith("@sqli_leo gangster")) {
        playSound("affranchis");
    } else if (tweet.text.startsWith("colle") || tweet.text.startsWith("@sqli_leo colle")) {
        playSound("colle");
    } else if (tweet.text.startsWith("diable") || tweet.text.startsWith("@sqli_leo diable")) {
        playSound("diable");
    } else {
        playSound("foo");
    }
}

function playSound(file) {
    fs.createReadStream('sounds/' + file + '.mp3')
        .pipe(new lame.Decoder())
        .on('format', function (format) {
            this.pipe(new Speaker(format));
        });
}
