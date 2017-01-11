import Sound from "../../dist/js/helpers/sound";
import Utils from "../../dist/js/helpers/utils";
import Tweet from "../../dist/js/models/tweet";
import Configuration from "../../dist/js/config/configuration";
import Context from "../../dist/js/models/context";

import fs from 'fs';

// Test chooseSound function
describe("renvoie le nom du fichier son à lancer", function() {

    
    it("Devrait retourner un son aléatoire", function() {
        let tweet = new Tweet("UserName", "ScreenName", "coucou le monde");
        Configuration.sounds.push({text: "TU", alternativeText: Configuration.USER_TWITTER + " TU", mp3: "Mp3TUFile"});
        spyOn(Utils, 'getRandomInt').and.returnValue(Configuration.sounds.length - 1);
        let result = Sound.chooseSound(tweet);
        expect(result).not.toBe(undefined);
        expect(result).not.toBe(null);
        expect(result).toEqual(jasmine.any(String));
        expect(result).toBe("Mp3TUFile");
    });

    it("Devrait retourner un son d'un easter egg basé sur le texte", function() {
        let tweet = new Tweet("UserName", "ScreenName", "TU In action");
        Configuration.easterEggs.push({text: "TU In action", alternativeText: Configuration.USER_TWITTER + " TU In action", mp3: "TUActionMp3"});
        let result = Sound.chooseSound(tweet);
        expect(result).not.toBe(undefined);
        expect(result).not.toBe(null);
        expect(result).toEqual(jasmine.any(String));
        expect(result).toBe("TUActionMp3");
    });

    it("Devrait retourner un son d'un easter egg basé sur le texte alternatif", function() {
        let tweet = new Tweet("UserName", "ScreenName", Configuration.USER_TWITTER + " TU Alternatif In action");
        Configuration.easterEggs.push({text: "TU XXXX", alternativeText: Configuration.USER_TWITTER + " TU Alternatif", mp3: "TUAlternatifMp3"});
        let result = Sound.chooseSound(tweet);
        expect(result).not.toBe(undefined);
        expect(result).not.toBe(null);
        expect(result).toEqual(jasmine.any(String));
        expect(result).toBe("TUAlternatifMp3");
    });

    it("test", function() {
        var winston = require('winston');
        var logger = new (winston.Logger)({
            transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({ filename: 'somefile.log' })
            ]
        });
logger.log("info", "File: was found");
    
        logger.log('info', 'Hello distributed log files!');
        logger.info('Hello again distributed logs');

        logger.level = 'debug';
        logger.log('debug', 'Now my debug messages are written to console!');
    });
});

/*

    static playSound(file) {
        fs.createReadStream('sounds/' + file + '.mp3')
            .pipe(new lame.Decoder())
            .on('format', function (format) {
                this.pipe(new Speaker(format));
            });
    }

    static playSong(song){
        var player = new StreamPlayer();

        // Ajout de la chanson à jouer
        player.add(song);
        // début de la lecture
        player.play();
    }*/

