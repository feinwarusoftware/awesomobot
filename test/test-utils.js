"use strict"

const expect = require("chai").expect;

const utils = require("../src/utils");

describe("utils.js", function() {

    it("opt() should return a value if specified or a defaul value", function() {
        const dict = {
            name: "hello",
            id: 23,
        };

        expect(utils.opt(dict, "name", null)).to.equal("hello");
        expect(utils.opt(dict, "id", null)).to.equal(23);
        expect(utils.opt(dict, "somevalue", null)).to.equal(null);
    });

    it("allIndicesOf() should return all indices of a substring in a string (case sensitive)", function() {
        const sub = "TrEe";
        const string = "All about a TrEe: trees are amazing, I love big trees. Also TrEe!";

        expect(utils.allIndicesOf(string, sub)[0]).to.equal(12);
        expect(utils.allIndicesOf(string, sub)[1]).to.equal(60);
    });
});