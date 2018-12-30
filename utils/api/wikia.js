"use strict";

const rp = require("request-promise-native");

const { Opt, encodeURIParams } = require("../request");

const HOST = "southpark.wikia.com";
const VERSION = "/api/v1";

const search = options => {
    return new Promise(async (resolve, reject) => {

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
    
        try {
            const res = await rp(encodeURIParams(`https://${HOST}${VERSION}/Search/List`, opt.options));
            resolve(JSON.parse(res));

        } catch(err) {

            reject(err);
        }
    });
}

const articleAsSimpleJson = options => {
    return new Promise(async (resolve, reject) => {

        const opt = new Opt(options);

        const required = ["id"];
        if (opt.assertContains(required) === false) {
    
            return reject(`the query was missing one of the following: ${required}`);
        }
    
        try {
            const res = await rp(encodeURIParams(`https://${HOST}${VERSION}/Articles/AsSimpleJson`, opt.options));
            resolve(JSON.parse(res));

        } catch(err) {

            reject(err);
        }
    });
}

const articleDetails = options => {
    return new Promise(async (resolve, reject) => {

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
    
        try {
            const res = await rp(encodeURIParams(`https://${HOST}${VERSION}/Articles/Details`, opt.options));
            resolve(JSON.parse(res));

        } catch(err) {

            reject(err);
        }
    });
}

module.exports = {
    
    search,
    articleAsSimpleJson,
    articleDetails,
}
