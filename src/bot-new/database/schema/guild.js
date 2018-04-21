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
        groundedRole: String,
        teamRoles: [{
            alias: {
                type: String,
                lowercase: true
            },
            id: String
        }]
    },
    members: [{
        id: String,
        lastfm: String,
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
        }]
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
    }]
}, { usePushEach: true });

module.exports = mongoose.model("guilds", GuildSchema);
