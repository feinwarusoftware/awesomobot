"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuildSchema = new Schema({
    id: { type: String, unique: true, required: true },
    premium: { type: Boolean, default: false },
    settings: {
        prefix: { type: String, default: "<<" },
        fandom: { type: String, default: "southpark" },
        logChannel: String,
        roleChannel: String,
        roleMessage: String,
        groundedRole: String,
        roleSwitchTimeout: { type: Number, default: 5 },
        teamRoles: [{
            alias: {
                type: String,
                lowercase: true
            },
            id: String,
            emoji: String,
            exclusive: Boolean
        }]
    },
    members: [{
        id: String,
        lastRoleChange: { type: Date, default: Date.now },
        stats: [{
            name: {
                type: String,
                lowercase: true
            },
            value: { type: Number, default: 0, min: 0 }
        }],
        badges: [{
            name: {
                type: String,
                lowercase: true
            },
            value: { type: Boolean, default: false }
        }],
        roles: [String] 
    }],
    groups: [{
        name: {
            type: String,
            lowercase: true
        },
        inherits: [{
            type: String,
            lowercase: true
        }],
        channels: [{
            target: String,
            allow: Boolean
        }],
        roles: [{
            target: String,
            allow: Boolean
        }],
        members: [{
            target: String,
            allow: Boolean
        }],
        badges: [{
            target: String,
            allow: Boolean
        }]
    }],
    commands: [{
        name: {
            type: String,
            lowercase: true
        },
        group: {
            type: String,
            lowercase: true
        }
    }],
    bindings: [{
        name: {
            type: String,
            lowercase: true
        },
        authorId: String,
        value: String
    }]
}, { usePushEach: true });

module.exports = mongoose.model("guilds", GuildSchema);
