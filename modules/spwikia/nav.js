"use strict"

const api = require("./api");

function getPageInfo(name, callback) {
    api.search({
        query: name,
        limit: 1,

    }, function(page) {
        try {
            const id = page.items[0].id;
            const url = page.items[0].url;

        } catch (e) {
            // do something
            callback(null, null, null, null);
            return;
            
        }

        api.articleAsSimpleJson({
            id: id,

        }, function(simple) {
            try {
                const title = simple.sections[0].title;

                if (simple.sections[1].title == "Synopsis") {
                    var desc = simple.sections[1].content[0].text;
                } else {
                    var desc = simple.sections[0].content[0].text;
                }

            } catch (e) {
                // do something
                callback(null, null, null, null);
                return;

            }

            api.articleDetails({
                ids: id,

            }, function(detail) {
                try {
                    const thumbnail = detail.items[id].thumbnail;

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