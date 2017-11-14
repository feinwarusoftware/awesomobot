/**
 * config-main.js
 * Desc: Main and only config file for the app.
 * Deps: None
 */

"use strict"

const config = {
    name: "AWESOM-O",
    version: "0.9.8",
    prefix: "-",

    token: "Mzc5MzcwNTA2OTMzMTA4NzQ2.DOp9Lg.NoqL-DLeUViKGgv3ckKhjYVbdkw", // sp-server
    //token: "MzcyNDYyNDI4NjkwMDU1MTY5.DOtZwQ.WGOdbzW642ViH79t6htgOO1f7Ug", // test-server

    membermessage: ["Ooohhh I Member!", "Me member!", "I member!"],

    blacklist: {
        words: ["beaner", "chink", "ching chong", "gook", "goy", "jap", "nigger", "nigga", "niggar", "nigguh", "sand nigger", "wetback", "fag", "faggot", "tranny", "shemale", "dyke"],
    },

    whitelist: {
        words: ["japan"],
    },

    groups: {
        devs: ["Mods", "AWESOM-O Dev"],
        newkids: ["New Kid"],
    },

    wikia: {
        host: "southpark.wikia.com",
        api: "/api/v1",
    },

    wiki: {
        host: "en.wikipedia.org",
        api: "/w/api.php",
    },
}

module.exports = config;