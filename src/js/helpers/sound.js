var fs = require('fs');

import Configuration from "../config/configuration";
import Utils from "./utils";

// Audio
var lame = require('lame');
var Speaker = require('speaker');

export default class Sound {

    static chooseSound(tweet) {
        var result = Configuration.easterEggs.find(function(sound) {
            return tweet.text.startsWith(sound.text) || tweet.text.startsWith(sound.alternativeText);
        });

        if (!result) {
            // On n'a pas trouvé de son "spécial easter egg"
            // Il faut du coup choisir un son au hasard
            var indice = Utils.getRandomInt(0,Configuration.sounds.length - 1);
            result = Configuration.sounds[indice].mp3;
        } else {
            result = result.mp3;
        }
        return result;
    }

    static playSound(file) {
        fs.createReadStream('sounds/' + file + '.mp3')
            .pipe(new lame.Decoder())
            .on('format', function (format) {
                this.pipe(new Speaker(format));
            });
    }

}