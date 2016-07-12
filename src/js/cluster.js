var recluster = require("recluster");
var path = require("path");
var fs = require('fs');



var cluster = recluster(path.join(__dirname, "app.js"), {
  workers: 2
});

console.log(cluster.isMaster);

cluster.run();

process.on("SIGUSR2", function() {
  console.log("Signal SIGUSR2 reçu, Rechargement du cluster ...");
  cluster.reload();
});


fs.watchFile("package.json", function(curr, prev) {
  console.log("Package.json changé, rechargement du cluster ...");
  cluster.reload();
});

console.log("Cluster démarré, Utilisez la commande 'kill -s SIGUSR2 " + process.pid + "' pour le recharger.");