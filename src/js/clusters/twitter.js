var Twitter = require("twitter");

import Utils from "../helpers/utils";
import Tweet from "../models/tweet";
import Configuration from "../config/configuration";

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
	client = new Twitter({
		"consumer_key": process.env.TWITTER_CONSUMER_KEY,
		"consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
		"access_token_key": process.env.TWITTER_ACCESS_TOKEN_KEY,
		"access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
	});

	var stream = client.stream('statuses/filter', {track: '@sqli_leo'});

	stream.on('data', function(tweetReceived) {
		console.log("tweet reçu");
		if (!tweetReceived.retweeted_status) {
			var tweet = new Tweet(tweetReceived.user.name, tweetReceived.user.screen_name, tweetReceived.text);
			Twitter.process.send({action: Configuration.processConst.ACTION.SHOW_TWEET, tweet: tweet});
		}
	});

	stream.on('error', function(error) {
		throw error;
	});
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
