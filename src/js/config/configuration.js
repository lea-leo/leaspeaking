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
//Configuration.ADMINS = ["thedireizh", "lynchmaniacPL", "devfest_lea", "fwlodarezack", "ahoudre", "AdrienLASSELLE"];
Configuration.ADMINS = ["thedireizh", "lynchmaniacPL", "fwlodarezack", "ahoudre", "AdrienLASSELLE"];

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

Configuration.easterEggs = [
    {text: "rigole", alternativeText: "@sqli_leo rigole", mp3: "sos"},
    {text: "gangster", alternativeText: "@sqli_leo gangster", mp3: "affranchis"},
    {text: "colle", alternativeText: "@sqli_leo colle", mp3: "colle"},
    {text: "exorciste", alternativeText: "@sqli_leo exorciste", mp3: "exorciste"},
    {text: "diable", alternativeText: "@sqli_leo diable", mp3: "diale"},
    {text: "lot1", alternativeText: "@sqli_leo lot1", mp3: "lot1"},
    {text: "lot2", alternativeText: "@sqli_leo lot2", mp3: "lot2"},
    {text: "lot3", alternativeText: "@sqli_leo lot3", mp3: "lot3"},
        {text: "perdu1", alternativeText: "@sqli_leo perdu1", mp3: "perdu1"},
    {text: "dora", alternativeText: "@sqli_leo dora", mp3: "c gagné"},
    {text: "felicitations", alternativeText: "@sqli_leo felicitations", mp3: "félicitations"},
    {text: "feu artifice", alternativeText: "@sqli_leo feu artifice", mp3: "feu artifice"},
    {text: "formidable", alternativeText: "@sqli_leo formidable", mp3: "formidable"},
    {text: "foule", alternativeText: "@sqli_leo foule", mp3: "foule"},
    {text: "the best", alternativeText: "@sqli_leo the best", mp3: "simply the best"},
    {text: "gagne", alternativeText: "@sqli_leo gagne", mp3: "tu as gagné"},
    {text: "champion", alternativeText: "@sqli_leo champion", mp3: "we are the champion"}
];

Configuration.sounds = [
    {text: "perdu1", alternativeText: "@sqli_leo perdu1", mp3: "perdu1"},
    {text: "feu artifice", alternativeText: "@sqli_leo feu artifice", mp3: "feu artifice"},
    {text: "formidable", alternativeText: "@sqli_leo formidable", mp3: "formidable"},
    {text: "foule", alternativeText: "@sqli_leo foule", mp3: "foule"},
    {text: "the best", alternativeText: "@sqli_leo the best", mp3: "simply the best"}
];
