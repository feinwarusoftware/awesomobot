"use strict";

const utils = require("../utils");
const request = utils.request;

const host = "southpark.wikia.com";
const api = "/api/v1";

function search(options, callback) {
    return new Promise((resolve, reject) => {
        let query = utils.opt(options, "query", "");
        let type = utils.opt(options, "type", "");
        let rank = utils.opt(options, "rank", "");
        let limit = utils.opt(options, "limit", 25);
        let minArticleQuality = utils.opt(options, "minArticleQuality", 10);
        let batch = utils.opt(options, "batch", 1);
        let namespaces = utils.opt(options, "namespaces", "0,14");
        if (query == "") {
            reject("Query not specified!");
        }

        resolve(request.get(host, api+"/Search/List", {
            query: query,
            type: type,
            rank: rank,
            limit: limit,
            minArticleQuality: minArticleQuality,
            batch: batch,
            namespaces: namespaces,
        }));
    });
}

function articleAsSimpleJson(options, callback) {
    return new Promise((resolve, reject) => {
        let id = utils.opt(options, "id", 50);

        resolve(request.get(host, api+"/Articles/AsSimpleJson", {
            id: id,
        }));
    });
}

function articleDetails(options, callback) {
    return new Promise((resolve, reject) => {
        let ids = utils.opt(options, "ids", "50");
        let titles = utils.opt(options, "titles", "");
        let abstract = utils.opt(options, "abstract", 100);
        let width = utils.opt(options, "width", 200);
        let height = utils.opt(options, "height", 200);

        resolve(request.get(host, api+"/Articles/Details", {
            ids: ids,
            titles: titles,
            abstract: abstract,
            width: width,
            height: height,
        }));
    });
}

module.exports = {
    search,
    articleAsSimpleJson,
    articleDetails,
}
