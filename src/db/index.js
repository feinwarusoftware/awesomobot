"use strict";

const { GuildSchema, GuildScriptSchema } = require("./schemas/guild");
const LogSchema = require("./schemas/log");
const ScriptSchema = require("./schemas/script");
const SessionSchema = require("./schemas/session");
const UserSchema = require("./schemas/user");

module.exports = {

    GuildSchema,
    GuildScriptSchema,
    LogSchema,
    ScriptSchema,
    SessionSchema,
    UserSchema
};
