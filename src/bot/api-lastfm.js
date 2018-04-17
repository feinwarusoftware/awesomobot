"use strict"

const axios = require("axios");

const config = require("../../config")
const utils = require("./utils");

const apiBasePath = "https://ws.audioscrobbler.com/2.0";

const USER_GET_TOP_ARTISTS = "user.gettopartists";
const USER_GET_TOP_ALBUMS = "user.gettopalbums";
const USER_GET_TOP_TRACKS = "user.gettoptracks";
const USER_GET_RECENT_TRACKS = "user.getrecenttracks";

const PERIOD_OVERALL = "overall";
const PERIOD_WEEK = "7day";
const PERIOD_MONTH = "1month";
const PERIOD_3MONTH = "3month";
const PERIOD_6MONTH = "6month";
const PERIOD_YEAR = "12month";

function makeApiRequest(options) {
    return new Promise((resolve, reject) => {

        const method = utils.opt(options, "method", undefined);
        if (method === undefined) {
            console.error("error >> api-lastfm.js - makeApiRequest() - mathod not specified");
            return;
        }

        const api_key = config.fm_key;
        if (api_key === undefined) {
            console.error("error >> api-lastfm.js - makeApiRequest() - the api key is missing");
            return;
        }

        if (options === undefined) {
            options = {};
        }
        options.api_key = api_key;
        options.format = "json";

        axios.get(apiBasePath, {
            params: options
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

// Activity.
module.exports = {
    USER_GET_TOP_ARTISTS,
    USER_GET_TOP_ALBUMS,
    USER_GET_TOP_TRACKS,
    USER_GET_RECENT_TRACKS,

    PERIOD_OVERALL,
    PERIOD_WEEK,
    PERIOD_MONTH,
    PERIOD_3MONTH,
    PERIOD_6MONTH,
    PERIOD_YEAR,

    makeApiRequest
}