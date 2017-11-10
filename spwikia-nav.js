/**
 * High level utility commands for the south park wikia api.
 * 
 * TODO: seperate function for getting ID (remove duplicate code).
 * TODO: one wiki command to rule them all!
 */

const spwikia = require("./spwikia");

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
                console.log("Invalid search query: " + name);
                return;
            }

            var dict2 = {
                id: id,
            };

            spwikia.articleAsSimpleJson(dict2, function(simple) {
                var title = simple.sections[0].title;
                var desc = "";

                if (simple.sections[1].title == "Synopsis") {
                    desc = simple.sections[1].content[0].text;
                
                } else {
                    desc = simple.sections[0].content[0].text;
                }

                var dict3 = {
                    ids: id,
                };

                spwikia.articleDetails(dict3, function(detail) {
                    var thumbnail = detail.items[id].thumbnail;

                    callback(title, desc, thumbnail);
                });
            });
        });
    }
}