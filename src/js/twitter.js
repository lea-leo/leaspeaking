var Twitter = require("twitter");
import * as arduino from "./arduino";

export function streamTwitter() {
	var client = new Twitter({
	  "consumer_key": process.env.TWITTER_CONSUMER_KEY,
	  "consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
	  "access_token_key": process.env.TWITTER_ACCESS_TOKEN_KEY,
	  "access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
	});

	var stream = client.stream('statuses/filter', {track: 'sqli_leo'});

	stream.on('data', function(tweet) {
	  console.log(tweet.text);
	  arduino.writeDataOnSerial(tweet.text);
	});
	 
	stream.on('error', function(error) {
	  throw error;
	});
}


