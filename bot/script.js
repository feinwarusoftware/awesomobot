"use strict";

class Script {
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

        this.preload = options.preload;

        this.cb = options.cb;
        this.load = options.load;
    }
    run(client, message, guild, user, script, match) {
        this.cb(client, message, guild, user, script, match);
    }
    startup() {
        return new Promise(async (resolve, reject) => {
            if (this.load != null) {

                try {
                    await this.load();

                } catch(err) {

                    return reject(err);
                }
            }

            resolve();
        });
    }
}

module.exports = Script;
