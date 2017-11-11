/**
 * High level utility commands for the south park wikia api.
 * 
 * TODO: seperate function for getting ID (remove duplicate code).
 * TODO: one wiki command to rule them all!
 */

const spwikia = require("./spwikia");
const utils = require("./utils");
const log = require("./log");
const debug = require("./debug");

const badrequestfp = "./data/badrequests.txt";

module.exports = {
    getPageInfo: function(name, callback) {
        var dict1 = {
            query:  name,
            limit: 1,
        };

        spwikia.search(dict1, function(page) {
            try {
                var id = page.items[0].id;
            } catch(e) {
                log.write(log.ERROR, "Bad wikia request (" + name + "), aborting search.", __function, __line);
                return;
            }

            try {
                var url = page.items[0].url;
            } catch(e) {
                log.write(log.ERROR, "Bad wikia request (" + name + "), aborting search.", __function, __line);
                return;
            }

            var dict2 = {
                id: id,
            };

            spwikia.articleAsSimpleJson(dict2, function(simple) {
                try {
                    var title = simple.sections[0].title;
                } catch(e) {
                    log.write(log.ERROR, "Bad wikia request (" + name + "), aborting search.", __function, __line);
                    return;
                }
                var desc = "";

                if (simple.sections[1].title == "Synopsis") {
                    try {
                        desc = simple.sections[1].content[0].text;
                    } catch(e) {
                        log.write(log.ERROR, "Bad wikia request (" + name + "), aborting search.", __function, __line);
                        return;
                    }
                
                } else {
                    try {
                        desc = simple.sections[0].content[0].text;
                    } catch(e) {
                        log.write(log.ERROR, "Bad wikia request (" + name + "), aborting search.", __function, __line);
                        return;
                    }
                }

                var dict3 = {
                    ids: id,
                };

                spwikia.articleDetails(dict3, function(detail) {
                    try {
                        var thumbnail = detail.items[id].thumbnail;
                    } catch(e) {
                        log.write(log.ERROR, "Bad wikia request (" + name + "), aborting search.", __function, __line);
                        return;
                    }

                    callback(title, url, desc, thumbnail);
                });
            });
        });
    }
}