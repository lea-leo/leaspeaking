import TwitterAPI from "twitter";

import Tweet from "../models/tweet";
import Configuration from "../config/configuration";
import Sound from "../helpers/sound";
import Context from "../models/context";
import Utils from "../helpers/utils";
import logger from "../helpers/log";

var client;

/**
 * Constructeur.
 * @constructor
 */
function Twitter () {

}

/**
 * Ecoute des tweets grâce à l'API streaming de twitter.
 * Les credentials sont fixés par des variables d'environnement
 */
Twitter.streamTwitter = function() {

 	client = new TwitterAPI({
	 "consumer_key": process.env.TWITTER_CONSUMER_KEY,
	 "consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
	 "access_token_key": process.env.TWITTER_ACCESS_TOKEN_KEY,
	 "access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
	 });

	let stream = client.stream('statuses/filter', {track: 'devfest_lea'});

	stream.on('data', function(tweetReceived) {
		 if (!tweetReceived.retweeted_status) {
			  
			 logger.log('debug', "isAdmin : " + Utils.isAdmin(tweetReceived.user.screen_name));
			 logger.log('debug', "isDemoOn : " + Utils.isDemoOn(tweetReceived));
			 logger.log('debug', "isDemonOff : " + Utils.isDemoOff(tweetReceived));
			 // Si on est un admin et que l'on demande l'activation du mode démo, alors on l'active
			 if (Utils.isAdmin(tweetReceived.user.screen_name) && Utils.isDemoOn(tweetReceived)) {
				 logger.log('debug', "Etape 1");
				 Context.isDemoMode = true;
			 // Si on est un admin et que l'on demande la désactivation du mode démo, alors on le désactive
			 } else if (Utils.isAdmin(tweetReceived.user.screen_name) && Utils.isDemoOff(tweetReceived)) {
				 logger.log('debug', "Etape 2");
				 Context.isDemoMode = false;
			 }
			 logger.log('debug', "Etape 3");
			 // Si on n'est pas en mode démo et qu'on ne vient pas juste de le désactiver
			 if (!Utils.isDemoOff(tweetReceived) && !Utils.isDemoOn(tweetReceived)) {
				 if (!Context.isDemoMode) {
					 logger.log('debug', "Etape 4");
					 Twitter.receivingTweet(tweetReceived);
				 // Si on est admin
				 } else if (Utils.isAdmin(tweetReceived.user.screen_name)) {
					 logger.log('debug', "Etape 5");
					 Twitter.receivingTweet(tweetReceived);
				 }
			 }
		 }
	});

	stream.on('error', function(error) {
		throw error;
	});
}

Twitter.receivingTweet = function(tweetReceived) {
	let tweet = new Tweet(tweetReceived.user.name, tweetReceived.user.screen_name, tweetReceived.text);
	// Il faut choisir le son associé au tweet
	tweet.sound = Sound.chooseSound(tweet);
	Twitter.process.send({action: Configuration.processConst.ACTION.SHOW_TWEET, tweet: tweet});
}

/**
 * Message handler pour la partie twitter
 * Il permet l'aiguillage au sein du code pour la partie twitter à effectuer
 * @param msg message contenant le type d'action à effectuer
 */
Twitter.messageHandler = function(msg) {
	if (msg.action == Configuration.processConst.ACTION.LISTEN_TWEET) {
		Twitter.streamTwitter();
	} else if (msg.action == Configuration.processConst.ACTION.SEND_TWEET) {
		Twitter.sendTweet(msg.winner);
	}
};



Twitter.sendTweet = function(winner) {
	client.post('statuses/update', {status: 'Grâce à Lèa, @' + winner + ' a gagné un lot SQLi. Merci de venir le retirer sur le stand SQLi du Devfest.'},  function(error, tweet, response) {
		if(error) {
			throw error;
		}
		logger.log('info', 'Un tweet gagnant a été envoyé');
	});
};

module.exports = Twitter;
