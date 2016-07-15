"use strict";

const cluster = require('cluster');
const http = require('http');

import * as twitter from "./twitter";
import * as arduino from "./arduino";

var clusterTwitter;
var clusterArduino;

if (cluster.isMaster) {

	//console.log("Je suis le master");

	// Message
	function messageHandler(msg) {
		if (msg.cmd && msg.cmd == 'notifyRequest') {
		  numReqs += 1;
		}
		if (msg.cmd && msg.cmd == 'tweetReceive') {
		  //console.log("MESSAGE DU MASTER");
		  //console.log(msg.tweet);
		  clusterArduino.send({tweet: msg.tweet});
		}
	}

	// Start workers and listen for messages containing notifyRequest
	clusterTwitter = cluster.fork({workerName: "twitter"});
	clusterTwitter.on('message', messageHandler);

	clusterArduino = cluster.fork({workerName: "arduino"});
	clusterArduino.on('message', messageHandler);

} else {
	if(process.env.workerName=="twitter"){
		//console.log("Lancement worker twitter : " + cluster.worker.id);
		twitter.streamTwitter();
    }

    if(process.env.workerName=="arduino"){
		//console.log("Lancement worker arduino : " + cluster.worker.id);
		process.on('message', function(msg) {
	    	//console.log('Worker ' + process.pid + ' received message from master.', msg.tweet);
	    	arduino.writeDataOnSerial(msg.tweet); 
	  	});
    }
}


