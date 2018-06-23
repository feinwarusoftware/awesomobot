"use strict";

class Command {
    constructor(author, name, description, type, permissions, match, match_type, assets, cb) {
        this.author = author;
        this.name = name;
        this.description = description;
        this.type = type;
        this.permissions = permissions;
        this.match = match;
        this.match_type = match_type;
        this.assets = assets;
        this.cb = cb;
    }
    run(client, message, guildDoc) {
        this.cb(client, message, guildDoc);
    }
}

module.exports = Command;
