// Lancement du script pyhton pour écrire sur le port sérial
export function writeDataOnSerial(data) {
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
