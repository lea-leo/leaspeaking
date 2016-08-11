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
	var PythonShell = require('python-shell');

	var options = {
		pythonPath: 'D:\\sqli\\outils\\Python34\\python',
		args: [msg]
	};

	console.log("J'écris sur le port série de l'arduino : " + msg.tweet);
	setTimeout(function() {
		Arduino.process.send({action: "END_SHOW_TWEET_ON_ARDUINO", tweet: msg.tweet});
	}, 10000);
	/*PythonShell.run('src/js/readSerial.py', options, function (err, results) {
	 if (err) {
	 console.log(err);
	 throw err;
	 }
	 return "coucou";
	 });*/
}

/**
 * Message handler pour la partie arduino
 * Il permet l'aiguillage au sein du code pour la partie arduino à effectuer
 * @param msg message contenant le type d'action à effectuer
 */
Arduino.messageHandler = function(msg) {
	console.log("\nArduino !!!");
	Arduino.writeDataOnSerial(msg);
};

module.exports = Arduino;
