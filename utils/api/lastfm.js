"use strict";

const rp = require("request-promise-native");

const { Opt, encodeUriParams } = require("../request");

const HOST = "ws.audioscrobbler.com";
const VERSION = "/2.0";

class LastFM {
    constructor(token) {

        this.token = token;
    }
    makeApiRequest(options) {
        return new Promise(async (resolve, reject) => {

            const opt = new Opt(options);
    
            const required = ["method", "user"];
            if (opt.assertContains(required) === false) {
    
                return reject(`the query was missing one of the following: ${required}`);
            }

            opt.fillDefaults({
                format: "json",
                api_key: this.token,
                limit: 5,
                period: "overall"
            });

            try {
                const res = await rp(encodeUriParams(`https://${HOST}${VERSION}`), opt.options);
                resolve(res);
    
            } catch(err) {
    
                reject(err);
            }
        });
    }
    getTopArtists(options) {
        return new Promise(async (resolve, reject) => {

            options.method = "user.gettopartists";

            try {

                const res = await this.makeApiRequest(options);
                resolve(res);

            } catch(err) {

                reject(err);
            }
        });
    }
    getTopAlbums(options) {
        return new Promise(async (resolve, reject) => {

            options.method = "user.gettopalbums";

            try {

                const res = await this.makeApiRequest(options);
                resolve(res);

            } catch(err) {

                reject(err);
            }
        });
    }
    getTopTracks(options) {
        return new Promise(async (resolve, reject) => {

            options.method = "user.gettoptracks";

            try {

                const res = await this.makeApiRequest(options);
                resolve(res);

            } catch(err) {

                reject(err);
            }
        });
    }
    getRecentTracks(options) {
        return new Promise(async (resolve, reject) => {

            options.method = "user.getrecenttracks";

            try {

                const res = await this.makeApiRequest(options);
                resolve(res);

            } catch(err) {

                reject(err);
            }
        });
    }
}

module.exports = LastFM;
