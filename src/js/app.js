var cluster = require('cluster');

var Arduino = require("./arduino");
var Twitter = require("./twitter");

var freshTweets = [];
var historicTweets = [];

if (cluster.isWorker) {

  console.log('Worker ' + process.pid + ' has started.');

  if (process.env['type'] == "CLUSTER_TWITTER") {
    console.log('Je fixe le process pour twitter');
    Twitter.process = process;
	process.on('message', Twitter.messageHandler);
  } else if (process.env['type'] == "CLUSTER_ARDUINO") {
    console.log('Je fixe le process pour arduino');
    Arduino.process = process;
	process.on('message', Arduino.messageHandler);
  }
}


if (cluster.isMaster) {

	var clusterArduino;
	var clusterTwitter;

	// Fork workers.
	clusterTwitter = cluster.fork({type: "CLUSTER_TWITTER"});
  
	// Fork workers.
	clusterArduino = cluster.fork({type: "CLUSTER_ARDUINO"});

	// Ajout du handler message pour le cluster Twitter
	clusterTwitter.on('message', function(msg) {
		console.log("\nMaster !!!");
		if (msg.action == "SHOW_TWEET") {
		  console.log("j'ai un tweet à envoyé à l'arduino");
          freshTweets.push(msg.tweet);
          console.log(freshTweets);
          clusterArduino.send(msg.text);

		} 
	});

	// Ajout du handler message pour le cluster Arduino
	clusterArduino.on('message', function(msg) {
		console.log("\nMaster !!!");
		if (msg.action == "END_SHOW_TWEET_ON_ARDUINO") {
		  console.log("j'ai un tweet terminé");
          historicTweets.push(msg.tweet);
          //freshTweets.splice(_.indexOf(freshTweets, _.find(freshTweets, function (item) { return item === msg.tweet; })), 1);
          console.log(historicTweets);
		}
	});

	// temps de latence pour permettre l'initialisation des workers
	// avant de lancer l'API streaming Twitter
	setTimeout(function() {
		console.log("Branchement de l'API Streaming Twitter !!!\n");
		clusterTwitter.send({action: "LISTEN_TWEET"});
	}, 1000);

}