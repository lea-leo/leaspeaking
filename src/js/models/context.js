"use strict"


export default class Context {

    constructor() {


        /*
         * La liste des tweets jamais affiché par l'Arduino.
         * Ces Tweets doivent être affiché par le LCD de Léa
         * de manière prioritaire.
         */
        this.freshTweets = [];

        /*
         * La liste des tweets déjà affiché par l'Arduino.
         * En l'absence de nouveaux tweet, le programme
         * pioche aléatoirement dans les anciens tweets
         * pour les afficher.
         */
        this.historicTweets = [];

        /*
         * Indique si un tweet est en cours d'affichage par l'Arduino.
         * Dans ce cas, il ne faut pas déclencher l'affichage d'un
         * tweet plus récent.
         */
        this.isTweetDisplayed = false;
        this.tweetDisplayed = false;

        /*
         * Indique si Léa est en état de marche ou pas.
         * Léa est désactivable à distance par l'intermédiaire
         * d"un envoi de tweet. Elle réactivable par le même biai.
         */
        this.isLeaSpeaking  = true;

        /*
         * Indique le numéro d'arrivée du tweet.
         * Il faut prévoir la sauvegarde pour chaque twet reçu
         */
        this._rank;

        /*
         * Liste des paliers gagnants
         */
        this.gamification;
   }
}
