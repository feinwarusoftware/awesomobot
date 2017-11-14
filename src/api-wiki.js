/**
 * api-wiki.js
 * Decs: Partial implementation of the wikipedia REST api.
 * Deps: rquest.js
 */

"use strict"

const utils = require("./utils");
const rquest = require("./rquest");
const config = require("./config/config-main");

const host = config.wiki.host;
const api = config.wiki.api;

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

module.exports = {
    pageAsString,

}