/**
 * nav.js
 * Desc: Utility module for interfacing with the wiki apis.
 * Deps: api-wikia.js, api-wiki.js
 */

"use strict"

const sleep = require("system-sleep");

const spwikia = require("./api-wikia");
const wiki = require("./api-wiki");
const utils = require("./utils");

function getPageInfo(name, callback) {
    spwikia.search({
        query: name,
        limit: 1,

    }, function(page) {
        var id;
        var url;
        try {
            id = page.items[0].id;
            url = page.items[0].url;

        } catch (e) {
            // do something
            callback(null, null, null, null);
            return;
            
        }

        spwikia.articleAsSimpleJson({
            id: id,

        }, function(simple) {
            var title;
            var desc;
            try {
                title = simple.sections[0].title;

                if (simple.sections[1].title == "Synopsis") {
                    desc = simple.sections[1].content[0].text;
                } else {
                    desc = simple.sections[0].content[0].text;
                }

            } catch (e) {
                // do something
                callback(null, null, null, null);
                return;

            }

            spwikia.articleDetails({
                ids: id,

            }, function(detail) {
                var thumbnail;
                try {
                    thumbnail = detail.items[id].thumbnail;

                } catch (e) {
                    // do something
                    callback(null, null, null, null);
                    return;

                }

                callback(title, url, desc, thumbnail);
            });
        });
    });
}

function getEpList(callback) {
    var allepisodes = [];

    wiki.pageAsString({titles: "List_of_South_Park_episodes",}, function(data) {
        data = JSON.stringify(data);

        var spos = utils.allIndicesOf(data, "[[#Season ");
        var seasons = [];
        for (var i = 0; i < spos.length; i++) {
            spos[i] += 10;
            seasons[i] = data.substring(spos[i], spos[i] + (data.substring(spos[i] + 1, spos[i] + 2) == " " ? 1 : 2));
        }

        for (var i = 0; i < seasons.length; i++) {
            wiki.pageAsString({titles: ("South_Park_(season_" + seasons[i] + ")"),}, function(data) {
                data = JSON.stringify(data);

                var epos = utils.allIndicesOf(data, "|Title = [[");
                var episodes = [];
                for (var i = 0; i < epos.length; i++) {
                    epos[i] += 11;
                    episodes[i] = data.substring(epos[i], epos[i] + 100);
                }
                for (var i = 0; i < epos.length; i++) {
                    var end = episodes[i].indexOf("]]");
                    episodes[i] = episodes[i].substring(0, end);
                    episodes[i] = episodes[i].replace("\\", "");
                    episodes[i] = episodes[i].replace("|", "");
                    episodes[i] = episodes[i].replace("(South Park)", "");

                    if (episodes[i].length % 2 != 0) {
                        if (episodes[i].substring(0, Math.floor(episodes[i].length / 2)) == episodes[i].substring(Math.ceil(episodes[i].length / 2), episodes[i].length)) {
                            episodes[i] = episodes[i].substring(0, Math.floor(episodes[i].length / 2));
                        }
                    }
                }

                allepisodes = allepisodes.concat(episodes);   
            });
        }

        // Make sure all requests are complete.
        // Fix this somehow plz.
        sleep(2000);

        callback(allepisodes);
    });
}

module.exports = {
    getPageInfo,
    getEpList,

};