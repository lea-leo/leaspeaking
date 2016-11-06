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
Configuration.ADMINS = ["thedireizh", "devfest_lea", "fwlodarezack", "ahoudre", "adrienlasselle"];
//Configuration.ADMINS = ["thedireizh", "lynchmaniacPL", "devfest_lea", "fwlodarezack", "ahoudre", "AdrienLASSELLE"];
//Configuration.ADMINS = ["thedireizh", "lynchmaniacPL", "fwlodarezack", "ahoudre", "AdrienLASSELLE"];

/*
 * Listes des commandes d'action pour Léa
 */
Configuration.CLASSIC_MOTIONS = ["KUNG_FU_PANDA", "SHAOLIN_SOCCER"];
//Configuration.CLASSIC_MOTIONS = ["AMELIE_POULAIN", "TWIN_PEAKS"];

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
Configuration.USER_TWITTER = '@devfest_lea';
Configuration.TWEET_LEA_START = Configuration.USER_TWITTER + ' start';
Configuration.TWEET_LEA_STOP = Configuration.USER_TWITTER + ' stop';
Configuration.TEXT_LEA_PAUSE = '  Tweetez moi sur                          ' + Configuration.USER_TWITTER;
Configuration.TEXT_LEA_START_UP = '  Prete a participer                          au Devfest';
Configuration.TEXT_LEA_DEMO_ON = 'demo on';
Configuration.TEXT_LEA_DEMO_OFF = 'demo off';

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

Configuration.easterEggs = [
    {text: "rigole", alternativeText: Configuration.USER_TWITTER + " rigole", mp3: "sos", motion:"SOS"},
    {text: "gangster", alternativeText: Configuration.USER_TWITTER + " gangster", mp3: "affranchis"},
    {text: "colle", alternativeText: Configuration.USER_TWITTER + " colle", mp3: "colle"},
    {text: "exorciste", alternativeText: Configuration.USER_TWITTER + " exorciste", mp3: "exorciste", motion: "EXORCISTE"},
    {text: "diable", alternativeText: Configuration.USER_TWITTER + " diable", mp3: "diale"},
    {text: "lot1", alternativeText: Configuration.USER_TWITTER + " lot1", mp3: "lot1"},
    {text: "lot2", alternativeText: Configuration.USER_TWITTER + " lot2", mp3: "lot2"},
    {text: "lot3", alternativeText: Configuration.USER_TWITTER + " lot3", mp3: "lot3"},
    {text: "perdu1", alternativeText: Configuration.USER_TWITTER + " perdu1", mp3: "perdu1"},
    {text: "dora", alternativeText: Configuration.USER_TWITTER + " dora", mp3: "gagnant_Dora"},
    {text: "felicitations", alternativeText: Configuration.USER_TWITTER + " felicitations", mp3: "felicitations"},
    {text: "formidable", alternativeText: Configuration.USER_TWITTER + " formidable", mp3: "formidable"},
    {text: "foule", alternativeText: Configuration.USER_TWITTER + " foule", mp3: "foule"},
    {text: "the best", alternativeText: Configuration.USER_TWITTER + " the best", mp3: "simply the best"},
    {text: "gagne", alternativeText: Configuration.USER_TWITTER + " gagne", mp3: "tu as gagne"},
    {text: "champion", alternativeText: Configuration.USER_TWITTER + " champion", mp3: "we are the champion"}
];

Configuration.sounds = [
    {text: "perdu1", alternativeText: Configuration.USER_TWITTER + " perdu1", mp3: "perdu1"},
    {text: "formidable", alternativeText: Configuration.USER_TWITTER + " formidable", mp3: "formidable"},
    {text: "foule", alternativeText: Configuration.USER_TWITTER + " foule", mp3: "foule"},
    {text: "the best", alternativeText: Configuration.USER_TWITTER + " the best", mp3: "simply the best"}
];
