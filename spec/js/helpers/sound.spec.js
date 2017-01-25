import {chooseSound} from "../../../src/js/helpers/sound";
import * as Utils from "../../../src/js/helpers/utils";
import Tweet from "../../../src/js/models/tweet";
import Configuration from "../../../src/js/config/configuration";
import Context from "../../../src/js/models/context";

import fs from 'fs';

// Test chooseSound function
describe("renvoie le nom du fichier son à lancer", function() {

  it("Devrait retourner un son aléatoire", function() {
    let tweet = new Tweet("UserName", "ScreenName", "coucou le monde");
    Configuration
      .sounds
      .push({
        text: "TU",
        alternativeText: Configuration.USER_TWITTER + " TU",
        mp3: "Mp3TUFile"
      });
    spyOn(Utils, 'getRandomInt')
      .and
      .returnValue(Configuration.sounds.length - 1);
    let result = chooseSound(tweet);
    expect(result)
      .not
      .toBe(undefined);
    expect(result)
      .not
      .toBe(null);
    expect(result).toEqual(jasmine.any(String));
    expect(result).toBe("Mp3TUFile");
  });

  it("Devrait retourner un son d'un easter egg basé sur le texte", function() {
    let tweet = new Tweet("UserName", "ScreenName", "TU In action");
    Configuration
      .easterEggs
      .push({
        text: "TU In action",
        alternativeText: Configuration.USER_TWITTER + " TU In action",
        mp3: "TUActionMp3"
      });
    let result = chooseSound(tweet);
    expect(result)
      .not
      .toBe(undefined);
    expect(result)
      .not
      .toBe(null);
    expect(result).toEqual(jasmine.any(String));
    expect(result).toBe("TUActionMp3");
  });

  it("Devrait retourner un son d'un easter egg basé sur le texte alternatif", function() {
    let tweet = new Tweet("UserName", "ScreenName", Configuration.USER_TWITTER + " TU Alternatif In action");
    Configuration
      .easterEggs
      .push({
        text: "TU XXXX",
        alternativeText: Configuration.USER_TWITTER + " TU Alternatif",
        mp3: "TUAlternatifMp3"
      });
    let result = chooseSound(tweet);
    expect(result)
      .not
      .toBe(undefined);
    expect(result)
      .not
      .toBe(null);
    expect(result).toEqual(jasmine.any(String));
    expect(result).toBe("TUAlternatifMp3");
  });

});
