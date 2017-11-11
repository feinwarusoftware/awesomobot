/**
 * Tests for the debug module
 */

const expect = require("chai").expect;

const debug = require("../debug");

function test() {
    return __function;
}

describe("debug.js", function() {

    it("__function: should return the function name", function() {

        var fn = test();

        expect(fn).to.equal("test");
    });

    it("__lineL should return the line number", function() {
        expect(__line).to.equal(23);
    });
});