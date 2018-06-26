"use strict";

class Command {
    constructor(name, description, type, permissions, match, match_type, order, passthrough, assets, cb) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.permissions = permissions;
        this.match = match;
        this.match_type = match_type;
        this.order = order;
        this.passthrough = passthrough;
        this.assets = assets;
        this.cb = cb;
    }
    run(client, message, guildDoc) {
        this.cb(client, message, guildDoc);
    }
}

module.exports = Command;
