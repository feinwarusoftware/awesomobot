"use strict"

const expect = require("chai").expect;

const spnav = require("../src/spnav");

describe("spnav.js", function() {
    this.timeout(5000);

    it("getPageInfo() should return character info", function(done) {
        const ch = "craig";

        spnav.getPageInfo(ch, function(title, url, desc, thumbnail) {

            expect(title).to.equal("Craig Tucker");
            expect(url).to.equal("http://southpark.wikia.com/wiki/Craig_Tucker");
            expect(desc).to.equal("Craig Tucker is a member of the boys' fourth grade class. Craig's most distinguishing physical feature is his blue chullo hat topped with a yellow puffball. One of his traits is his compulsive tendency to flip people off, usually for no discernible reason. He leads the group known as Craig's Gang.");
            expect(thumbnail).to.equal("https://vignette.wikia.nocookie.net/southpark/images/c/c2/Craig-tucker.png/revision/latest/window-crop/width/200/x-offset/0/y-offset/0/window-width/645/window-height/645?cb=20160402121203");

            done();
        });
    });

    it("getPageInfo() should return episode info", function(done) {
        const ep = "put it down";

        spnav.getPageInfo(ep, function(title, url, desc, thumbnail) {

            expect(title).to.equal("Put It Down");
            expect(url).to.equal("http://southpark.wikia.com/wiki/Put_It_Down");
            expect(desc).to.equal("When Tweek is caught in the middle of a petty conflict, it drives his relationship with Craig to the brink.");
            expect(thumbnail).to.equal("https://vignette.wikia.nocookie.net/southpark/images/2/2b/SP2102PRX.png/revision/latest/window-crop/width/200/x-offset/211/y-offset/0/window-width/541/window-height/540?cb=20170918022518");

            done();
        });
    });

    it("getPageInfo() should return null on sub-standard page", function(done) {
        const err = "social justice";

        spnav.getPageInfo(err, function(title, url, desc, thumbnail) {

            expect(title).to.equal(null);
            expect(url).to.equal(null);
            expect(desc).to.equal(null);
            expect(thumbnail).to.equal(null);

            done();
        });
    });

    it("getEpList() should return all the episodes to date", function(done) {
        
        spnav.getEpList(function(list) {

            expect(list).to.contain("Tweek vs. Craig");
            expect(list).to.contain("Tweek x Craig");
            expect(list).to.contain("Put It Down");

            done();
        });
    });
});