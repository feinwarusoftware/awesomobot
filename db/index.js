"use strict";

const initGuildSchemas = require("./schemas/guild");
//const LogSchema = require("./schemas/log");
const initScriptSchema = require("./schemas/script");
const initSessionSchema = require("./schemas/session");
const initUserSchema = require("./schemas/user");

const initSchemas = mongoose => {

    const guildSchemas = initGuildSchemas(mongoose);

    module.exports.GuildSchema = guildSchemas.GuildSchema;
    module.exports.GuildScriptSchema = guildSchemas.GuildScriptSchema;

    module.exports.ScriptSchema = initScriptSchema(mongoose);

    module.exports.SessionSchema = initSessionSchema(mongoose);

    module.exports.UserSchema = initUserSchema(mongoose);
}

module.exports = {

    initSchemas
};
