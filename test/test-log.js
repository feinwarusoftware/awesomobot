/**
 * Tests for logging module
 */

const expect = require("chai").expect;

const log = require("../log");
const fs = require("fs");
const randomstring = require("randomstring");
const sleep = require('system-sleep');
var intercept = require("intercept-stdout");

describe("log.js", function() {

    it("getLogLevel(): should be error by default", function() {
        expect(log.getLogLevel()).to.equal(log.ERROR);
    });

    it("setLogLevel(): should change the log level", function() {
        log.setLogLevel(log.INFO | log.WARNING);
        
        expect(log.getLogLevel()).to.equal(log.INFO | log.WARNING);
    });
    
    it("write(): should decide if it should write to console or file", function(done) {
        const level1 = log.ERROR;
        const level2 = log.INFO;

        log.setLogLevel(log.INFO);

        var captured_text = "";
        var unhook_intercept = intercept(function(txt) {
            captured_text += txt;
        });

        log.write(level1, "test");
        expect(captured_text).to.equal("");

        log.write(level2, "test");
        unhook_intercept();
        expect(captured_text).to.equal("INFO".green + " >> [undef, undef] --> test\n");

        log.setLogLevel(log.INFO | log.FILEDUMP);

        var random = randomstring.generate();
        log.write(level2, random);
        // Also remove this hacky way of doing this
        sleep(500);
        // Make this a variable instead somehow
        fs.readFile("./data/clog.txt", "utf8", function(err, data) {
            if (err) {
                throw err;
            }

            expect(data).to.contain(random);
            done();
        });
    });
    
    it("globals: should be set correctly", function() {
        expect(log.DEBUG).to.equal(1);
        expect(log.WARNING).to.equal(2);
        expect(log.ERROR).to.equal(4);
        expect(log.INFO).to.equal(8);
        expect(log.FILEDUMP).to.equal(16);
    });
});