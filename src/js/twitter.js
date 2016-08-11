var Twitter = require("twitter");
import Tweet from "./models/tweet";

/**
 * Consdtructeur.
 * @constructor
 */
function Twitter () {

}

/**
 * Ecoute des tweets grâce à l'API streaming de twitter.
 * Les credentials sont fixés par des variables d'environnement
 */
Twitter.streamTwitter = function() {
	var client = new Twitter({
		"consumer_key": process.env.TWITTER_CONSUMER_KEY,
		"consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
		"access_token_key": process.env.TWITTER_ACCESS_TOKEN_KEY,
		"access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
	});

	var stream = client.stream('statuses/filter', {track: 'sqli_leo'});

	stream.on('data', function(tweet) {
		console.log("Réception du tweet de " + tweet.user.name);
		var message = new Tweet(tweet.user.name, tweet.user.screen_name, tweet.text);
		console.log("Message du tweet : " + message.text);
		Twitter.process.send({action: "SHOW_TWEET", text: message});
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
	console.log("\nDéclenchement de la partie Twitter !!!");
	if (msg.action == "LISTEN_TWEET") {
		Twitter.streamTwitter();
	}
};

module.exports = Twitter;