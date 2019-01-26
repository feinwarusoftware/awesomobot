"use strict";

const rp = require("request-promise-native");

const { Opt, encodeURIParams } = require("../request");

const HOST = "en.wikipedia.org";
const VERSION = "/w/api.php";

// This is a single use thing and not a proper library, please update this to
// use the new wikipedia rest api (https://en.wikipedia.org/api/rest_v1/)
const pageAsJson = options => {
  return new Promise((resolve, reject) => {

    const opt = new Opt(options);

    const required = ["titles"];
    if (opt.assertContains(["titles"]) === false) {

      return reject(`wikipedia - the query was missing one of the following: ${required}`);
    }

    opt.fillDefaults({
      action: "query",
      prop: "revisions",
      rvprop: "content",
      format: "json"
    });

    rp(encodeURIParams(`https://${HOST}${VERSION}`, opt.options))
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {

  pageAsJson
};
