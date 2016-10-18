"use strict";
// lodash
var _ = require('lodash/array');

var fs = require('fs');

// Le modèle Tweet
import Tweet from "./models/tweet";

/*
 * Listes des commandes d'action pour Léa
 */
var classicMotions = ["AMELIE_POULAIN", "TWIN_PEAKS"];

/*
 * Fichier contenant le nombre de tweets reçu
 */
var rankFile = 'rank.txt';

/*
 * Contenus de l'ensemble des tweets reçu
 */
var tweetsDB = 'tweets.json';

/*
 * Fichier contenant les paliers de la gamification
 */
var gamificationFile = 'gamification.json';

/*
 * Constante représentant les textes des tweets pour arrêter ou démarrer léa
 * Cela représente aussi le texte qu'affiche Léa quand elle est en pause.
 */
const TWEET_LEA_START = '@sqli_leo start';
const TWEET_LEA_STOP = '@sqli_leo stop';


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
    static getRandomMotion() {
        if (Utils.getRandomInt(0,9)%2 == 0) {
            return classicMotions[0];
        } else {
            return classicMotions[1];
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
    static getCurrentRank() {
        return fs.readFileSync(rankFile, "utf8");
    }

    /**
     * Renvoie les paliers gagnants.
     */
    static getGamification() {
        return JSON.parse(fs.readFileSync(gamificationFile, "utf8"));
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
            var configFile = fs.readFileSync(tweetsDB);
            var config = JSON.parse(configFile);
            if(_.findIndex(config, function(o) { return o == tweet; }) == -1) {
                config.push(tweet);
            }
            var configJSON = JSON.stringify(config);
            console.log("Sauvegarde du tweet courant");
            fs.writeFileSync(tweetsDB, configJSON);
        }
    }


    /**
     * Sauvegarde le nombre de tweets reçu par Léa.
     * Le nombre est stocké sur un fichier présent sur
     * le raspberry.
     * @param rank le nombre de tweet reçu
     */
    static saveRankTweet(tweet, admins, rank) {
        if (admins.indexOf(tweet.screenName) == -1 && tweet.fresh) {
            rank =  parseInt(rank) + 1;
            try {
                fs.writeFileSync(rankFile, rank, {"encoding": 'utf8'});
            } catch (err) {
                console.log(err);
            }
        }
        return rank;
    }

    /**
     * Permets de démarrer ou de stopper Léa par l'envoi d'un
     * simple tweet. L'expéditeur doit faire parti des admins
     * et doit respecter un formalisme de texte.
     *
     * @param tweet le tweet reçu
     */
    static startAndStopLea(tweet, admins, clusterArduino) {
        var isLeaSpeaking;
        if (admins.indexOf(tweet.screenName) != -1) {
            if (tweet.text.startsWith(TWEET_LEA_STOP)) {
                isLeaSpeaking = false;
                var stopTweet = new Tweet('', '', TEXT_LEA_PAUSE);
                clusterArduino.send(stopTweet);
            } else  if (tweet.text.startsWith(TWEET_LEA_START)) {
                isLeaSpeaking = true;
            }
        }
        return isLeaSpeaking;
    }
};

Utils.TEXT_LEA_PAUSE = '  Tweetez moi sur                          @devfest_lea';


Utils.processConst = {
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

