"use strict";

const rp = require("request-promise-native");

const { Opt, encodeURIParams } = require("../request");

const HOST = "ws.audioscrobbler.com";
const VERSION = "/2.0";

class LastFM {
  constructor(token) {

    this.token = token;
  }
  makeApiRequest(options) {
    return new Promise((resolve, reject) => {

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

      rp(encodeURIParams(`https://${HOST}${VERSION}`, opt.options))
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  getTopArtists(options) {
    return new Promise((resolve, reject) => {

      options.method = "user.gettopartists";

      this.makeApiRequest(options)
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  getTopAlbums(options) {
    return new Promise((resolve, reject) => {

      options.method = "user.gettopalbums";

      this.makeApiRequest(options)
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  getTopTracks(options) {
    return new Promise((resolve, reject) => {

      options.method = "user.gettoptracks";

      this.makeApiRequest(options)
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  getRecentTracks(options) {
    return new Promise((resolve, reject) => {

      options.method = "user.getrecenttracks";

      this.makeApiRequest(options)
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

module.exports = LastFM;
