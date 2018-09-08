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
    }
    run(client, message, guild, user, script, match) {
        this.cb(client, message, guild, user, script, match);
    }
}

module.exports = Command;
