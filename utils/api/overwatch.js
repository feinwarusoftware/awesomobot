"use strict";

const rp = require("request-promise-native");

const HOST = "owapi.net";
const VERSION = "/api/v3";

class Overwatch {
    constructor() {
    }
    makeApiRequest(username, platform) {
        return new Promise(async (resolve, reject) => {

            let options = {
                headers: {
                    'User-Agent': 'AWESOM-O/3.1'
                },
            };

            try {
                const res = await rp(`https://${HOST}${VERSION}/u/${username}/stats?platform=${platform}`, options);
                resolve(res);
    
            } catch(err) {
    
                reject(err);
            }
        });
    }
}

module.exports = Overwatch;
