"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const guildSchema = new Schema({

    //  _id: ObjectId,
    discordId: { type: String, required: true, unique: true },
    premium: { type: Boolean, default: false },
    prefix: { type: String, default: "<<" },
    logChannelId: { type: String, default: null },
    logEvents: [ String ],
    scripts: [{
        objectId: { type: Schema.Types.ObjectId, required: true },
        perms: {
            enabled: { type: Boolean, default: true },
            members: {
                allowInList: { type: Boolean, default: false },
                list: [ String ]
            },
            channels: {
                allowInList: { type: Boolean, default: false },
                list: [ String ]
            },
            roles: {
                allowInList: { type: Boolean, default: false },
                list: [ String ]
            }
        }
    }]
});

module.exports = mongoose.model("Guild", guildSchema);
