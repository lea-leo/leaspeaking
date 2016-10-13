var SerialPort = require('serialport');

var processConst = {
    ACTION: {
        SHOW_TWEET: 'SHOW_TWEET',
        SEND_TWEET: 'SEND_TWEET',
        LISTEN_TWEET: 'LISTEN_TWEET',
        END_SHOW_TWEET_ON_ARDUINO: 'END_SHOW_TWEET_ON_ARDUINO'
    }
};


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
 * Ecrit le tweet sur le port série de l'Arduino.
 * A cause du DTR, la librairie npm serialport ne fonctionne pas
 * il faut alors passer par un script python qui va lui physiquement
 * écrire sur le port série de l'Arduino.
 * @param data les données à écrire sur le port série
 */
Arduino.writeDataOnSerial = function(msg) {
	// Envoi du tweet par le port série avec serialPort
	console.log("Je suis dans writeDataOnSerial");
	if(arduinoPort == '' || arduinoPort == undefined) {
		console.log("Détermination du port de communication de l'Arduino");
		getCurrentPort(msg);
	} else {
		writeDataOnArduinoSerial(msg);
	}

}

/**
 * Message handler pour la partie arduino
 * Il permet l'aiguillage au sein du code pour la partie arduino à effectuer
 * @param msg message contenant le type d'action à effectuer
 */
Arduino.messageHandler = function(msg) {
	Arduino.writeDataOnSerial(msg);
};

/**
 * Détermine quel port correspond à l'arduino
 * @param msg
 */
function getCurrentPort(msg) {
	console.log("Je suis dans getCurrentPort");
	SerialPort.list(function(err, result) {
		console.log("Je suis dans list");
		result.filter(function(val) {
			if (val.manufacturer == "Arduino_LLC") {
				arduinoPortName = val.comName;
				arduinoPort = new SerialPort(arduinoPortName);
				sendDataOnArduinoSerial(msg);
				arduinoPort.on('open', function() {
					console.log("Le port de l'Arduino est ouvert !!!");
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
 * Ecriture sur le port série des données du tweet
 * @param msg
 */
function sendDataOnArduinoSerial(msg) {

	arduinoPort.on('open', function() {
		console.log("Le port de l'Arduino est ouvert !!!");
		//writeDataOnArduinoSerial(msg);
		/*arduinoPort.write("{ 'motion': '" + msg.motion + "', tweet:'" + msg.LCDText + "', 'rank':'" + msg.rank + "'}", function(err) {
			if (err) {
				return console.log('Error on write: ', err.message);
			}
			setTimeout(function() {
				console.log("LYNCHMANIAC Le tweet est fini d'afficher par l'arduino !");
				Arduino.process.send({action: processConst.ACTION.END_SHOW_TWEET_ON_ARDUINO, tweet: msg});
			}, 10000);
		});*/
	});

	// open errors will be emitted as an error event
	arduinoPort.on('error', function(err) {
		console.log('Error: ', err.message);
	});
}

function writeDataOnArduinoSerial(msg) {
	console.log("J'écris le tweet sur l'arduino");
	arduinoPort.write("{ 'motion': '" + msg.motion + "', tweet:'" + msg.LCDText + "', 'rank':'" + msg.rank + "'}", function(err) {
		if (err) {
			return console.log('Error on write: ', err.message);
		}
		setTimeout(function() {
			console.log("LYNCHMANIAC Le tweet est fini d'afficher par l'arduino !");
			Arduino.process.send({action: processConst.ACTION.END_SHOW_TWEET_ON_ARDUINO, tweet: msg});
		}, 10000);
	});
}
module.exports = Arduino;
