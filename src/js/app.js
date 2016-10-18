"use strict";

var cluster = require('cluster');

var Arduino = require("./arduino");
var Twitter = require("./twitter");
import Sound from "./sound";
import Utils from "./utils";

// lodash
var _ = require('lodash/array');

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
var tweetDisplayed;

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
 * Liste des paliers gagnants
 */
var gamification;

/*
 * Constante représentant les textes des tweets pour arrêter ou démarrer léa
 * Cela représente aussi le texte qu'affiche Léa quand elle est en pause.
 */
const TWEET_LEA_START = '@sqli_leo start';

/*
 * Compte twitter des admin de Léa
 */
var admins = ["thedireizh", "lynchmaniacPL", "fwlodarezack", "ahoudre"];

/**
 * Cas quand le cluster est esclave. Il ne peut alors s'agir que
 * soit du cluster Twitter ou du cluster Arduino.
 * Dans le cas du cluster Twitter, on fixe le process pour déclencher
 * ultérieurement l'appel au cluster.
 * Le programme fait exactement la même chose pour le cluster Arduino.
 */
if (cluster.isWorker) {

  console.log('Worker ' + process.pid + ' has started.');

  if (process.env['type'] == Utils.processConst.TYPE.CLUSTER_TWITTER) {
    console.log('Je fixe le process pour twitter');
    Twitter.process = process;
    process.on('message', Twitter.messageHandler);
  } else if (process.env['type'] == Utils.processConst.TYPE.CLUSTER_ARDUINO) {
    console.log('Je fixe le process pour arduino');
    Arduino.process = process;
    process.on('message', Arduino.messageHandler);
  }
}

/**
 * Cas pour le cluster master. Il s'agit du chef d'orchestre.
 * Il crée et met en relation ses deux clusters esclaves.
 */

if (cluster.isMaster) {

    // Salutations de Léa
    Sound.playSound("ouverture");
    
    // Mise à jour des paliers
    gamification = Utils.getGamification();

    // Mise à jour du nombre de tweet reçu
    rank = Utils.getCurrentRank();

    // Fork workers.
    clusterTwitter = cluster.fork({type: Utils.processConst.TYPE.CLUSTER_TWITTER});

    // Fork workers.
    clusterArduino = cluster.fork({type: Utils.processConst.TYPE.CLUSTER_ARDUINO});

    // Ajout du handler message pour le cluster Twitter
    clusterTwitter.on('message', function(msg) {

      // TODO Code Wil clusterTwitter.onMessage(msg);
      var tweet = msg.tweet;

      if (msg.action == Utils.processConst.ACTION.SHOW_TWEET) {
       // console.log("j'ai un tweet à envoyé à l'arduino");

          // Gestion de l'arrêt et du redémarrage à distance de Léa
          Utils.startAndStopLea(tweet, admins, clusterArduino);

          // Configuration et stockage d'un tweet récemment reçu
          if (isLeaSpeaking && !tweet.text.startsWith(TWEET_LEA_START)) {
              // Sauvegarde du rang
              rank = Utils.saveRankTweet(tweet, admins, rank);
              tweet.rank = rank;
              if (admins.indexOf(tweet.screenName) != -1) {
                  tweet.rank = "ADMIN";
              }

              // On regarde si le tweet est gagnant
              var gamificationLevel = Utils.isTweetWinner(gamification, rank);
              if (gamificationLevel != null && tweet.fresh)  {
                  clusterTwitter.send({action: processConst.ACTION.SEND_TWEET, winner: tweet.screenName, rank: rank});
                  tweet.motion  = gamificationLevel.motion;
                  tweet.winner = true;
                  gamificationLevel = null;
              } else {
                  tweet.motion  = Utils.getRandomCommand();
              }

              freshTweets.push(tweet);
              if (!isTweetDisplayed) {
                  tweetDisplayed = tweet;
                  clusterArduino.send(tweet);
              }


          }
	}

	});

	// Ajout du handler message pour le cluster Arduino
	clusterArduino.on('message', function(msg) {
		var tweet = msg.tweet;
        if (isLeaSpeaking) {
            if (msg.action == Utils.processConst.ACTION.END_SHOW_TWEET_ON_ARDUINO) {
                Utils.saveTweet(tweet);
                isTweetDisplayed = false;
                // On tansforme le tweet récemment affiché en tweet historisé
                if (tweet.fresh) {
                    tweet.fresh = false;
                    tweet.command = null;
                    historicTweets.push(tweet);
                }
                // Suppression du tweet frais
                _.remove(freshTweets, function(currentObject) {
                    return currentObject.userName === tweet.userName &&
                        currentObject.screenName === tweet.screenName &&
                        currentObject.text === tweet.text;
                });
            }

            // Si des tweets plus récent sont apparu, on les affiche
            if (freshTweets.length > 0) {
                isTweetDisplayed = true;
                var freshTweet = freshTweets[0];
                if (tweetDisplayed != freshTweet) {
                    clusterArduino.send(freshTweet);
                }
            }

            // Si la liste des tweets historique est plus grande, le progamme la tronque
            if (historicTweets.length > 10) {
                historicTweets  = historicTweets.slice(0, 10);
            }
            console.log("historicTweets");
            console.log(historicTweets);
            // Si il existe des tweets historique, le programme les affiche de manière aléatoire
            if (historicTweets.length > 0) {
                //console.log("Affichage d'un tweet historique !");
                isTweetDisplayed = true;
                var historicTweet = historicTweets[Math.floor(Math.random() * historicTweets.length)];
                console.log("Fraicheur du tweet historique : " + historicTweet.fresh);
                clusterArduino.send(historicTweet);
            }
        }
	});

	// Temps de latence pour permettre l'initialisation des workers
	// avant de lancer l'API streaming Twitter
	setTimeout(function() {
		console.log("Branchement de l'API Streaming Twitter !!!\n");
		clusterTwitter.send({action: Utils.processConst.ACTION.LISTEN_TWEET});
	}, 1000);

}