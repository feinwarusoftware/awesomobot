"use strict";

const rp = require("request-promise-native");

const HOST = "owapi.net";
const VERSION = "/api/v3";

class Overwatch {
  constructor() {
  }
  makeApiRequest(username, platform) {
    return new Promise((resolve, reject) => {

      let options = {
        headers: {
          "User-Agent": "AWESOM-O/3.1"
        }
      };

      rp(`https://${HOST}${VERSION}/u/${username}/stats?platform=${platform}`, options)
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

module.exports = Overwatch;
