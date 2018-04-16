"use strict";

const utils = require("./utils");
const request = utils.request;

const host = "en.wikipedia.org";
const api = "/w/api.php";

function pageAsJson(opt) {
    return new Promise((resolve, reject) => {
        const titles = utils.opt(opt, "titles", "");
        if (titles == "") {
            reject("Error with title parameter!");
        }

        resolve(request.get(host, api, {
            action: "query",
            titles: titles,
            prop: "revisions",
            rvprop: "content",
            format: "json"
        }));
    });
}

module.exports = {
    pageAsJson,
}
