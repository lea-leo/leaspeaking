var cluster = require('cluster');

var Arduino = require("./arduino");
var Twitter = require("./twitter");

import Tweet from "./models/tweet";

var freshTweets = [];
var historicTweets = [];

var isTweetDisplayed = false;
var isLeaSpeaking  = true;

var clusterArduino;
var clusterTwitter;

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
          if (isLeaSpeaking && tweet.text != '@sqli_leo start') {
              freshTweets.push(tweet);
              console.log("Affichage du premier tweet nouveau !");
              isTweetDisplayed = true;
              var freshTweet = freshTweets[0];
              console.log(freshTweet);
              clusterArduino.send(freshTweet);
              freshTweets.splice(0, 1);
          }
		}
        /*if (isLeaSpeaking && tweet.text != '@sqli_leo start') {
            console.log("Affichage du premier tweet nouveau !");
            isTweetDisplayed = true;
            var freshTweet = freshTweets[0];
            console.log(freshTweet);
            clusterArduino.send(freshTweet);
            freshTweets.splice(0, 1);
        }*/

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


            if (freshTweets.length > 0) {
                console.log("Affichage d'un tweet nouveau !");
                isTweetDisplayed = true;
                var freshTweet = freshTweets[0];
                console.log(freshTweet);
                clusterArduino.send(freshTweet);
                freshTweets.splice(0, 1);
            }
            if (historicTweets.length > 10) {
                historicTweets  = historicTweets.slice(0, 10);
            }
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

    /*console.log("je dois bosser !!!!");


    console.log("Je regarde les tweets frais");
    if (freshTweets.length > 0) {
        console.log("Affichage d'un tweet nouveau !");
        isTweetDisplayed = true;
        clusterArduino.send(freshTweets[0]);
        freshTweets.splice(0, 1);
    }

    // Récupération au hasard d'untweet historique
    setTimeout(function() {
        console.log("Coucou j'attends  !!!\n");
    }, 5000);

    // Affichagedu tweet
    console.log("Je regarde les tweets rance");
    if (historicTweets.length > 0) {
        console.log("Affichage d'un tweet historique !");
        isTweetDisplayed = true;
        clusterArduino.send(historicTweets[Math.floor(Math.random() * historicTweets.length) + 1 ]);
    }*/



}


