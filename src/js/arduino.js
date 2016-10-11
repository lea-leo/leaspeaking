var processConst = {
    ACTION: {
        SHOW_TWEET: 'SHOW_TWEET',
        SEND_TWEET: 'SEND_TWEET',
        LISTEN_TWEET: 'LISTEN_TWEET',
        END_SHOW_TWEET_ON_ARDUINO: 'END_SHOW_TWEET_ON_ARDUINO'
    }
};

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
	//console.log("Le msg dans writeDataOnSerial");
	//console.log(msg);
    var options = {
		pythonPath: 'C:\\Python27\\python',//process.env.PYTHON_PATH'D:\\sqli\\outils\\Python34\\python',
		args: ["{ 'motion': '" + msg.motion + "', tweet:'" + msg.LCDText + "', 'rank':'" + msg.rank + "'}"],
		mode: 'text'
	};

	console.log("J'écris sur le port série de l'arduino : " + msg.LCDText);
	var shell = new PythonShell('src/js/writeSerial.py', options);

	shell.on('message', function(message) {
		console.log("Je suis dans la section message");
		console.log(message);
	});

	shell.end(function() {
		setTimeout(function() {
			console.log("LYNCHMANIAC Le tweet est fini d'afficher par l'arduino !");
			Arduino.process.send({action: processConst.ACTION.END_SHOW_TWEET_ON_ARDUINO, tweet: msg});
		}, 10000);
	});


	/*PythonShell.run('src/js/writeSerial.py', options, function (err, results) {
	 if (err) {
	 	console.log(err);
	 	throw err;
	 }
	 //console.log("Le tweet est fini d'afficher par l'arduino !" + results);
	 //Arduino.process.send({action: "END_SHOW_TWEET_ON_ARDUINO", tweet: msg.tweet});
	 return "coucou";
	 }).end(function() {
		console.log("LYNCHMANIAC Le tweet est fini d'afficher par l'arduino !");
		Arduino.process.send({action: "END_SHOW_TWEET_ON_ARDUINO", tweet: msg.tweet});
	});*/
}

/**
 * Message handler pour la partie arduino
 * Il permet l'aiguillage au sein du code pour la partie arduino à effectuer
 * @param msg message contenant le type d'action à effectuer
 */
Arduino.messageHandler = function(msg) {
    //console.log("\nArduino !!!" + msg);
    //console.log("\nArduino !!!" + msg);
	Arduino.writeDataOnSerial(msg);
};

module.exports = Arduino;
