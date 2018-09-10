"use strict";

class Command {
    constructor(options) {

        this.author_id = options.author_id;

        this.name = options.name;
        this.description = options.description;
        this.thumbnail = options.thumbnail;
        this.marketplace_enabled = options.marketplace_enabled;

        this.type = options.type;
        this.match_type = options.match_type;
        this.match = options.match;

        this.featured = options.featured;

        this.cb = options.cb;
        this.load = options.load;
    }
    run(client, message, guild, user, script, match) {
        this.cb(client, message, guild, user, script, match);
    }
    startup() {
        return new Promise((resolve, reject) => {
            if (this.load !== undefined) {

                return this.load().then(() => {

                    console.log(`successfully loaded: '${this.name}'`);
                    resolve();
                }).catch(error => {

                    reject(error);
                });
            }

            resolve();
        });
    }
}

module.exports = Command;
