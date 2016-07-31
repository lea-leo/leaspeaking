"use strict";

const cluster = require('cluster');
const http = require('http');

import * as twitter from "./twitter";
import * as arduino from "./arduino";

var clusterTwitter;
var clusterArduino;

if (cluster.isMaster) {

	// Réception des messages provenant des workers
	function messageHandler(msg) {
		if (msg.cmd && msg.cmd == 'notifyRequest') {
		  numReqs += 1;
		}
		if (msg.cmd && msg.cmd == 'tweetReceive') {
		  clusterArduino.send({tweet: msg.tweet});
		}
	}

	// Création du worker contenant le code Twitter et ajout d'un handler
	clusterTwitter = cluster.fork({workerName: "twitter"});
	clusterTwitter.on('message', messageHandler);

	// Création du worker contenant le code arduino et ajout d'un handler
	clusterArduino = cluster.fork({workerName: "arduino"});
	clusterArduino.on('message', messageHandler);

} else {
	if(process.env.workerName=="twitter"){
		// Lancement de l'écoute de l'API Twitter streaming
		twitter.streamTwitter();
    }

    if(process.env.workerName=="arduino"){
    	// Ecoute du message en provenance du Master
		process.on('message', function(msg) {
	    	arduino.writeDataOnSerial(msg.tweet); 
	  	});
    }
}


