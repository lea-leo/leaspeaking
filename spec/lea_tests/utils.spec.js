import Utils from "../../dist/js/helpers/utils";
import Tweet from "../../dist/js/models/tweet";
import Configuration from "../../dist/js/config/configuration";
import Context from "../../dist/js/models/context";

import fs from 'fs';

/* FUNCTION TO BE TESTED
    static startAndStopLea(tweet, clusterArduino, context) {
*/

// Test getRandomMotion function
describe("renvoie un mouvement aléatoire", function() {
    
    it("Devrait renvoyer le premier mouvement", function() {
        spyOn(Utils, 'getRandomInt').and.returnValue(0);
        expect(Utils.getRandomMotion("colle")).toBe(Configuration.CLASSIC_MOTIONS[0]);
        expect(Utils.getRandomMotion("gagnant_gilbert")).toBe(Configuration.CLASSIC_MOTIONS[0]);
        expect(Utils.getRandomMotion("lot2")).toBe(Configuration.CLASSIC_MOTIONS[0]);
    });

    it("Devrait renvoyer le second mouvement", function() {
        spyOn(Utils, 'getRandomInt').and.returnValue(1);
        expect(Utils.getRandomMotion("gagnant_dora")).toBe(Configuration.CLASSIC_MOTIONS[1]);
        expect(Utils.getRandomMotion("affranchis")).toBe(Configuration.CLASSIC_MOTIONS[1]);
        expect(Utils.getRandomMotion("lot1")).toBe(Configuration.CLASSIC_MOTIONS[1]);
    });

    it("Devrait renvoyer un easter egg", function() {
        spyOn(Utils, 'getRandomInt').and.returnValue(0);
        expect(Utils.getRandomMotion("exorciste")).toBe("EXORCISTE");
        expect(Utils.getRandomMotion("sos")).toBe("SOS");
    });
});

// Test getCurrentRank function
describe("renvoie la valeur du rang du tweet", function() {

    let context = new Context();

    // Create rank database
    beforeEach(function() {
        Configuration.RANK_FILE = 'rank-test.txt';
        if (fs.existsSync(Configuration.RANK_FILE)) {
            fs.unlinkSync(Configuration.RANK_FILE);
        }
        fs.writeFileSync(Configuration.RANK_FILE, '22');
    });

    // Suppress rank database
    afterEach(function() {
        fs.unlinkSync(Configuration.RANK_FILE);
    });

    it("Devrait renvoyer la valeur correcte du rang", function() {
        expect(context.rank).toBe(undefined);
        Utils.getCurrentRank(context);
        expect(context.rank).toEqual(jasmine.any(String));
        expect(context.rank).toBe("22");
    });
});

