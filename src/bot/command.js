"use strict";

class Command {
    constructor(author, name, description, type, permissions, assets, cb) {
        this.author = author;
        this.name = name;
        this.description = description;
        this.type = type;
        this.permissions = permissions;
        this.assets = assets;
        this.cb = cb;
    }
    run(client, message, guildDoc) {
        this.cb(client, message, guildDoc);
    }
}

module.exports = Command;
