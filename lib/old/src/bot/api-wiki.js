/**
 * api-wiki.js
 * Decs: Partial implementation of the wikipedia REST api.
 * Deps: rquest.js
 */

"use strict"

const utils = require("./utils");
const rquest = require("./rquest");

const host = "en.wikipedia.org";
const api = "/w/api.php";
/*
function pageAsString(options, callback) {
    var action = "query";
    var format = "json"
    var prop = "revisions";
    var rvprop = "content";
    var titles = utils.opt(options, "titles", "");

    if (titles == "") {
        return;
    }

    rquest.performRequest(host, api, "GET", {
        action: action,
        titles: titles,
        prop: prop,
        rvprop: rvprop,
        format: format,

    }, function(data) {
        callback(data);
    });
}
*/

function pageAsJson(opt) {
    return new Promise((resolve, reject) => {
        const titles = utils.opt(opt, "titles", "");
        if (titles == "") {
            reject("Error with title parameter!");
        }

        rquest.performRequest(host, api, "GET", {
            action: "query",
            titles: titles,
            prop: "revisions",
            rvprop: "content",
            format: "json"
        }, data => {
            resolve(data);
        });
    });
}

module.exports = {
    pageAsJson,

}