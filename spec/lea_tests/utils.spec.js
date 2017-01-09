import Utils from "../../dist/js/helpers/utils";
import Tweet from "../../dist/js/models/tweet";
import Configuration from "../../dist/js/config/configuration";
import Context from "../../dist/js/models/context";

import fs from 'fs';

/* FUNCTION TO BE TESTED
    static getRandomInt(min, max) {
    static getRandomMotion(sound) {
    static getCurrentRank(context) {
    static fillTweetRank(tweet, rank) {
    static updateAndSaveRankTweet(tweet, context) {
    static isDemoOff(tweet) {
    static isDemoOn(tweet) {
    static startAndStopLea(tweet, clusterArduino, context) {
    static generateTweet(text) {
    static generatePauseTweet() {
    static generateStartUpTweet() {
    static generateStartTweet() {
*/


// Test isAdim function
describe("indique si l'utilisateur qui a tweeter est un administrateur", function() {
    it("Devrait répondre faux pour un utilisateur lambda", function() {
        expect(Utils.isAdmin("name")).toBe(false);
    });
    it("Devrait répondre vrai pour un utilisateur admin", function() {
        expect(Utils.isAdmin("lynchmaniacPL")).toBe(true);
    });
    it("Devrait répondre vrai pour un utilisateur admin (case insensitive)", function() {
        expect(Utils.isAdmin("LYNCHMANIACPL")).toBe(true);
    });
});

// Test isDemoOff function
describe("indique si le tweet met le mode demo en pause", function() {

    let tweet = new Tweet("UserName", "ScreenName", "demo off");

    it("Devrait répondre positivement au fait de mettre le mode démo en pause (texte seul)", function() {
        expect(Utils.isDemoOff(tweet)).toBe(true);
    });
    it("Devrait répondre positivement au fait de mettre le mode démo en pause (avec préfixe)", function() {
        tweet.text = "avec du texte avant demo off";
        expect(Utils.isDemoOff(tweet)).toBe(true);
    });
    it("Devrait répondre positivement au fait de mettre le mode démo en pause (avec suffixe)", function() {
        tweet.text = "demo off avec du texte après";
        expect(Utils.isDemoOff(tweet)).toBe(true);
    });
    it("Devrait répondre positivement au fait de mettre le mode démo en pause (avec suffixe et prefixe)", function() {
        tweet.text = "avec du texte avant demo off avec du texte après";
        expect(Utils.isDemoOff(tweet)).toBe(true);
    });
    it("Devrait répondre négativement au fait de mettre le mode démo en pause (mauvais texte)", function() {
        tweet.text = "dema off";
        expect(Utils.isDemoOff(tweet)).toBe(false);
    });
    it("Devrait répondre négativement au fait de mettre le mode démo en pause (mauvais texte avec préfixe)", function() {
        tweet.text = "avec du texte avant dema off";
        expect(Utils.isDemoOff(tweet)).toBe(false);
    });
    it("Devrait répondre négativement au fait de mettre le mode démo en pause (mauvais texte avec suffixe)", function() {
        tweet.text = "dema off avec du texte après";
        expect(Utils.isDemoOff(tweet)).toBe(false);
    });
    it("Devrait répondre négativement au fait de mettre le mode démo en pause (mauvais texte avec suffixe et prefixe)", function() {
        tweet.text = "avec du texte avant dema off avec du texte après";
        expect(Utils.isDemoOff(tweet)).toBe(false);
    });
});

// Test isDemoOn function
describe("indique si le tweet met le mode demo en action", function() {

    let tweet = new Tweet("UserName", "ScreenName", "demo on");

    it("Devrait répondre positivement au fait de mettre le mode démo en action (texte seul)", function() {
        expect(Utils.isDemoOn(tweet)).toBe(true);
    });
    it("Devrait répondre positivement au fait de mettre le mode démo en action (avec préfixe)", function() {
        tweet.text = "avec du texte avant demo on";
        expect(Utils.isDemoOn(tweet)).toBe(true);
    });
    it("Devrait répondre positivement au fait de mettre le mode démo en action (avec suffixe)", function() {
        tweet.text = "demo on avec du texte après";
        expect(Utils.isDemoOn(tweet)).toBe(true);
    });
    it("Devrait répondre positivement au fait de mettre le mode démo en action (avec suffixe et prefixe)", function() {
        tweet.text = "avec du texte avant demo on avec du texte après";
        expect(Utils.isDemoOn(tweet)).toBe(true);
    });
    it("Devrait répondre négativement au fait de mettre le mode démo en action (mauvais texte)", function() {
        tweet.text = "dema on";
        expect(Utils.isDemoOn(tweet)).toBe(false);
    });
    it("Devrait répondre négativement au fait de mettre le mode démo en action (mauvais texte avec préfixe)", function() {
        tweet.text = "avec du texte avant dema on";
        expect(Utils.isDemoOn(tweet)).toBe(false);
    });
    it("Devrait répondre négativement au fait de mettre le mode démo en action (mauvais texte avec suffixe)", function() {
        tweet.text = "dema on avec du texte après";
        expect(Utils.isDemoOn(tweet)).toBe(false);
    });
    it("Devrait répondre négativement au fait de mettre le mode démo en action (mauvais texte avec suffixe et prefixe)", function() {
        tweet.text = "avec du texte avant dema on avec du texte après";
        expect(Utils.isDemoOn(tweet)).toBe(false);
    });
});


