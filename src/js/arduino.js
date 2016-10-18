var SerialPort = require('serialport');

import Sound from "./sound";
import Utils from "./utils";


// Port arduino
var arduinoPortName;
var arduinoPort;

/**
 * Consdtructeur.
 * @constructor
 */
function Arduino () {

}

/**
 * Message handler pour la partie arduino
 * Ecrit le tweet sur le port série de l'Arduino.
 * A cause du DTR, la librairie npm serialport ne fonctionne pas
 * il faut alors passer par un script python qui va lui physiquement
 * écrire sur le port série de l'Arduino.
 * @param data les données à écrire sur le port série
 */
Arduino.messageHandler = function(msg) {
	// Envoi du tweet par le port série avec serialPort
	if(arduinoPort == '' || arduinoPort == undefined) {
		// Détermination du port de communication de l'Arduino
		getCurrentPort(msg);
	} else {
	    // Ecriture sur le port de communication de l'Arduino
		writeDataOnArduinoSerial(msg);
	}
};

/**
 * Détermine quel port correspond à l'arduino
 * @param msg
 */
function getCurrentPort(msg) {
	SerialPort.list(function(err, result) {
		result.filter(function(val) {
			if (val.manufacturer == "Arduino_LLC") {
				arduinoPortName = val.comName;
				arduinoPort = new SerialPort(arduinoPortName);
				arduinoPort.on('open', function() {
					writeDataOnArduinoSerial(msg);
				});
				// open errors will be emitted as an error event
				arduinoPort.on('error', function(err) {
					console.log('Error: ', err.message);
				});
			}
		});
	});
}

/**
 * Ecriture du tweet sur le port série de l'Arduino à l'aide de la librairie
 * Serialport. un setTimeout permet de fixer la durée de l'affichage à 10s par tweet.
 * @param msg
 */
function writeDataOnArduinoSerial(tweet) {
	arduinoPort.write("{ 'motion': '" + tweet.motion + "', tweet:'" + tweet.LCDText + "', 'rank':'" + tweet.rank + "'}", function(err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}

		if (tweet.fresh) {
			setTimeout(function() {
				console.log("Attente de 2,5 s - " + process.pid);
				if (tweet.winner) {
					Sound.playSound("lot3");
				} else {
					Sound.chooseSound(tweet);
				}
				setTimeout(function() {
					console.log("LYNCHMANIAC Le tweet est fini d'afficher par l'arduino !");
					Arduino.process.send({action: Utils.processConst.ACTION.END_SHOW_TWEET_ON_ARDUINO, tweet: tweet});
				}, 7500);
			}, 2500);

		} else {
			setTimeout(function() {
				console.log("LYNCHMANIAC Le tweet est fini d'afficher par l'arduino !");
				Arduino.process.send({action: Utils.processConst.ACTION.END_SHOW_TWEET_ON_ARDUINO, tweet: tweet});
			}, 10000);
		}

	});
}

/*Arduino.writeInitMessage = function() {
	console.log(Utils.TEXT_LEA_PAUSE);
    arduinoPort.write("{ 'motion': 'Null', tweet:'" + Utils.TEXT_LEA_PAUSE +"', 'rank':'0'}", function(err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
    });
}*/

module.exports = Arduino;
