/**
 * api-wikia.js
 * Desc: Complete implementation of the wikia REST api.
 * Deps: rquest.js, utils.js
 */

"use strict"

const config = require("../../config")
const utils = require("./utils");
const rquest = require("./rquest");

const host = "ws.audioscrobbler.com";
const api = "/2.0";

/**
 * Get information about the latest user activity on the current wiki.
 * @param options 
 * Options:     
 * - limit [type = int, default = 1]: Limit the number of results.
 * - namespaces [type = string, default = "0"]: Comma-separated namespace ids, see more: http://community.wikia.com/wiki/Help:Namespaces.
 * - allowDuplicates [type = bool, default = true]: Set if duplicate values of an article's revisions made by the same user are not allowed.
 */
function topArtists(options, callback) {
    let period = utils.opt(options, "period", "overall")
    // /Activity/LatestActivity
    rquest.performRequest(host, api, "GET", {
        method: "user.gettopartists",
        username: config.fm_username,
        api_key: config.fm_key,
        format : "json",
        limit : "5",
        period : period
    }, function(data) {
        callback(data);
    });
}
function topAlbums(options, callback) {
    let period = utils.opt(options, "period", "overall")
    // /Activity/LatestActivity
    rquest.performRequest(host, api, "GET", {
        method: "user.gettopalbums",
        username: config.fm_username,
        api_key: config.fm_key,
        format : "json",
        limit : "5",
        period : period
    }, function(data) {
        callback(data);
    });
}

function topTracks(options, callback) {
    let period = utils.opt(options, "period", "overall")
    // /Activity/LatestActivity
    rquest.performRequest(host, api, "GET", {
        method: "user.gettoptracks",
        username: config.fm_username,
        api_key: config.fm_key,
        format : "json",
        limit : "5",
        period : period
    }, function(data) {
        callback(data);
    });
}

// Activity.
module.exports = {
    topArtists,
    topAlbums,
    topTracks
}