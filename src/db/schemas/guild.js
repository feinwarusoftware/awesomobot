"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GuildSchema = new Schema({

    //  _id: ObjectId,
    discord_id: { type: String, required: true, unique: true },
    prefix: { type: String, default: "<<" },
    log_channel_id: { type: String, default: null },
    log_events: [ String ],
    scripts: [{
        object_id: { type: Schema.Types.ObjectId, required: true },
        match_override: { type: String, default: null },
        match_type_override: { type: String, default: null },
        perms: {
            enabled: { type: Boolean, default: true },
            members: {
                allow_list: { type: Boolean, default: false },
                list: [ String ]
            },
            channels: {
                allow_list: { type: Boolean, default: false },
                list: [ String ]
            },
            roles: {
                allow_list: { type: Boolean, default: false },
                list: [ String ]
            }
        }
    }],
});

module.exports = mongoose.model("Guild", GuildSchema);
