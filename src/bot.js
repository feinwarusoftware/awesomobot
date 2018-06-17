"use strict";

const path = require("path");

const discord = require("discord.js");

const db = require("./database");
const log = require("./logger");
const sb = require("./sandbox");
const utils = require("./utils");

const cfg = utils.loadJson(path.join(__dirname, "..", "config.json"));

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
    WARN: "warn "
}

const PERMS = {

    CREATE_INSTANT_INVITE: 0x00000001,
    KICK_MEMBERS: 0x00000002,
    BAN_MEMBERS: 0x00000004,
    ADMINISTRATOR: 0x00000008,
    MANAGE_CHANNELS: 0x00000010,
    MANAGE_GUILD: 0x00000020,
    ADD_REACTIONS: 0x00000040,
    VIEW_AUDIT_LOG: 0x00000080,
    VIEW_CHANNEL: 0x00000400,
    SEND_MESSAGES: 0x00000800,
    SEND_TTS_MESSAGES: 0x00001000,
    MANAGE_MESSAGES: 0x00002000,
    EMBED_LINKS: 0x00004000,
    ATTACH_FILES: 0x00008000,
    READ_MESSAGE_HISTORY: 0x00010000,
    MENTION_EVERYONE: 0x00020000,
    USE_EXTERNAL_EMOJIS: 0x00040000,
    CONNECT: 0x00100000,
    SPEAK: 0x00200000,
    MUTE_MEMBERS: 0x00400000,
    DEAFEN_MEMBERS: 0x00800000,
    MOVE_MEMBERS: 0x01000000,
    USE_VAD: 0x02000000,
    CHANGE_NICKNAME: 0x04000000,
    MANAGE_NICKNAMES: 0x08000000,
    MANAGE_ROLES: 0x10000000,
    MANAGE_WEBHOOKS: 0x20000000,
    MANAGE_EMOJIS: 0x40000000
};

class Bot {
    constructor(id, token) {

        this.id = id;
        this.token = token;

        this.db = new db.Database(cfg.db_id, cfg.db_address);
        this.sb = new sb.Sandbox(cfg.sb_id, {}, cfg.sb_timeout, cfg.env);
        this.client = new discord.Client();

        this.dlogger = new log.DLogger.DiscordLogger(this.db, this.client);
        this.clogger = new log.DBLogger.DatabaseLogger(this.db);
        
        this.client.on(EVENTS.CHANNEL_CREATE, channel => {

        });
        this.client.on(EVENTS.CHANNEL_DELETE, channel => {

        });
        this.client.on(EVENTS.CHANNEL_PINS_UPDATE, (channel, time) => {

        });
        this.client.on(EVENTS.CHANNEL_UPDATE, (oldChannel, newChannel) => {

        });
        this.client.on(EVENTS.CLIENT_USER_GUILD_SETTINGS_UPDATE, clientUserGuildSettings => {

        });
        this.client.on(EVENTS.CLIENT_USER_SETTINGS_UPDATE, clientUserSettings => {
            
        });
        this.client.on(EVENTS.DEBUG, info => {

        });
        this.client.on(EVENTS.DISCONNECT, event => {

        });
        this.client.on(EVENTS.EMOJI_CREATE, emoji => {

        });
        this.client.on(EVENTS.EMOJI_DELETE, emoji => {

        });
        this.client.on(EVENTS.EMOJI_UPDATE, (oldEmoji, newEmoji) => {

        });
        this.client.on(EVENTS.ERROR, error => {

        });
        this.client.on(EVENTS.GUILD_BAN_ADD, (guild, user) => {

        });
        this.client.on(EVENTS.GUILD_BAN_REMOVE, (guild, user) => {

        });
        this.client.on(EVENTS.GUILD_CREATE, guild => {

        });
        this.client.on(EVENTS.GUILD_DELETE, guild => {

        });
        this.client.on(EVENTS.GUILD_MEMBER_ADD, member => {

        });
        this.client.on(EVENTS.GUILD_MEMBER_AVAILABLE, member => {

        });
        this.client.on(EVENTS.GUILD_MEMBER_REMOVE, member => {

        });
        this.client.on(EVENTS.GUILD_MEMBER_CHUNK, (members, guild) => {

        });
        this.client.on(EVENTS.GUILD_MEMBER_SPEAKING, (member, speaking) => {

        });
        this.client.on(EVENTS.GUILD_MEMBER_UPDATE, (oldMember, newMember) => {

        });
        this.client.on(EVENTS.GUILD_UNAVAILABLE, guild => {

        });
        this.client.on(EVENTS.GUILD_UPDATE, (oldGuild, newGuild) => {

        });
        this.client.on(EVENTS.MESSAGE, message => {

        });
        this.client.on(EVENTS.MESSAGE_DELETE, message => {

        });
        this.client.on(EVENTS.MESSAGE_DELETE_BULK, messages => {

        });
        this.client.on(EVENTS.MESSAGE_REACTION_ADD, (messageReaction, user) => {

        });
        this.client.on(EVENTS.MESSAGE_REACTION_REMOVE, (messageReaction, user) => {

        });
        this.client.on(EVENTS.MESSAGE_REACTION_REMOVE_ALL, message => {

        });
        this.client.on(EVENTS.MESSAGE_UPDATE, (oldMessage, newMessage) => {

        });
        this.client.on(EVENTS.PRESENCE_UPDATE, (oldMember, newMember) => {

        });
        this.client.on(EVENTS.READY, () => {
            console.log(`bot-${this.id}: bot started`);
        });
        this.client.on(EVENTS.RECONNECTING, () => {

        });
        this.client.on(EVENTS.RESUME, replayed => {

        });
        this.client.on(EVENTS.ROLE_CREATE, role => {

        });
        this.client.on(EVENTS.ROLE_DELETE, role => {

        });
        this.client.on(EVENTS.ROLE_UPDATE, (oldRole, newRole) => {

        });
        this.client.on(EVENTS.TYPING_START, (channel, user) => {

        });
        this.client.on(EVENTS.TYPING_STOP, (channel, user) => {

        });
        this.client.on(EVENTS.USER_NOTE_UPDATE, (user, oldNote, newNote) => {

        });
        this.client.on(EVENTS.USER_UPDATE, (oldUser, newUser) => {

        });
        this.client.on(EVENTS.VOICE_STATE_UPDATE, (oldMember, newMember) => {

        });
        this.client.on(EVENTS.WARN, info => {

        });
    }
    start() {

        if (this.client === null) {
            this.client = new discord.Client();
        }

        this.client.login(this.token);
    }
    stop() {
        
        this.client.destroy();
        this.client = null;
    }
}

module.exports = {
    
    Bot
};
