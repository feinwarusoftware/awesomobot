"use strict";

const querystring = require("querystring");
const https = require("https");

function get(host, endpoint, data) {
    return new Promise((resolve, reject) => {
        let dataString = JSON.stringify(data);
        endpoint += "?" + querystring.stringify(data);

        let req = https.request({
            host: host,
            path: endpoint,
            method: "GET",
            headers: {},
        }, res => {
            res.setEncoding("utf-8");
    
            let resString = "";
    
            res.on("data", data => {
                resString += data;
            });
    
            res.on("end", () => {
                let resObject = JSON.parse(resString);
                resolve(resObject)
            });
        });

        req.on('error', e => {
            reject("problem with request: ${e.message}")
        });
    
        req.write(dataString);
        req.end();
    });
}

module.exports = {
    get,
};