// Test fillTweetRank function
describe("renseigne le rang du tweet avec la valeur courante", function() {

    
    it("Devrait renseigner la bonne valeur du rang", function() {
        let tweet = new Tweet("UserName", "ScreenName", "coucou le monde");
        expect(tweet.rank).not.toBe(undefined);
        expect(tweet.rank).not.toBe(null);
        expect(tweet.rank).toEqual(jasmine.any(Number));
        expect(tweet.rank).toBe(1);
        Utils.fillTweetRank(tweet, 22);
        expect(tweet.rank).toEqual(jasmine.any(Number));
        expect(tweet.rank).toBe(22);
    });

    it("Ne devrait pas renseigner la bonne valeur du rang (admin)", function() {
        let tweet = new Tweet("UserName", "ScreenName", "coucou le monde");
        expect(tweet.rank).not.toBe(undefined);
        expect(tweet.rank).not.toBe(null);
        expect(tweet.rank).toEqual(jasmine.any(Number));
        expect(tweet.rank).toBe(1);
        tweet.screenName = "lynchmaniacPL";
        Utils.fillTweetRank(tweet, 22);
        expect(tweet.rank).toEqual(jasmine.any(String));
        expect(tweet.rank).toBe("ADMIN");
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

// Test updateAndSaveRankTweet function
describe("incrémente et sauvegarde le rang courant du nombre de tweet", function() {
    
    let context = new Context();
    
    // Create rank database
    beforeEach(function() {
        Configuration.RANK_FILE = 'rank-test.txt';
        if (fs.existsSync(Configuration.RANK_FILE)) {
            fs.unlinkSync(Configuration.RANK_FILE);
        }
        fs.writeFileSync(Configuration.RANK_FILE, '2');
        context.rank = 22;
    });

    // Suppress rank database
    afterEach(function() {
        fs.unlinkSync(Configuration.RANK_FILE);
    });

    it("Devrait incrémenter le compteur", function() {
        let tweet = new Tweet("UserName", "ScreenName", "coucou le monde");
        Utils.updateAndSaveRankTweet(tweet, context);
        var rank = JSON.parse(fs.readFileSync(Configuration.RANK_FILE));
        expect(context.rank).toEqual(jasmine.any(Number));
        expect(context.rank).toBe(23);
        expect(rank).toEqual(jasmine.any(Number));
        expect(rank).toEqual(23);
    });

    it("Ne devrait pas incrémenter le compteur pour un utilisateur admin", function() {
        let tweet = new Tweet("UserName", "lynchmaniacPL", "coucou le monde");
        Utils.updateAndSaveRankTweet(tweet, context);
        var rank = JSON.parse(fs.readFileSync(Configuration.RANK_FILE));
        expect(context.rank).toEqual(jasmine.any(Number));
        expect(context.rank).toBe(22);
        expect(rank).toEqual(jasmine.any(Number));
        expect(rank).toBe(2);
    });

    it("Ne devrait pas incrémenter le compteur pour un vieux tweet", function() {
        let tweet = new Tweet("UserName", "ScreenName", "coucou le monde");
        tweet.fresh = false;
        Utils.updateAndSaveRankTweet(tweet, context);
        var rank = JSON.parse(fs.readFileSync(Configuration.RANK_FILE));
        expect(context.rank).toEqual(jasmine.any(Number));
        expect(context.rank).toBe(22);
        expect(rank).toEqual(jasmine.any(Number));
        expect(rank).toBe(2);
    });
});

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

// Test generateTweet function
describe("génére un squelette de tweet", function() {
    it("contenant les informations essentielles", function() {
        var tweet = Utils.generateTweet("Hello World !!!");
        expect(tweet).not.toBe(null);
        expect(tweet).not.toBe(undefined);
        expect(tweet.userName).toEqual(jasmine.any(String));
        expect(tweet.userName).toBe("");
        expect(tweet.screenName).toEqual(jasmine.any(String));
        expect(tweet.screenName).toBe("");
        expect(tweet.text).toEqual(jasmine.any(String));
        expect(tweet.text).toBe("Hello World !!!");
        expect(tweet.LCDText).toEqual(jasmine.any(String));
        expect(tweet.LCDText).toBe("Hello World !!!");
        expect(tweet.fresh).toBe(true);
        expect(tweet.rank).toEqual(jasmine.any(Number));
        expect(tweet.rank).toBe(1);
        expect(tweet.LCDText).toEqual(jasmine.any(String));
        expect(tweet.motion).toBe("NO_MOTION");
        expect(tweet.timestamp).toEqual(jasmine.any(Number));
        expect(tweet.winner).toBe(false);
        expect(tweet.isSpecial).toBe(true);
        expect(tweet.sound).toBe("foo");
    });
});

// Test generatePauseTweet function
describe("génére un tweet de pause", function() {
    it("contenant les informations essentielles", function() {
        var tweet = Utils.generatePauseTweet();
        expect(tweet).not.toBe(null);
        expect(tweet).not.toBe(undefined);
        expect(tweet.userName).toEqual(jasmine.any(String));
        expect(tweet.userName).toBe("");
        expect(tweet.screenName).toEqual(jasmine.any(String));
        expect(tweet.screenName).toBe("");
        expect(tweet.text).toEqual(jasmine.any(String));
        expect(tweet.text).toBe(Configuration.TEXT_LEA_PAUSE);
        expect(tweet.LCDText).toEqual(jasmine.any(String));
        expect(tweet.LCDText).toBe(Configuration.TEXT_LEA_PAUSE);
        expect(tweet.fresh).toBe(true);
        expect(tweet.rank).toEqual(jasmine.any(Number));
        expect(tweet.rank).toBe(1);
        expect(tweet.LCDText).toEqual(jasmine.any(String));
        expect(tweet.motion).toBe("NO_MOTION");
        expect(tweet.timestamp).toEqual(jasmine.any(Number));
        expect(tweet.winner).toBe(false);
        expect(tweet.isSpecial).toBe(true);
        expect(tweet.sound).toBe("foo");

    });
});

// Test generateStartUpTweet function
describe("génére un tweet d'initialisation'", function() {
    it("contenant les informations essentielles", function() {
        var tweet = Utils.generateStartUpTweet();
        expect(tweet).not.toBe(null);
        expect(tweet).not.toBe(undefined);
        expect(tweet.userName).toEqual(jasmine.any(String));
        expect(tweet.userName).toBe("");
        expect(tweet.screenName).toEqual(jasmine.any(String));
        expect(tweet.screenName).toBe("");
        expect(tweet.text).toEqual(jasmine.any(String));
        expect(tweet.text).toBe(Configuration.TEXT_LEA_START_UP);
        expect(tweet.LCDText).toEqual(jasmine.any(String));
        expect(tweet.LCDText).toBe(Configuration.TEXT_LEA_START_UP);
        expect(tweet.fresh).toBe(true);
        expect(tweet.rank).toEqual(jasmine.any(Number));
        expect(tweet.rank).toBe(1);
        expect(tweet.LCDText).toEqual(jasmine.any(String));
        expect(tweet.motion).toBe("NO_MOTION");
        expect(tweet.timestamp).toEqual(jasmine.any(Number));
        expect(tweet.winner).toBe(false);
        expect(tweet.isSpecial).toBe(true);
        expect(tweet.sound).toBe("foo");

    });
});

// Test generateStartTweet function
describe("génére un tweet de démarrage", function() {
    it("contenant les informations essentielles", function() {
        var tweet = Utils.generateStartTweet();
        expect(tweet).not.toBe(null);
        expect(tweet).not.toBe(undefined);
        expect(tweet.userName).toEqual(jasmine.any(String));
        expect(tweet.userName).toBe("");
        expect(tweet.screenName).toEqual(jasmine.any(String));
        expect(tweet.screenName).toBe("");
        expect(tweet.text).toEqual(jasmine.any(String));
        expect(tweet.text).toBe(Configuration.TEXT_LEA_START);
        expect(tweet.LCDText).toEqual(jasmine.any(String));
        expect(tweet.LCDText).toBe(Configuration.TEXT_LEA_START);
        expect(tweet.fresh).toBe(true);
        expect(tweet.rank).toEqual(jasmine.any(Number));
        expect(tweet.rank).toBe(1);
        expect(tweet.LCDText).toEqual(jasmine.any(String));
        expect(tweet.motion).toBe("NO_MOTION");
        expect(tweet.timestamp).toEqual(jasmine.any(Number));
        expect(tweet.winner).toBe(false);
        expect(tweet.isSpecial).toBe(true);
        expect(tweet.sound).toBe("foo");

    });
});
