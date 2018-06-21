"use strict";

const path = require("path");
const fs = require("fs");

const discord = require("discord.js");

const { loadJson } = require("./utils");

const EVENTS = {

    CHANNEL_CREATE: "channelCreate",
    CHANNEL_DELETE: "channelDelete",
    CHANNEL_PINS_UPDATE: "channelPinsUpdate",
    CHANNEL_UPDATE: "channelUpdate",
    CLIENT_USER_GUILD_SETTINGS_UPDATE: "clientUserGuildSettingsUpdate",
    CLIENT_USER_SETTINGS_UPDATE: "clientUserSettingsUpdate",
    DEBUG: "debug",
    DISCONNECT: "disconnect",
    EMOJI_CREATE: "emojiCreate",
    EMOJI_DELETE: "emojiDelete",
    EMOJI_UPDATE: "emojiUpdate",
    ERROR: "error",
    GUILD_BAN_ADD: "guildBanAdd",
    GUILD_BAN_REMOVE: "guildBanRemove",
    GUILD_CREATE: "guildCreate",
    GUILD_DELETE: "guildDelete",
    GUILD_MEMBER_ADD: "guildMemberAdd",
    GUILD_MEMBER_AVAILABLE: "guildMemberAvailable",
    GUILD_MEMBER_REMOVE: "guildMemberRemove",
    GUILD_MEMBER_CHUNK: "guildMembersChunk",
    GUILD_MEMBER_SPEAKING: "guildMemberSpeaking",
    GUILD_MEMBER_UPDATE: "guildMemberUpdate",
    GUILD_UNAVAILABLE: "guildUnavailable",
    GUILD_UPDATE: "guildUpdate",
    MESSAGE: "message",
    MESSAGE_DELETE: "messageDelete",
    MESSAGE_DELETE_BULK: "messageDeleteBulk",
    MESSAGE_REACTION_ADD: "messageReactionAdd",
    MESSAGE_REACTION_REMOVE: "messageReactionRemove",
    MESSAGE_REACTION_REMOVE_ALL: "messageReactionRemoveAll",
    MESSAGE_UPDATE: "messageUpdate",
    PRESENCE_UPDATE: "presenceUpdate",
    READY: "ready",
    RECONNECTING: "reconnecting",
    RESUME: "resume",
    ROLE_CREATE: "roleCreate",
    ROLE_DELETE: "roleDelete",
    ROLE_UPDATE: "roleUpdate",
    TYPING_START: "typingStart",
    TYPING_STOP: "typingStop",
    USER_NOTE_UPDATE: "userNoteUpdate",
    USER_UPDATE: "userUpdate",
    VOICE_STATE_UPDATE: "voiceStateUpdate",
    WARN: "warn",

    COMMAND: "command"
}

const config = loadJson(path.join(__dirname, "config.json"));
if (config === null) {
    return;
}

const isDirectory = fp => fs.lstatSync(fp).isDirectory();
const getDirectories = fp => fs.readdirSync(fp).map(name => path.join(fp, name)).filter(isDirectory);

const isFile = fp => fs.lstatSync(fp).isFile();
const getFiles = fp => fs.readdirSync(fp).map(name => path.join(fp, name)).filter(isFile);

let mod = {
    package: "test",
    scripts: [
        {
            "author": "Dragon1320",
            "name": "test",
            "description": "a test script",
            "type": "js",
            "permissions": 3072,
            "dependencies": null,
            "event": "discord/message",
            "code": "scripts/test.js"
        }
    ],
    assets: [
        {
            "type": "image/png",
            "thething": "lolok"
        }
    ]
};

const loadModules = () => {


}

for (let mod of getDirectories("./core")) {

    console.log(getFiles(mod));
}

//const client = new discord.Client();

// connect to db

// init sandbox

// load core stuff

//client.login(config.bot_token);
