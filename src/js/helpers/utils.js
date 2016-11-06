"use strict";
// lodash
var _ = require('lodash/array');

var fs = require('fs');

// Le modèle Tweet
import Tweet from "../models/tweet";

import Configuration from "../config/configuration";
import Sound from "./sound";

export default class Utils {

    /**
     * Renvoie un nombre aléatoire compris entre le min et le max.
     *
     * @param min le nombre minimum
     * @param max le nombre maximum
     * @returns {*} un nombre alétoire
     */
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Renvoie une commande aléatoire.
     * @returns {*} une commande aléatoire
     */
    static getRandomMotion(sound) {
        var result = Configuration.easterEggs.find(function(easterEgg) {
            return sound == easterEgg.mp3;
        });

        if (result && result.motion) {
            return result.motion;
        } else if (Utils.getRandomInt(0,9)%2 == 0) {
            return Configuration.CLASSIC_MOTIONS[0];
        } else {
            return Configuration.CLASSIC_MOTIONS[1];
        }
    }

    /*
    UTILITAIRES EN RAPPORT AVEC LES FICHIERS
     */
    /**
     * Renvoie le nombre de tweet réçu par Léa.
     * Le nombre est stocké sur un fichier présent sur
     * le raspberry.
     */
    static getCurrentRank(context) {
        context.rank =  fs.readFileSync(Configuration.RANK_FILE, "utf8");
    }

    /**
     * Remplis le rang du tweet avec le rang courant, sauf
     * si on est un admin auquel cas on mets "ADMIN" comme rang
     * @param tweet
     * @param rank
     */
    static fillTweetRank(tweet, rank) {
        tweet.rank = rank;
        if (Utils.isAdmin(tweet.screenName)) {
            tweet.rank = "ADMIN";
        }
    }

    /**
     * Renvoie les paliers gagnants.
     */
    static getGamification() {
        return JSON.parse(fs.readFileSync(Configuration.GAMIFICATION_FILE, "utf8"));
    }

    /**
     * Indique si le tweet courant est gagnant en atteignant un palier
     * particulier. Ces paliers sont dynamiques et sont rechargé à chaque
     * lecture de tweet.
     *
     * @returns {boolean} true si le tweet est gagnant, false sinon
     */
    static isTweetWinner(gamification, rank) {
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
     * Sauvegarde le tweet courant.
     * Un contrôle est effectué pour ne pas enregistrer
     * 2 tweets identique.
     */
    static saveTweet(tweet) {
        if (tweet.fresh) {
            var configFile = fs.readFileSync(Configuration.TWEETS_DB);
            var config = JSON.parse(configFile);
            if(_.findIndex(config, function(o) { return o == tweet; }) == -1) {
                config.push(tweet);
            }
            var configJSON = JSON.stringify(config);
            console.log("Sauvegarde du tweet courant");
            fs.writeFileSync(Configuration.TWEETS_DB, configJSON);
        }
    }


    /**
     * Sauvegarde le nombre de tweets reçu par Léa.
     * Le nombre est stocké sur un fichier présent sur
     * le raspberry.
     * @param rank le nombre de tweet reçu
     */
    static updateAndSaveRankTweet(tweet, context) {
        if (!Utils.isAdmin(tweet.screenName) && tweet.fresh) {
            var result =  parseInt(context.rank) + 1;
            context.rank = result;
            try {
                fs.writeFileSync(Configuration.RANK_FILE, context.rank, {"encoding": 'utf8'});
            } catch (err) {
                console.log(err);
            }
        }
        //return rank;
    }

    static isAdmin(name) {
        return Configuration.ADMINS.indexOf(name.toLowerCase()) != -1;
    }
    static isDemoOff(tweet) {
        return tweet.text.toLowerCase().indexOf(Configuration.TEXT_LEA_DEMO_OFF.toString().toLowerCase()) != -1;
    }
    static isDemoOn(tweet) {
        return tweet.text.toLowerCase().indexOf(Configuration.TEXT_LEA_DEMO_ON.toString().toLowerCase()) != -1;
    }
    /*static test(name) {
        console.log("Configuration.ADMINS.toString().toLowerCase() : " + Configuration.ADMINS.toString().toLowerCase());
        console.log("name.toLowerCase() : " + name.toLowerCase());
        console.log("Configuration.ADMINS : " + Configuration.ADMINS);
        console.log("Configuration.ADMINS.indexOf : " + Configuration.ADMINS.indexOf(name));
        console.log("Configuration.ADMINS.indexOf : " + Configuration.ADMINS.indexOf(name.toLowerCase()));
        return Configuration.ADMINS.toString().toLowerCase().indexOf(name.toLowerCase()) != -1;
    }*/
    /**
     * Permets de démarrer ou de stopper Léa par l'envoi d'un
     * simple tweet. L'expéditeur doit faire parti des ADMINS
     * et doit respecter un formalisme de texte.
     *
     * @param tweet le tweet reçu
     */
    static startAndStopLea(tweet, clusterArduino, context) {

        if (Utils.isAdmin(tweet.screenName)) {
            console.log("Je suis un admin");
            if (tweet.text.startsWith(Configuration.TWEET_LEA_STOP)) {
                console.log("tweet de stop");
                tweet.isSpecial = true;
                context.isLeaSpeaking = false;
            } else  if (tweet.text.startsWith(Configuration.TWEET_LEA_START)) {
                console.log("tweet de start");
                tweet.isSpecial = true;
                context.isLeaSpeaking = true;
                Sound.playSound("bienvenue");
            }
            clusterArduino.send(Utils.generatePauseTweet());
        }
    }

    /**
     * Génère et renvoie un tweet indiquant que Léa fait une pause
     * @returns {Tweet}
     */
    static generateTweet(text) {
        var tweet = new Tweet("", "", text);
        tweet.isSpecial = true;
        return tweet;
    }

    /**
     * Génère et renvoie un tweet indiquant que Léa fait une pause
     * @returns {Tweet}
     */
    static generatePauseTweet() {
        return Utils.generateTweet(Configuration.TEXT_LEA_PAUSE);
        /*var tweet = new Tweet("", "", Configuration.TEXT_LEA_PAUSE);
        tweet.isSpecial = true;
        return tweet;*/
    }

    /**
     * Génère et renvoie un tweet indiquant que Léa est prête à jouer
     * @returns {Tweet}
     */
    static generateStartUpTweet() {
        return Utils.generateTweet(Configuration.TEXT_LEA_START_UP);
    }
};




