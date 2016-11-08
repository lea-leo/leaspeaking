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
Configuration.ADMINS = ["scxpro", "thedireizh", "lynchmaniacpl", "fwlodarezack", "adrienlasselle", "ahoudre", "devfest_lea"];
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

Configuration.TEXT_LEA_PAUSE = '  Lea est en pause     elle se repose';


Configuration.TEXT_LEA_START = '  Tweetez moi sur                          ' + Configuration.USER_TWITTER;
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
    {text: "diable", alternativeText: Configuration.USER_TWITTER + " diable", mp3: "diable"},
    {text: "lot1", alternativeText: Configuration.USER_TWITTER + " lot1", mp3: "lot1"},
    {text: "lot2", alternativeText: Configuration.USER_TWITTER + " lot2", mp3: "lot2"},
    {text: "lot3", alternativeText: Configuration.USER_TWITTER + " lot3", mp3: "gagnant_voix"},
    {text: "perdu", alternativeText: Configuration.USER_TWITTER + " perdu", mp3: "perdu_voix"},
    {text: "dora", alternativeText: Configuration.USER_TWITTER + " dora", mp3: "gagnant_dora"},
    {text: "felicitations", alternativeText: Configuration.USER_TWITTER + " felicitations", mp3: "gagnant_gilbert"},
    {text: "formidable", alternativeText: Configuration.USER_TWITTER + " formidable", mp3: "formidable"},
    {text: "foule", alternativeText: Configuration.USER_TWITTER + " foule", mp3: "foule"},
    {text: "the best", alternativeText: Configuration.USER_TWITTER + " the best", mp3: "simply the best"},
    {text: "perdu voix", alternativeText: Configuration.USER_TWITTER + " perdu voix", mp3: "perdu_voix"},
    {text: "perdu monstre", alternativeText: Configuration.USER_TWITTER + " perdu monstre", mp3: "perdu_monstre"},
    {text: "perdu trombone", alternativeText: Configuration.USER_TWITTER + " perdu trombone", mp3: "perdu_trombone"},
    {text: "perdu zombie attack", alternativeText: Configuration.USER_TWITTER + " perdu zombie attack", mp3: "perdu_zombie_attack"},
    {text: "perdu zombie loose", alternativeText: Configuration.USER_TWITTER + " perdu zombie loose", mp3: "perdu_zombie_loose"},
    {text: "gagne", alternativeText: Configuration.USER_TWITTER + " gagne", mp3: "gagnant_mireille"},
    {text: "champion", alternativeText: Configuration.USER_TWITTER + " champion", mp3: "gagnant_queen"}
];

Configuration.sounds = [
    {text: "perdu voix", alternativeText: Configuration.USER_TWITTER + " perdu voix", mp3: "perdu_voix"},
    {text: "perdu loose", alternativeText: Configuration.USER_TWITTER + " perdu loose", mp3: "perdu_loose"},
    {text: "perdu trombone", alternativeText: Configuration.USER_TWITTER + " perdu trombone", mp3: "perdu_trombone"},
    {text: "perdu r2d2", alternativeText: Configuration.USER_TWITTER + " perdu r2d2", mp3: "perdu_r2d2"},
    {text: "perdu mario", alternativeText: Configuration.USER_TWITTER + " perdu mario", mp3: "perdu_mario"},
    {text: "perdu motus", alternativeText: Configuration.USER_TWITTER + " perdu motus", mp3: "perdu_motus"}
];
