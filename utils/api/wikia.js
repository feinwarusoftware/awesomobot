"use strict";

const rp = require("request-promise-native");

const { Opt, encodeURIParams } = require("../request");

const HOST = "southpark.wikia.com";
const VERSION = "/api/v1";

const search = options => {
  return new Promise((resolve, reject) => {

    const opt = new Opt(options);

    const required = ["query"];
    if (opt.assertContains(required) === false) {

      return reject(`the query was missing one of the following: ${required}`);
    }

    opt.fillDefaults({
      type: "",
      rank: "",
      limit: 25,
      minArticleQuality: 10,
      batch: 1,
      namespaces: "0,14"
    });

    rp(encodeURIParams(`https://${HOST}${VERSION}/Search/List`, opt.options))
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const articleAsSimpleJson = options => {
  return new Promise((resolve, reject) => {

    const opt = new Opt(options);

    const required = ["id"];
    if (opt.assertContains(required) === false) {

      return reject(`the query was missing one of the following: ${required}`);
    }

    rp(encodeURIParams(`https://${HOST}${VERSION}/Articles/AsSimpleJson`, opt.options))
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const articleDetails = options => {
  return new Promise((resolve, reject) => {

    const opt = new Opt(options);

    const required = ["ids"];
    if (opt.assertContains(required) === false) {

      return reject(`the query was missing one of the following: ${required}`);
    }

    opt.fillDefaults({
      titles: "",
      abstract: 100,
      width: 200,
      height: 200
    });

    rp(encodeURIParams(`https://${HOST}${VERSION}/Articles/Details`, opt.options))
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {

  search,
  articleAsSimpleJson,
  articleDetails
};
