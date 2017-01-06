import Utils from "./helpers/utils";
import Sound from "./helpers/sound";
import StreamPlayer from 'stream-player';

var Player = require('player');


var player = new StreamPlayer();

playSong('sounds/colle.mp3');
playSong('sounds/exorciste.mp3');

/*setTimeout(function () {
    playSong('sounds/exorciste.mp3');
}, 10000);*/

function playSong(song){
    if (player.isPlaying()) {

    } else {
        // Add a song url to the queue
        player.add(song);
        // Start playing all songs added to the queue (FIFO)
        player.play();
    }
}