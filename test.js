/**
 * Testing without using the discord.js api.
 */

const spnav = require("./spwikia-nav");

spnav.getEpDetails("kenny dies", function(title, details, thumbnail) {
    console.log(title);
    console.log(details);
    console.log(thumbnail);
});