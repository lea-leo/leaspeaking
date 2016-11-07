    "use strict";

    var cluster = require('cluster');

    import Tweet from "./models/tweet";
    import Configuration from "./config/configuration";
    import Context from "./models/context";

    var Arduino = require("./clusters/arduino");
    var Twitter = require("./clusters/twitter");

    import Utils from "./helpers/utils";


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
//Utils.test("AdrienLASSELLE");
        //console.log(Utils.getRandomMotion("sos"));

        // Mise à jour des paliers
        context.gamification = Utils.getGamification();

        // Mise à jour du nombre de tweet reçu
        Utils.getCurrentRank(context);

        // Fork workers.
        clusterTwitter = cluster.fork({type: Configuration.processConst.TYPE.CLUSTER_TWITTER});

        // Fork workers.
        clusterArduino = cluster.fork({type: Configuration.processConst.TYPE.CLUSTER_ARDUINO});

        // Ajout du handler message pour le cluster Twitter
        clusterTwitter.on('message', function(msg) {
          var tweet = msg.tweet;

            if (msg.action == Configuration.processConst.ACTION.SHOW_TWEET) {
              // Gestion de l'arrêt et du redémarrage à distance de Léa
                Utils.startAndStopLea(tweet, clusterArduino, context);

                console.log("Tweet spécial : " + tweet.isSpecial);
                console.log("LeaSpeaking : " + context.isLeaSpeaking);

              // Configuration et stockage d'un tweet récemment reçu
              if (context.isLeaSpeaking && !tweet.isSpecial) {
                  console.log("Ajout du nouveau tweet dans la file d'attente...");
                  context.freshTweets.push(tweet);
                  // Sauvegarde du rang
                  Utils.updateAndSaveRankTweet(tweet, context);
                  Utils.fillTweetRank(tweet, context.rank);

                  // On regarde si le tweet est gagnant
                  var gamificationLevel = null;
                  if (!Utils.isAdmin(tweet.screenName)) {
                      gamificationLevel = Utils.isTweetWinner(context.gamification, context.rank);
                  }
                  if (gamificationLevel != null && tweet.fresh)  {
                      clusterTwitter.send({action: Configuration.processConst.ACTION.SEND_TWEET, winner: tweet.screenName, rank: context.rank});
                      tweet.motion  = gamificationLevel.motion;
                      tweet.sound = gamificationLevel.sound;
                      tweet.winner = true;
                      gamificationLevel = null;
                  } else {
                      tweet.motion  = Utils.getRandomMotion(tweet.sound);
                  }
                  console.log("Le tweet à afficher : ");
                  console.log(tweet);
                  if (!context.isTweetDisplayed) {
                      console.log("Demande au worker Arduino d'afficher le tweet");
                      context.tweetDisplayed = tweet;
                      context.isTweetDisplayed = true;
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
                        tweet.motion = null;
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
                        clusterArduino.send(historicTweet);
                    }
                }

            }
        });

        // Quand le worker arduino est opérationnel, nous affichons le
        // tweet de bienvenue ainsi que l'accompagnement vocal
        clusterArduino.on('online', function(worker) {
            //Sound.playSound("bienvenue");
            clusterArduino.send(Utils.generateStartUpTweet());
        });

        // Temps de latence pour permettre l'initialisation des workers
        // avant de lancer l'API streaming Twitter
        setTimeout(function() {
            console.log("Twitter est sur écoute ...");
            clusterTwitter.send({action: Configuration.processConst.ACTION.LISTEN_TWEET});
        }, 1000);

    }
