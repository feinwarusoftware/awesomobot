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
        
        this.client.on(EVENTS.CHANNEL_CREATE, async channel => {

            const guildDoc = await this.db.getGuildByDiscordId(channel.guild.id);
            this.dlogger.log(guildDoc, EVENTS.CHANNEL_CREATE, arguments);
        });
        this.client.on(EVENTS.CHANNEL_DELETE, async channel => {

            const guildDoc = await this.db.getGuildByDiscordId(channel.guild.id);
            this.dlogger.log(guildDoc, EVENTS.CHANNEL_DELETE, arguments);
        });
        this.client.on(EVENTS.CHANNEL_PINS_UPDATE, async (channel, time) => {

            const guildDoc = await this.db.getGuildByDiscordId(channel.guild.id);
            this.dlogger.log(guildDoc, EVENTS.CHANNEL_PINS_UPDATE, arguments);
        });
        this.client.on(EVENTS.CHANNEL_UPDATE, async (oldChannel, newChannel) => {

            const guildDoc = await this.db.getGuildByDiscordId(oldChannel.guild.id);
            this.dlogger.log(guildDoc, EVENTS.CHANNEL_UPDATE, arguments);
        });
        this.client.on(EVENTS.CLIENT_USER_GUILD_SETTINGS_UPDATE, async clientUserGuildSettings => {

            const guildDoc = await this.db.getGuildByDiscordId(clientUserGuildSettings.guildID);
            this.dlogger.log(guildDoc, EVENTS.CLIENT_USER_GUILD_SETTINGS_UPDATE, arguments);
        });
        this.client.on(EVENTS.CLIENT_USER_SETTINGS_UPDATE, async clientUserSettings => {
            
            this.clogger.log(`bot-${this.id}: bot client user settings update - ${JSON.stringify(clientUserSettings)}`, log.DBLogger.LOG_TYPE.STDOUT);
        });
        this.client.on(EVENTS.DEBUG, async info => {

            this.clogger.log(`bot-${this.id}: bot debug - ${info}`, log.DBLogger.LOG_TYPE.STDOUT);
        });
        this.client.on(EVENTS.DISCONNECT, async event => {

            this.clogger.log(`bot-${this.id}: bot disconnected - ${JSON.stringify(event)}`, log.DBLogger.LOG_TYPE.STDOUT);
        });
        this.client.on(EVENTS.EMOJI_CREATE, async emoji => {

            const guildDoc = await this.db.getGuildByDiscordId(emoji.guild.id);
            this.dlogger.log(guildDoc, EVENTS.EMOJI_CREATE, arguments);
        });
        this.client.on(EVENTS.EMOJI_DELETE, async emoji => {

            const guildDoc = await this.db.getGuildByDiscordId(emoji.guild.id);
            this.dlogger.log(guildDoc, EVENTS.EMOJI_DELETE, arguments);
        });
        this.client.on(EVENTS.EMOJI_UPDATE, async (oldEmoji, newEmoji) => {

            const guildDoc = await this.db.getGuildByDiscordId(oldEmoji.guild.id);
            this.dlogger.log(guildDoc, EVENTS.EMOJI_UPDATE, arguments);
        });
        this.client.on(EVENTS.ERROR, async error => {

            this.clogger.log(`bot-${this.id}: bot error - ${error}`, log.DBLogger.LOG_TYPE.STDERR);
        });
        this.client.on(EVENTS.GUILD_BAN_ADD, async (guild, user) => {

            const guildDoc = await this.db.getGuildByDiscordId(guild.id);
            this.dlogger.log(guildDoc, EVENTS.GUILD_BAN_ADD, arguments);
        });
        this.client.on(EVENTS.GUILD_BAN_REMOVE, async (guild, user) => {

            const guildDoc = await this.db.getGuildByDiscordId(guild.id);
            this.dlogger.log(guildDoc, EVENTS.GUILD_BAN_REMOVE, arguments);
        });
        this.client.on(EVENTS.GUILD_CREATE, async guild => {

            const guildDoc = await this.db.getGuildByDiscordId(guild.id);
            this.dlogger.log(guildDoc, EVENTS.GUILD_CREATE, arguments);
        });
        this.client.on(EVENTS.GUILD_DELETE, async guild => {

            const guildDoc = await this.db.getGuildByDiscordId(guild.id);
            this.dlogger.log(guildDoc, EVENTS.GUILD_DELETE, arguments);
        });
        this.client.on(EVENTS.GUILD_MEMBER_ADD, async member => {

            const guildDoc = await this.db.getGuildByDiscordId(member.guild.id);
            this.dlogger.log(guildDoc, EVENTS.GUILD_MEMBER_ADD, arguments);
        });
        this.client.on(EVENTS.GUILD_MEMBER_AVAILABLE, async member => {

            const guildDoc = await this.db.getGuildByDiscordId(member.guild.id);
            this.dlogger.log(guildDoc, EVENTS.GUILD_MEMBER_AVAILABLE, arguments);
        });
        this.client.on(EVENTS.GUILD_MEMBER_REMOVE, async member => {

            const guildDoc = await this.db.getGuildByDiscordId(member.guild.id);
            this.dlogger.log(guildDoc, EVENTS.GUILD_MEMBER_REMOVE, arguments);
        });
        this.client.on(EVENTS.GUILD_MEMBER_CHUNK, async (members, guild) => {

            const guildDoc = await this.db.getGuildByDiscordId(guild.id);
            this.dlogger.log(guildDoc, EVENTS.GUILD_MEMBER_CHUNK, arguments);
        });
        this.client.on(EVENTS.GUILD_MEMBER_SPEAKING, async (member, speaking) => {

            const guildDoc = await this.db.getGuildByDiscordId(member.guild.id);
            this.dlogger.log(guildDoc, EVENTS.GUILD_MEMBER_SPEAKING, arguments);
        });
        this.client.on(EVENTS.GUILD_MEMBER_UPDATE, async (oldMember, newMember) => {

            const guildDoc = await this.db.getGuildByDiscordId(oldMember.guild.id);
            this.dlogger.log(guildDoc, EVENTS.GUILD_MEMBER_UPDATE, arguments);
        });
        this.client.on(EVENTS.GUILD_UNAVAILABLE, async guild => {

            const guildDoc = await this.db.getGuildByDiscordId(guild.id);
            this.dlogger.log(guildDoc, EVENTS.GUILD_UNAVAILABLE, arguments);
        });
        this.client.on(EVENTS.GUILD_UPDATE, async (oldGuild, newGuild) => {

            const guildDoc = await this.db.getGuildByDiscordId(oldGuild.id);
            this.dlogger.log(guildDoc, EVENTS.GUILD_UPDATE, arguments);
        });
        this.client.on(EVENTS.MESSAGE, async message => {

            //
        });
        this.client.on(EVENTS.MESSAGE_DELETE, async message => {

            const guildDoc = await this.db.getGuildByDiscordId(message.guild.id);
            this.dlogger.log(guildDoc, EVENTS.MESSAGE_DELETE, arguments);
        });
        this.client.on(EVENTS.MESSAGE_DELETE_BULK, async messages => {

            const guildDoc = await this.db.getGuildByDiscordId(messages.array()[0].guild.id);
            this.dlogger.log(guildDoc, EVENTS.MESSAGE_DELETE_BULK, arguments);
        });
        this.client.on(EVENTS.MESSAGE_REACTION_ADD, async (messageReaction, user) => {

            const guildDoc = await this.db.getGuildByDiscordId(messageReaction.message.guild.id);
            this.dlogger.log(guildDoc, EVENTS.MESSAGE_REACTION_ADD, arguments);
        });
        this.client.on(EVENTS.MESSAGE_REACTION_REMOVE, async (messageReaction, user) => {

            const guildDoc = await this.db.getGuildByDiscordId(messageReaction.message.guild.id);
            this.dlogger.log(guildDoc, EVENTS.MESSAGE_REACTION_REMOVE, arguments);
        });
        this.client.on(EVENTS.MESSAGE_REACTION_REMOVE_ALL, async message => {

            const guildDoc = await this.db.getGuildByDiscordId(message.guild.id);
            this.dlogger.log(guildDoc, EVENTS.MESSAGE_REACTION_REMOVE_ALL, arguments);
        });
        this.client.on(EVENTS.MESSAGE_UPDATE, async (oldMessage, newMessage) => {

            const guildDoc = await this.db.getGuildByDiscordId(oldMessage.guild.id);
            this.dlogger.log(guildDoc, EVENTS.MESSAGE_UPDATE, arguments);
        });
        this.client.on(EVENTS.PRESENCE_UPDATE, async (oldMember, newMember) => {

            const guildDoc = await this.db.getGuildByDiscordId(oldMember.guild.id);
            this.dlogger.log(guildDoc, EVENTS.PRESENCE_UPDATE, arguments);
        });
        this.client.on(EVENTS.READY, async () => {

            this.clogger.log(`bot-${this.id}: bot ready`, log.DBLogger.LOG_TYPE.STDOUT);
        });
        this.client.on(EVENTS.RECONNECTING, async () => {

            this.clogger.log(`bot-${this.id}: bot reconnectiong`, log.DBLogger.LOG_TYPE.STDOUT);
        });
        this.client.on(EVENTS.RESUME, async replayed => {

            this.clogger.log(`bot-${this.id}: bot replayed ${replayed} events`, log.DBLogger.LOG_TYPE.STDOUT);
        });
        this.client.on(EVENTS.ROLE_CREATE, async role => {

            const guildDoc = await this.db.getGuildByDiscordId(role.guild.id);
            this.dlogger.log(guildDoc, EVENTS.ROLE_CREATE, arguments);
        });
        this.client.on(EVENTS.ROLE_DELETE, async role => {

            const guildDoc = await this.db.getGuildByDiscordId(role.guild.id);
            this.dlogger.log(guildDoc, EVENTS.ROLE_DELETE, arguments);
        });
        this.client.on(EVENTS.ROLE_UPDATE, async (oldRole, newRole) => {

            const guildDoc = await this.db.getGuildByDiscordId(oldRole.guild.id);
            this.dlogger.log(guildDoc, EVENTS.ROLE_UPDATE, arguments);
        });
        this.client.on(EVENTS.TYPING_START, async (channel, user) => {

            const guildDoc = await this.db.getGuildByDiscordId(channel.guild.id);
            this.dlogger.log(guildDoc, EVENTS.TYPING_START, arguments);
        });
        this.client.on(EVENTS.TYPING_STOP, async (channel, user) => {

            const guildDoc = await this.db.getGuildByDiscordId(channel.guild.id);
            this.dlogger.log(guildDoc, EVENTS.TYPING_STOP, arguments);
        });
        this.client.on(EVENTS.USER_NOTE_UPDATE, async (user, oldNote, newNote) => {

            this.clogger.log(`bot-${this.id}: bot user note update - user: ${JSON.stringify(user)}, oldNote: ${oldNote}, newNote: ${newNote}`, log.DBLogger.LOG_TYPE.STDOUT);
        });
        this.client.on(EVENTS.USER_UPDATE, async (oldUser, newUser) => {

            this.clogger.log(`bot-${this.id}: bot user update - oldUser: ${JSON.stringify(oldUser)}, newUser: ${JSON.stringify(newUser)}`, log.DBLogger.LOG_TYPE.STDOUT);
        });
        this.client.on(EVENTS.VOICE_STATE_UPDATE, async (oldMember, newMember) => {

            const guildDoc = await this.db.getGuildByDiscordId(oldMember.guild.id);
            this.dlogger.log(guildDoc, EVENTS.VOICE_STATE_UPDATE, arguments);
        });
        this.client.on(EVENTS.WARN, async info => {

            this.clogger.log(`bot-${this.id}: bot warning - ${info}`, log.DBLogger.LOG_TYPE.STDOUT);
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
