const spwikia = require("./spwikia");

module.exports = {
    getEpDetails: function(name, callback) {
        var dict1 = {
            query:  name,
            limit: 1,
        };

        spwikia.search(dict1, function(page) {
            var id = page.items[0].id;

            var dict2 = {
                id: id,
            };

            spwikia.articleAsSimpleJson(dict2, function(simple) {
                var title = simple.sections[0].title;
                var desc = simple.sections[1].content[0].text;

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