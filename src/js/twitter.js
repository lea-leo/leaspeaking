var Twitter = require("twitter");
import Tweet from "./models/tweet";

var client;
/**
 * Consdtructeur.
 * @constructor
 */
function Twitter () {
	/*client = new Twitter({
		"consumer_key": process.env.TWITTER_CONSUMER_KEY,
		"consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
		"access_token_key": process.env.TWITTER_ACCESS_TOKEN_KEY,
		"access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
	});*/
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

	var stream = client.stream('statuses/filter', {track: 'sqli_leo'});

	stream.on('data', function(tweetReceived) {
		console.log("Réception du tweet de " + tweetReceived.user.name);
		var tweet = new Tweet(tweetReceived.user.name, tweetReceived.user.screen_name, tweetReceived.text);
		console.log("Message du tweet : " + tweet.text);
		Twitter.process.send({action: "SHOW_TWEET", tweet: tweet});
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
	} else if (msg.action == "SEND_TWEET") {
		console.log("Un tweet gagnant");
		Twitter.sendTweet(msg.winner);
	}
};



Twitter.sendTweet = function(winner) {
	console.log("envoi du tweet gagnant");

	client.post('statuses/update', {status: '@' + winner + ' a gagné un panier garni'},  function(error, tweet, response) {
		//if(error) throw error;
		console.log("Un gagnant a été tweeté");
        //console.log(tweet);  // Tweet body.
		//console.log(response);  // Raw response object.
	});
};

module.exports = Twitter;