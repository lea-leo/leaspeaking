import Utils from "../../dist/js/helpers/utils";

describe("Mon premier test", function() {
    it("Ma première assertion", function() {
        expect(true).toBe(true);
        expect(Utils.isAdmin("name")).toBe(false);
        expect(Utils.isAdmin("lynchmaniacPL")).toBe(true);
    });
});

describe("isAdmin", function() {
    it("Ma première assertion", function() {
        expect(Utils.isAdmin("name")).toBe(false);
        expect(Utils.isAdmin("lynchmaniacPL")).toBe(true);
    });
});

    /*static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }*/