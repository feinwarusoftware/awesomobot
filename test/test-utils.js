/**
 * Tests for utils.js
 */

const expect = require("chai").expect;

const utils = require("../utils");

describe("utils.js", function() {

    it("opt(): if nothing is passed, should return a default, else return passed value", function() {
        const dict = {
            one: "hello",
            two: 8,
        };

        expect(utils.opt(dict, "one", "default")).to.equal("hello");
        expect(utils.opt(dict, "two", 0)).to.equal(8);
        expect(utils.opt(dict, "three", "default")).to.equal("default");
    });

    it("messageIncludes(): return true if string or any array object contains a substring (not case sensitive)", function() {
        const str = "find me";
        const arr = ["tree", "white cat"];

        const dict1 = {
            content: "the white cat",
        }

        const dict2 = {
            content: "the tall Tree",
        }

        const dict3 = {
            content: "can you fInD mE",
        }

        const dict4 = {
            content: "this should return false",
        }

        expect(utils.messageIncludes(dict1, arr)).to.equal(true);
        expect(utils.messageIncludes(dict2, arr)).to.equal(true);
        expect(utils.messageIncludes(dict3, str)).to.equal(true);
        expect(utils.messageIncludes(dict4, arr)).to.equal(false);
        expect(utils.messageIncludes(dict4, str)).to.equal(false);
    });
});