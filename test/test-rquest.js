/**
 * Tests for the rquest module (incomplete)
 */

const expect = require("chai").expect;

const rquest = require("../rquest");

describe("rquest.js", function() {

    // NOTE: Only the GET functionality is tested.
    it("performRequest(): should perform a REST API request", function(done) {
        rquest.performRequest("southpark.wikia.com", "/api/v1/Search/List", "GET", {
            query: "kenny",
            limit: 1,

        }, function(data) {

            expect(data.items[0].id).to.equal(78974);
            done();
        });
    });
});