/**
 * Tests for the file module
 */

const expect = require("chai").expect;

const file = require("../file");
const randomstring = require("randomstring");
const sleep = require('system-sleep');
const fs = require("fs");

describe("file.js", function() {

    it("readAsString(): Should read a string from a file", function(done) {
        const random = randomstring.generate();

        file.writeString("./data/test.txt", random);
        // This hurts me internally
        sleep(500);

        file.readAsString("./data/test.txt", function(data) {

            expect(data).to.contain(random);
            done();
        });
    });

    it("writeString(): Should write a string to a file.", function(done) {
        const random = randomstring.generate();

        file.writeString("./data/test.txt", random);
        // This hurts me internally
        sleep(500);

        fs.readFile("./data/test.txt", "utf8", function(err, data) {
            if (err) {
                throw err;
            }

            expect(data).to.contain(random);
            done();
        });
    });

    it("writeMessage(): Should write a message to a file.", function(done) {
        const random = randomstring.generate();
        
        const author = {
            id: "dummy",
            username: "dummy",
        }

        const channel = {
            name: "dummy",
        }

        const message = {
            content: random,
            author: author,
            channel: channel,
        };

        file.writeMessage("./data/test.txt", message);
        // This hurts me internally
        sleep(500);

        fs.readFile("./data/test.txt", "utf8", function(err, data) {
            if (err) {
                throw err;
            }

            expect(data).to.contain(random);
            done();
        });
    });
});