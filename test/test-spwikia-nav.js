/**
 * Tests for spwikia-nav.js
 */

const expect = require("chai").expect;

var spnav = require("../spwikia-nav");

describe("spwikia-nav.js", function() {

    // NOTE: Anything other than episodes and characters may not work.
    // NOTE: If this fails, the wiki might have changed their image host.
    it("getPageInfo(): should return the correct character info from southpark.wikia.com", function(done) {
        const query1 = "craig";

        spnav.getPageInfo(query1, function(title, url, desc, thumbnail) {
            expect(title).to.equal("Craig Tucker");
            expect(url).to.contain("http://southpark.wikia.com/wiki/Craig_Tucker");
            expect(desc).to.contain("Craig Tucker is a member of the boys' fourth grade class. Craig's");
            expect(thumbnail).to.contain("https://vignette.wikia.nocookie.net/southpark/images/");
            done();
        });
    });

    it("getPageInfo(): should return the correct episode info from southpark.wikia.com", function(done) {
        const query2 = "put it down";

        spnav.getPageInfo(query2, function(title, url, desc, thumbnail) {
            expect(title).to.equal("Put It Down");
            expect(url).to.contain("http://southpark.wikia.com/wiki/Put_It_Down");
            expect(desc).to.contain("When Tweek is caught in the middle of a petty conflict, it drives his");
            expect(thumbnail).to.contain("https://vignette.wikia.nocookie.net/southpark/images/");
            done();
        });
    });
});
