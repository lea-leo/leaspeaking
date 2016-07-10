"use strict";

import express from "express";

var app = express();

var Twitter = require("twitter");

var client = new Twitter({
  "consumer_key": process.env.TWITTER_CONSUMER_KEY,
  "consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
  "access_token_key": process.env.TWITTER_ACCESS_TOKEN_KEY,
  "access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var stream = client.stream('statuses/filter', {track: 'sqli_leo'});
stream.on('data', function(tweet) {
  console.log(tweet.text);
  writeDataOnSerial(tweet.text);
});
 
stream.on('error', function(error) {
  throw error;
});
 

function writeDataOnSerial(data) {
	var PythonShell = require('python-shell');
	 
	var options = {
	  pythonPath: 'D:\\sqli\\outils\\Python34\\python',
	  args: [data]
	};
	 
	PythonShell.run('src/js/writeSerial.py', options, function (err, results) {
	  if (err) {
	    console.log(err);
	    throw err;
	  }
	});
}

app.listen(8080, () => {console.log("Express start...");});



