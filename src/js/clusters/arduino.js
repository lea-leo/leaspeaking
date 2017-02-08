import SerialPort from 'serialport';

import { playSound } from "../helpers/sound";
import Configuration from "../config/configuration";
import logger from "../helpers/log";

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
  if (arduinoPort == '' || arduinoPort == undefined) {
    // Détermination du port de communication de l'Arduino
    logger.log('info', "Le port de l'Arduino est absent. Il faut le déterminer...");
    getCurrentPort(msg);
  } else {
    // Ecriture sur le port série de l'Arduino
    logger.log('info', "Ecriture sur le port série de l'Arduino");
    writeDataOnArduinoSerial(msg);
  }
};

/**
 * Détermine quel port correspond à l'arduino
 * @param msg
 */
function getCurrentPort(msg) {
  SerialPort
    .list(function(err, result) {
      result
        .filter(function(val) {
          if (val.manufacturer && val.manufacturer.toLowerCase().startsWith("arduino")) {
            arduinoPortName = val.comName;
            arduinoPort = new SerialPort(arduinoPortName);
            arduinoPort.on('open', function() {
              writeDataOnArduinoSerial(msg);
            });
            // open errors will be emitted as an error event
            arduinoPort.on('error', function(err) {
              logger.log('error', 'Error: ', err.message);
            });
          } else {
            logger.log('error', 'Impossible de trouver un arduino connecté....')
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
  logger.log('debug', 'écriture du tweet : ' + tweet.LCDText);
  arduinoPort.write("{ 'motion': '" + tweet.motion + "', tweet:'" + tweet.LCDText + "', 'rank':'" + tweet.rank + "'}", function(err) {
    if (err) {
      return logger.log('error', 'Error on write: ', err.message);
    }
    if (!tweet.isSpecial) {
      if (tweet.fresh) {
        logger.log('debug', 'Attente de 2,5 s - ' + process.pid);
        setTimeout(function() {
          playSound(tweet.sound);
          setTimeout(function() {
            logger.log('info', "Le nouveau tweet vient de finir de s'afficher sur l'arduino !");
            Arduino
              .process
              .send({action: Configuration.processConst.ACTION.END_SHOW_TWEET_ON_ARDUINO, tweet: tweet});
          }, 7500);
        }, 2500);

      } else {
        setTimeout(function() {
          logger.log('debug', "Le tweet historique vient de finir de s'afficher sur l'arduino !");
          Arduino
            .process
            .send({action: Configuration.processConst.ACTION.END_SHOW_TWEET_ON_ARDUINO, tweet: tweet});
        }, 10000);
      }
    }

  });
}
module.exports = Arduino;