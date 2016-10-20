    "use strict";

    var cluster = require('cluster');

    import Tweet from "./models/tweet";
    import Configuration from "./config/configuration";
    import Context from "./models/context";

    var Arduino = require("./clusters/arduino");
    var Twitter = require("./clusters/twitter");

    import Sound from "./sound";
    import Utils from "./utils";


    // lodash
    var _ = require('lodash/array');

    /*
     * Les clusters Node
     */
    var clusterArduino;
    var clusterTwitter;

    /*
     * Le contexte d'exécution du master
     */
    let context = new Context();

    /**
     * Cas quand le cluster est esclave. Il ne peut alors s'agir que
     * soit du cluster Twitter ou du cluster Arduino.
     * Dans le cas du cluster Twitter, on fixe le process pour déclencher
     * ultérieurement l'appel au cluster.
     * Le programme fait exactement la même chose pour le cluster Arduino.
     */
    if (cluster.isWorker) {
      if (process.env['type'] == Configuration.processConst.TYPE.CLUSTER_TWITTER) {
        console.log('Création du cluster Twitter');
        Twitter.process = process;
        process.on('message', Twitter.messageHandler);
      } else if (process.env['type'] == Configuration.processConst.TYPE.CLUSTER_ARDUINO) {
        console.log('Création du cluster Arduino');
        Arduino.process = process;
        process.on('message', Arduino.messageHandler);
      }
    }

    /**
     * Cas pour le cluster master. Il s'agit du chef d'orchestre.
     * Il crée et met en relation ses deux clusters esclaves.
     */

    if (cluster.isMaster) {


        // Mise à jour des paliers
        context.gamification = Utils.getGamification();

        // Mise à jour du nombre de tweet reçu
        console.log("RANK avant appel " + context.rank);
        console.log("TOTO avant appel " + context.toto);
        Utils.getCurrentRank(context);
        console.log("TOTO après appel " + context.toto);
        console.log("RANK après appel " + context.rank);

        // Fork workers.
        clusterTwitter = cluster.fork({type: Configuration.processConst.TYPE.CLUSTER_TWITTER});

        // Fork workers.
        clusterArduino = cluster.fork({type: Configuration.processConst.TYPE.CLUSTER_ARDUINO});

        // Ajout du handler message pour le cluster Twitter
        clusterTwitter.on('message', function(msg) {
          var tweet = msg.tweet;

            if (msg.action == Configuration.processConst.ACTION.SHOW_TWEET) {
              // Gestion de l'arrêt et du redémarrage à distance de Léa
                console.log("tweet.isSpecial" + tweet.isSpecial);
                console.log("isLeaSpeaking" + context.isLeaSpeaking);
                Utils.startAndStopLea(tweet, clusterArduino, context);
                console.log("tweet.isSpecial" + tweet.isSpecial);
                console.log("isLeaSpeaking" + context.isLeaSpeaking);

              // Configuration et stockage d'un tweet récemment reçu
              if (context.isLeaSpeaking && !tweet.text.startsWith(Configuration.TWEET_LEA_START)) {
                  context.freshTweets.push(tweet);
                  // Sauvegarde du rang
                  console.log("RANK " + context.rank);
                  Utils.updateAndSaveRankTweet(tweet, context);
                  Utils.fillTweetRank(tweet, context.rank);

                  // On regarde si le tweet est gagnant
                  var gamificationLevel = Utils.isTweetWinner(context.gamification, context.rank);
                  if (gamificationLevel != null && tweet.fresh)  {
                      clusterTwitter.send({action: Configuration.processConst.ACTION.SEND_TWEET, winner: tweet.screenName, rank: context.rank});
                      tweet.motion  = gamificationLevel.motion;
                      tweet.winner = true;
                      gamificationLevel = null;
                  } else {
                      tweet.motion  = Utils.getRandomMotion();
                  }

                  if (!context.isTweetDisplayed) {
                      context.tweetDisplayed = tweet;
                      context.isTweetDisplayed = true;
                      console.log("********* ENVOI TWEET 1 *********");
                      clusterArduino.send(tweet);
                  }
              }
            }
        });

        // Ajout du handler message pour le cluster Arduino
        clusterArduino.on('message', function(msg) {
            context.isTweetDisplayed = false;
            var tweet = msg.tweet;
            if (context.isLeaSpeaking) {
                if (msg.action == Configuration.processConst.ACTION.END_SHOW_TWEET_ON_ARDUINO) {
                    Utils.saveTweet(tweet);

                    // On tansforme le tweet récemment affiché en tweet historisé
                    if (tweet.fresh) {
                        tweet.fresh = false;
                        tweet.command = null;
                        context.historicTweets.push(tweet);
                    }
                    // Suppression du tweet frais
                    _.remove(context.freshTweets, function(currentObject) {
                        return currentObject.userName === tweet.userName &&
                            currentObject.screenName === tweet.screenName &&
                            currentObject.text === tweet.text;
                    });
                }

                // Si des tweets plus récent sont apparu, on les affiche
                if (context.freshTweets.length > 0) {
                    var freshTweet = context.freshTweets[0];
                    if (!context.isTweetDisplayed && context.tweetDisplayed != freshTweet && context.isLeaSpeaking) {
                        context.isTweetDisplayed = true;
                        console.log("********* ENVOI TWEET 2 *********");
                        clusterArduino.send(freshTweet);
                    }
                }

                if (!context.isTweetDisplayed) {
                    // Si la liste des tweets historique est plus grande, le progamme la tronque
                    if (context.historicTweets.length > 10) {
                        context.historicTweets  = context.historicTweets.slice(0, 10);
                    }

                    // Si il existe des tweets historique, le programme les affiche de manière aléatoire
                    if (context.historicTweets.length > 0) {
                        var historicTweet = context.historicTweets[Utils.getRandomInt(0, context.historicTweets.length - 1)];
                        context.isTweetDisplayed = true;
                        console.log("********* ENVOI TWEET 3 *********");
                        clusterArduino.send(historicTweet);
                    }
                }

            }
        });

        // Quand le worker arduino est opérationnel, nous affichons le
        // tweet de bienvenue ainsi que l'accompagnement vocal
        clusterArduino.on('online', function(worker) {
            Sound.playSound("ouverture");
            clusterArduino.send(Utils.generatePauseTweet());
        });

        // Temps de latence pour permettre l'initialisation des workers
        // avant de lancer l'API streaming Twitter
        setTimeout(function() {
            console.log("Twitter est sur écoute ...");
            clusterTwitter.send({action: Configuration.processConst.ACTION.LISTEN_TWEET});
        }, 1000);

    }
