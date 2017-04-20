import Configuration from "../config/configuration";
import logger from "../helpers/log";
import Tweet from "../models/tweet";
import * as Utils from "../helpers/utils";
import Context from "../models/context";

  const record = require('node-record-lpcm16');
  const {Detector, Models} = require('snowboy');

  const models = new Models();

/**
 * Consdtructeur.
 * @constructor
 */
function Snowboy () {

}

/**
 * Message handler pour la partie arduino
 * Ecrit le tweet sur le port série de l'Arduino.
 * A cause du DTR, la librairie npm serialport ne fonctionne pas
 * il faut alors passer par un script python qui va lui physiquement
 * écrire sur le port série de l'Arduino.
 * @param data les données à écrire sur le port série
 */
Snowboy.messageHandler = function(msg) {
    listen(msg);
};


/**
 * Ecriture du tweet sur le port série de l'Arduino à l'aide de la librairie
 * Serialport. un setTimeout permet de fixer la durée de l'affichage à 10s par tweet.
 * @param msg
 */
function listen(tweet) {
  models.add({file: 'config/bonjourjarvis.pmdl', sensitivity: '0.4', hotwords : 'bonjour jarvis'});
  models.add({file: 'config/réveille toi léa.pmdl', sensitivity: '0.5', hotwords : 'réveille toi léa'});
    
  const detector = new Detector({
    resource: "config/common.res",
    models: models,
    audioGain: 2.0
  });

  detector.on('hotword', function (index, hotword) {
    let text = '';
    let motion = '';
    let sound = '';

    if (hotword === 'bonjour jarvis') {
      text = 'réveille toi léa';
    } else if (hotword === 'réveille toi léa') {
      text = 'bonjour jarvis';
    } else if (index === 3) {
      text = 'Bonjour, je bouge le bras gauche...';
      motion = Configuration.CLASSIC_MOTIONS[2];
    } else if (index === 4) {
      text = 'Bonjour, je bouge le bras droit...';
      motion = Configuration.CLASSIC_MOTIONS[3];
    } else if (index === 5) {
      text = 'Au revoir Léa...';
    } else if (index === 6) {
      text = 'Je suis ton père...';
    } else if(index === 7) {
      text = 'Je suis ton père...';
    }
    if (text !== '') {
      let tweet = new Tweet('', '', text);
      if (motion) {
        tweet.motion = motion
      }
      tweet.sound = Utils.getRandomMotion(tweet.sound);
      Snowboy.process.send({action: Configuration.processConst.ACTION.SHOW_TWEET, tweet: tweet, isLeaSpeaking: true});
    }
    
  });

  const mic = record.start({
    threshold: 0,
    verbose: true
  });

  mic.pipe(detector);
}
module.exports = Snowboy;
