import Configuration from "../config/configuration";
import Utils from "./utils";

import fs from 'fs';
import logger from "../helpers/log";

// Audio
import lame from 'lame';
import Speaker from 'speaker';
import StreamPlayer from 'stream-player';

export default class Sound {

    static chooseSound(tweet) {
        let result = Configuration.easterEggs.find(function(sound) {
            return tweet.text.startsWith(sound.text) || tweet.text.startsWith(sound.alternativeText);
        });

        if (!result) {
            // On n'a pas trouvé de son "spécial easter egg"
            // Il faut du coup choisir un son au hasard
            let indice = Utils.getRandomInt(0,Configuration.sounds.length - 1);
            result = Configuration.sounds[indice].mp3;
        } else {
            result = result.mp3;
        }
        return result;
    }

    static playSound(file) {
        if (fs.existsSync('sounds/' + file + '.mp3')) {
            fs.createReadStream('sounds/' + file + '.mp3')
                .pipe(new lame.Decoder())
                .on('format', function (format) {
                    this.pipe(new Speaker(format));
                });
        } else {
            logger.log('error', 'Aucun fichier son existe sous le nom : ' + file);
        }
    }

    static playSong(song){
        let player = new StreamPlayer();

        // Ajout de la chanson à jouer
        player.add(song);
        // début de la lecture
        player.play();
    }

}