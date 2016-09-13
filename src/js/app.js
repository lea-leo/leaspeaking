"use strict";

var cluster = require('cluster');

var Arduino = require("./arduino");
var Twitter = require("./twitter");

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
var rank = 1;

/*
 * Les clusters Node
 */
var clusterArduino;
var clusterTwitter;

/*
 * Listes des commandes d'action pour Léa
 */
const FIGHT_CLUB = 1;
const USUAL_SUSPECTS = 2;
const AMELIE_POULAIN = 3;
const TWIN_PEAKS = 4;


/**
 * Cas quand le cluster est esclave. Il ne peut alors s'agir que
 * soit du cluster Twitter ou du cluster Arduino.
 * Dans le cas du cluster Twitter, on fixe le process pour déclencher
 * ultérieurement l'appel au cluster.
 * Le programme fait exactement la même chose pour le cluster Arduino.
 */
if (cluster.isWorker) {

  console.log('Worker ' + process.pid + ' has started.');

  if (process.env['type'] == "CLUSTER_TWITTER") {
    console.log('Je fixe le process pour twitter');
    Twitter.process = process;
	process.on('message', Twitter.messageHandler);
  } else if (process.env['type'] == "CLUSTER_ARDUINO") {
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

	// Fork workers.
	clusterTwitter = cluster.fork({type: "CLUSTER_TWITTER"});
  
	// Fork workers.
	clusterArduino = cluster.fork({type: "CLUSTER_ARDUINO"});

	// Ajout du handler message pour le cluster Twitter
	clusterTwitter.on('message', function(msg) {
		console.log("\nMaster !!!" + msg.tweet);
        var tweet = msg.tweet;
		if (msg.action == "SHOW_TWEET") {
		  console.log("j'ai un tweet à envoyé à l'arduino");

          // Gestion de l'arrêt et du redémarrage à distance de Léa
          if (tweet.userName == 'Devfest Léa' &&  tweet.screenName == 'devfest_lea') {
              if (tweet.text == '@sqli_leo stop') {
                console.log('Je suis passé dans le Léa stop');
                  isLeaSpeaking = false;
                  var stopTweet = new Tweet('', '', '  Tweetez moi sur                          @devfest_lea');
                  clusterArduino.send(stopTweet);
              } else  if (tweet.text == '@sqli_leo start') {
                  console.log('Je suis passé dans le Léa start');
                  isLeaSpeaking = true;
              }
          }

          // Lancement de l'affichage du premier tweet
          if (isLeaSpeaking && tweet.text != '@sqli_leo start') {
              if (rank = 1)  {
                  clusterTwitter.send({action: "SEND_TWEET", winner: tweet.screenName});
              }
              tweet.rank = rank;
              rank =  rank + 1;
              tweet.commande  = USUAL_SUSPECTS;
              freshTweets.push(tweet);
              console.log("Affichage du premier tweet nouveau !");
              isTweetDisplayed = true;
              var freshTweet = freshTweets[0];
              console.log(freshTweet);
              clusterArduino.send(freshTweet);
              freshTweets.splice(0, 1);
          }
		}

	});

	// Ajout du handler message pour le cluster Arduino
	clusterArduino.on('message', function(msg) {
		var tweet = msg.tweet;
        if (isLeaSpeaking) {
            if (msg.action == "END_SHOW_TWEET_ON_ARDUINO") {
              isTweetDisplayed = false;
              console.log("j'ai un tweet terminé : " + tweet.fresh);
              if (tweet.fresh) {
                  console.log("Ceci est un tweet neuf " + tweet);
                  tweet.fresh = false;
                  historicTweets.push(tweet);
              }
              var index = freshTweets.indexOf(tweet);
              freshTweets.splice(index, 1);
              console.log("LE TABLEAU DES TWEETS DIFFUSE (HISTORIC) APRES DIFFUSION");
              console.log(historicTweets);
              console.log("LE TABLEAU DES TWEETS A DIFFUSE (FRESH) APRES DIFFUSION");
              console.log(freshTweets);
            }

            // Si des tweets plus récent sont apparu, on les affiche
            if (freshTweets.length > 0) {
                console.log("Affichage d'un tweet nouveau !");
                isTweetDisplayed = true;
                var freshTweet = freshTweets[0];
                console.log(freshTweet);
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
		clusterTwitter.send({action: "LISTEN_TWEET"});
	}, 1000);

}


