"use strict"

/**
 * Classe de configuration contenant l'ensemble des
 * constantes et des variables configurables
 */
export default class Configuration {


}

/*
 * Compte twitter des admin de Léa
 */
Configuration.ADMINS = ["thedireizh", "lynchmaniacPL", "devfest_lea", "fwlodarezack", "ahoudre"];
//Configuration.ADMINS = ["thedireizh", "lynchmaniacPL", "fwlodarezack", "ahoudre"];

/*
 * Listes des commandes d'action pour Léa
 */
Configuration.CLASSIC_MOTIONS = ["AMELIE_POULAIN", "TWIN_PEAKS"];

/*
 * Fichier contenant le nombre de tweets reçu
 */
Configuration.RANK_FILE = 'rank.txt';

/*
 * Contenus de l'ensemble des tweets reçu
 */
Configuration.TWEETS_DB = 'tweets.json';

/*
 * Fichier contenant les paliers de la gamification
 */
Configuration.GAMIFICATION_FILE = 'gamification.json';

/*
 * Constante représentant les textes des tweets pour arrêter ou démarrer léa
 * Cela représente aussi le texte qu'affiche Léa quand elle est en pause.
 */
Configuration.TWEET_LEA_START = '@sqli_leo start';
Configuration.TWEET_LEA_STOP = '@sqli_leo stop';
Configuration.TEXT_LEA_PAUSE = '  Tweetez moi sur                          @devfest_lea';


Configuration.processConst = {
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



