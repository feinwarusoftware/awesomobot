/**
 * config-main.js
 * Desc: Main and only config file for the app.
 * Deps: None
 */

const pth = require("path");

"use strict"

const config = {
    name: "AWESOM-O",
    version: "0.9.8",
    prefix: "-",
    logid: "380730018718023681",

    //token: "Mzc5MzcwNTA2OTMzMTA4NzQ2.DO0IiA.O8dY76x-uEbmr2iOm8Wiw9QxtyY", // sp-server
    token: "MzcyNDYyNDI4NjkwMDU1MTY5.DOtZwQ.WGOdbzW642ViH79t6htgOO1f7Ug", // test-server

    datapath: pth.join(__dirname + "../../.." + "/data/shit.json"),
    eplistpath: pth.join(__dirname + "../../.." + "/data/episodes.json"),

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

    devstatus: {
        member: "complete",
        avatar: "complete",
        botinfo: "complete",
        help1: "complete",
        help2: "complete",
        sub: "complete",
        micro: "complete",
        reminder: "complete",
        f: "complete",
        welcome: "complete",
        times: "complete",
        w: "complete",
        random: "issues confirmed - may not return all episodes, may fail at wikia lookup",
        ibrokethedam: "complete",
        profanityfilter: "complete",
        shit: "issues confirmed - shit.json gets wiped, shit doesnt get recorded",
        shitme: "issues confirmed - shit.json gets wiped, cannot lookup shits",
        shitlist: "issues confirmed - shit.json gets wiped, cannot lookup shits",
        issue: "testing",
    }
}

module.exports = config;