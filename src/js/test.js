"use strict";
import Tweet from "./models/tweet";

var _ = require('lodash/array');

var tweet = new Tweet("Toto", "@toto", "Je suis content");

var array = [new Tweet("Toto", "@toto", "Je suis content"), new Tweet("Titi", "@titi", "Je suis cool"), new Tweet("Tata", "@tata", "Je suis pas content")];
//var array = [2, 5, 9];
var index = array.indexOf("toto");

//console.log(index);

if (index > -1) {
    array.splice(index, 1);
}

_.remove(array, function(currentObject) {
    return currentObject.userName === "Titi" &&
        currentObject.screenName === "@titi" &&
        currentObject.text === "Je suis cool";
});
console.log(array);


