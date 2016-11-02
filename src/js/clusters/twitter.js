//var Twitter = require("twitter");
var Twitter = require('node-tweet-stream');

import Tweet from "../models/tweet";
import Configuration from "../config/configuration";
import Sound from "../helpers/sound";
import Context from "../models/context";
import Utils from "../helpers/utils";

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
	/*client = new Twitter({
		"consumer_key": process.env.TWITTER_CONSUMER_KEY,
		"consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
		"access_token_key": process.env.TWITTER_ACCESS_TOKEN_KEY,
		"access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
	});*/
	var t = new Twitter({
		"consumer_key": process.env.TWITTER_CONSUMER_KEY,
		"consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
		"token": process.env.TWITTER_ACCESS_TOKEN_KEY,
		"token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
	});

	t.on('tweet', function (tweetReceived) {
		if (!tweetReceived.retweeted_status) {
			console.log("isAdmin : " + Utils.isAdmin(tweetReceived.user.screen_name));
			console.log("isDemoOn : " + Utils.isDemoOn(tweetReceived));
			console.log("isDemonOff : " + Utils.isDemoOff(tweetReceived));
			// Si on est un admin et que l'on demande l'activation du mode démo, alors on l'active
			if (Utils.isAdmin(tweetReceived.user.screen_name) && Utils.isDemoOn(tweetReceived)) {
				console.log("Etape 1");
				Context.isDemoMode = true;
			// Si on est un admin et que l'on demande la désactivation du mode démo, alors on le désactive
			} else if (Utils.isAdmin(tweetReceived.user.screen_name) && Utils.isDemoOff(tweetReceived)) {
				console.log("Etape 2");
				Context.isDemoMode = false;
			}
			console.log("Etape 3");
			// Si on n'est pas en mode démo et qu'on ne vient pas juste de le désactiver
			if (!Utils.isDemoOff(tweetReceived) && !Utils.isDemoOn(tweetReceived)) {
				if (!Context.isDemoMode) {
					console.log("Etape 4");
					Twitter.receivingTweet(tweetReceived);
					// Si on est admin
				} else if (Utils.isAdmin(tweetReceived.user.screen_name)) {
					console.log("Etape 5");
					Twitter.receivingTweet(tweetReceived);
				}
			}
			console.log("Etape 6");
		}
	});
	t.on('error', function (err) {
		console.log('Oh no ' + err);
	});

	t.track('devfest_lea');

	//var stream = client.stream('statuses/filter', {track: '@devfest_lea'});

	/*stream.on('data', function(tweetReceived) {
		if (!tweetReceived.retweeted_status) {
			var tweet = new Tweet(tweetReceived.user.name, tweetReceived.user.screen_name, tweetReceived.text);
			// Il faut choisir le son associé au tweet
			tweet.sound = Sound.chooseSound(tweet);
			Twitter.process.send({action: Configuration.processConst.ACTION.SHOW_TWEET, tweet: tweet});
		}
	});

	stream.on('error', function(error) {
		throw error;
	});*/
}

Twitter.receivingTweet = function(tweetReceived) {
	var tweet = new Tweet(tweetReceived.user.name, tweetReceived.user.screen_name, tweetReceived.text);
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
		console.log("Un tweet gagnant a été envoyé");
	});
};

module.exports = Twitter;