// Test saveTweet function
describe("sauvegarde le tweet passé en paramètre", function() {

    let tweet = new Tweet("UserName", "ScreenName", "TweetText");

    // Create tweets database
    beforeEach(function() {
        Configuration.TWEETS_DB = 'tweets-test.json';
        if (fs.existsSync(Configuration.TWEETS_DB)) {
            fs.unlinkSync(Configuration.TWEETS_DB);
        }
        fs.writeFileSync(Configuration.TWEETS_DB, '[]');
    });

    // Suppress tweets database
    afterEach(function() {
        fs.unlinkSync(Configuration.TWEETS_DB);
    });

    it("Devrait enregistrer le tweet passé en paramètre", function() {
        Utils.saveTweet(tweet);
        var configFile = fs.readFileSync(Configuration.TWEETS_DB);
        var config = JSON.parse(configFile);

        let tweetReceived = config[0];
        expect(tweetReceived.userName).toBe("UserName");
        expect(tweetReceived.screenName).toBe("ScreenName");
        expect(tweetReceived.text).toBe("TweetText");
        expect(tweetReceived.LCDText).toBe("@ScreenName : TweetText");
        expect(tweetReceived.fresh).toBe(true);
        expect(tweetReceived.rank).toBe(1);
        expect(tweetReceived.rank).toEqual(jasmine.any(Number));
        expect(tweetReceived.motion).toBe("KUNG_FU_PANDA");
        expect(tweetReceived.timestamp).toEqual(jasmine.any(Number));
        expect(tweetReceived.winner).toBe(false);
        expect(tweetReceived.isSpecial).toBe(false);
        expect(tweetReceived.sound).toBe("foo");

    });

    it("Ne devrait pas enregistrer le tweet passé en paramètre", function() {
        tweet.fresh = false;
        Utils.saveTweet(tweet);
        var configFile = fs.readFileSync(Configuration.TWEETS_DB);
        var config = JSON.parse(configFile);
 
        expect(config.length).toBe(0);
     });
});


// Test isTweetWinner function
describe("indique si le tweet reçu est gagnant", function() {

    let context = new Context();

    // Create gamification database
    beforeEach(function() {
        Configuration.GAMIFICATION_FILE = 'gamification-test.json';
        if (fs.existsSync(Configuration.GAMIFICATION_FILE)) {
            fs.unlinkSync(Configuration.GAMIFICATION_FILE);
        }
        fs.writeFileSync(Configuration.GAMIFICATION_FILE, '{"level_1":{ "rank": 5, "motion": "WINNER", "sound": "gagnant_Dora"}}');
        context.gamification = JSON.parse(fs.readFileSync(Configuration.GAMIFICATION_FILE, "utf8"));
    });

    // Suppress gamification database
    afterEach(function() {
        fs.unlinkSync(Configuration.GAMIFICATION_FILE);
    });

    it("Ne devrait pas être un tweet gagnant", function() {
        context.rank = 0;
        let result = Utils.isTweetWinner(context.gamification, context.rank);
        expect(result).toBe(null);
     });

    it("Devrait être un tweet gagnant", function() {
        context.rank = 5;
        let result = Utils.isTweetWinner(context.gamification, context.rank);
        expect(result).not.toBe(null);
        expect(result.rank).toEqual(jasmine.any(Number));
        expect(result.rank).toBe(5);
        expect(result.motion).toBe("WINNER");
        expect(result.sound).toBe("gagnant_Dora");
     });
    
    it("Ne devrait pas être un tweet gagnant avec une config KO", function() {
        context.rank = 5;
        context.gamification = null;
        let result = Utils.isTweetWinner(context.gamification, context.rank);
        expect(result).toBe(null);
     });

});


// Test getGamification function
describe("alimente le taableau de gamification", function() {

    let context = new Context();

    // Create gamification database
    beforeEach(function() {
        Configuration.GAMIFICATION_FILE = 'gamification-test.json';
        if (fs.existsSync(Configuration.GAMIFICATION_FILE)) {
            fs.unlinkSync(Configuration.GAMIFICATION_FILE);
        }
        fs.writeFileSync(Configuration.GAMIFICATION_FILE, '{"level_1":{ "rank": 5, "motion": "WINNER", "sound": "gagnant_Dora"}}');
    });

    // Suppress gamification database
    afterEach(function() {
        fs.unlinkSync(Configuration.GAMIFICATION_FILE);
    });

    it("Ne devrait pas être une config null", function() {
        let result = Utils.getGamification();
        expect(result).not.toBe(null);
     });

    it("Devrait être une configuration correctement renseignée", function() {
        let result = Utils.getGamification();
        expect(result['level_1']).not.toBe(null);
        expect(result['level_1'].rank).toEqual(jasmine.any(Number));
        expect(result['level_1'].rank).toBe(5);
        expect(result['level_1'].motion).toBe("WINNER");
        expect(result['level_1'].sound).toBe("gagnant_Dora");
     });

});

