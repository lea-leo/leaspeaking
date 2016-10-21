var fs = require('fs');

// Audio
var lame = require('lame');
var Speaker = require('speaker');

export default class Sound {

    /*var easterEggs = {
        current: {
            CLUSTER_TWITTER: 'CLUSTER_TWITTER',
            CLUSTER_ARDUINO: 'CLUSTER_ARDUINO'
        },
        eastereggs: {
            SHOW_TWEET: 'SHOW_TWEET',
            SEND_TWEET: 'SEND_TWEET',
            LISTEN_TWEET: 'LISTEN_TWEET',
            END_SHOW_TWEET_ON_ARDUINO: 'END_SHOW_TWEET_ON_ARDUINO'
        }
    };*/

    static chooseSound(tweet) {
        if (tweet.text.startsWith("cri") || tweet.text.startsWith("@sqli_leo cri")) {
            Sound.playSound("gemissement");
        } else if (tweet.text.startsWith("rigole") || tweet.text.startsWith("@sqli_leo rigole")) {
            Sound.playSound("sos");
        } else if (tweet.text.startsWith("gangster") || tweet.text.startsWith("@sqli_leo gangster")) {
            Sound.playSound("affranchis");
        } else if (tweet.text.startsWith("colle") || tweet.text.startsWith("@sqli_leo colle")) {
            Sound.playSound("colle");
        } else if (tweet.text.startsWith("diable") || tweet.text.startsWith("@sqli_leo diable")) {
            Sound.playSound("diable");
        } else if (tweet.text.startsWith("exorciste") || tweet.text.startsWith("@sqli_leo exorciste")) {
            Sound.playSound("exorciste");
        } else if (tweet.text.startsWith("lot1") || tweet.text.startsWith("@sqli_leo lot1")) {
            Sound.playSound("lot1");
        } else if (tweet.text.startsWith("lot2") || tweet.text.startsWith("@sqli_leo lot2")) {
            Sound.playSound("lot2");
        } else if (tweet.text.startsWith("lot3") || tweet.text.startsWith("@sqli_leo lot3")) {
            Sound.playSound("lot3");
        } else if (tweet.text.startsWith("perdu1") || tweet.text.startsWith("@sqli_leo perdu1")) {
            Sound.playSound("perdu1");
        } else {
            Sound.playSound("foo");
        }
    }

    static playSound(file) {
        fs.createReadStream('sounds/' + file + '.mp3')
            .pipe(new lame.Decoder())
            .on('format', function (format) {
                this.pipe(new Speaker(format));
            });
    }

}