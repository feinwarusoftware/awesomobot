/**
 * Tests for utils.js
 */

const expect = require("chai").expect;

const utils = require("../utils");

describe("utils.js", function() {
    it("opt() if nothing is passed, should return a default, else return passed value", function() {
        const dict = {
            one: "hello",
            two: 8,
        };

        expect(utils.opt(dict, "one", "default")).to.equal("hello");
        expect(utils.opt(dict, "two", 0)).to.equal(8);
        expect(utils.opt(dict, "three", "default")).to.equal("default");
    });
});