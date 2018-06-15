"use strict";

const discord = require("discord.js");
const db = require("../db");

const EVENTS = {
    CHANNEL_CREATE: 0,
    CHANNEL_DELETE: 1,
    CHANNEL_PINS_UPDATE: 2,
    CLIENT_USER_GUILD_SETTINGS_UPDATE: 3,
    CLIENT_USER_SETTINGS_UPDATE: 4,
    DEBUG: 5,
    DISCONNECT: 6,
    EMOJI_CREATE: 7,
    EMOJI_DELETE: 8,
    EMOJI_UPDATE: 9,
    ERROR: 10,
    GUILD_BAN_ADD: 11,
    GUILD_BAN_REMOVE: 12,
    GUILD_CREATE: 13,
    GUILD_DELETE: 14,
    GUILD_MEMBER_ADD: 15,
    GUILD_MEMBER_AVAILABLE: 16,
    GUILD_MEMBER_REMOVE: 17,
    GUILD_MEMBER_CHUNK: 18,
    GUILD_MEMBER_SPEAKING: 19,
    GUILD_MEMBER_UPDATE: 20,
    GUILD_UNAVAILABLE: 21,
    GUILD_UPDATE: 22,
    MESSAGE: 23,
    MESSAGE_DELETE: 24,
    MESSAGE_DELETE_BULK: 25,
    MESSAGE_REACTION_ADD: 26,
    MESSAGE_REACTION_REMOVE: 27,
    MESSAGE_REACTION_REMOVE_ALL: 28,
    MESSAGE_UPDATE: 29,
    PRESENCE_UPDATE: 30,
    READY: 31,
    RECONNECTING: 32,
    RESUME: 33,
    ROLE_CREATE: 34,
    ROLE_DELETE: 35,
    ROLE_UPDATE: 36,
    TYPING_START: 37,
    TYPING_STOP: 38,
    USER_NOTE_UPDATE: 39,
    USER_UPDATE: 40,
    VOICE_STATE_UPDATE: 41,
    WARN: 42
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

const 

class Bot {
    constructor(id, token) {

        this.id = id;
        this.paused = false;
        this.client = new discord.Client();
        this.db = new db.Database(`bot:${id}-db`, `bot:${id}`);
        
        this.client.on("channelCreate", channel => {});
        this.client.on("channelDelete", channel => {});
        this.client.on("channelPinsUpdate", (channel, time) => {});
        this.client.on("channelUpdate", (oldChannel, newChannel) => {});
        this.client.on("clientUserGuildSettingsUpdate", clientUserGuildSettings => {});
        this.client.on("clientUserSettingsUpdate", clientUserSettings => {});
        this.client.on("debug", info => {});
        this.client.on("disconnect", event => {});
        this.client.on("emojiCreate", emoji => {});
        this.client.on("emojiDelete", emoji => {});
        this.client.on("emojiUpdate", (oldEmoji, newEmoji) => {});
        this.client.on("error", error => {});
        this.client.on("guildBanAdd", (guild, user) => {});
        this.client.on("guildBanRemove", (guild, user) => {});
        this.client.on("guildCreate", guild => {});
        this.client.on("guildDelete", guild => {});
        this.client.on("guildMemberAdd", member => {});
        this.client.on("guildMemberAvailable", member => {});
        this.client.on("guildMemberRemove", member => {});
        this.client.on("guildMembersChunk", (members, guild) => {});
        this.client.on("guildMemberSpeaking", (member, speaking) => {});
        this.client.on("guildMemberUpdate", (oldMember, newMember) => {});
        this.client.on("guildUnavailable", guild => {});
        this.client.on("guildUpdate", (oldGuild, newGuild) => {});
        this.client.on("message", message => {});
        this.client.on("messageDelete", message => {});
        this.client.on("messageDeleteBulk", messages => {});
        this.client.on("messageReactionAdd", messageReaction => {});
        this.client.on("messageReactionRemove", user => {});
        this.client.on("messageReactionRemoveAll", message => {});
        this.client.on("messageUpdate", (oldMessage, newMessage) => {});
        this.client.on("presenceUpdate", (oldMember, newMember) => {});
        this.client.on("ready", () => {});
        this.client.on("reconnecting", () => {});
        this.client.on("resume", replayed => {});
        this.client.on("roleCreate", role => {});
        this.client.on("roleDelete", role => {});
        this.client.on("roleUpdate", (oldRole, newRole) => {});
        this.client.on("typingStart", (channel, user) => {});
        this.client.on("typingStop", (channel, user) => {});
        this.client.on("userNoteUpdate", (user, oldNote, newNote) => {});
        this.client.on("userUpdate", (oldUser, newUser) => {});
        this.client.on("voiceStateUpdate", (oldMember, newMember) => {});
        this.client.on("warn", info => {}); 
    }
    _handleEvent(event) {
        if (this.paused === true) {
            break;
        }

        
    }
    _loadGuild(guildId) {

        return this.db.getGuildByDiscordId(guildId);
    }
    _loadScripts(guild) {

        return this.db.getScriptsByObjectIds(guild.scripts);
    }
    start() {

        if (this.client === null || this.client === undefined) {
            this.client = new discord.Client();
        }

        this.client.login(this.token).then(() => {
            console.log(`${id}: bot started`);
        }).catch(err => {
            console.error(err);
        });
    }
    stop() {

        this.client.destroy().then(() => {
            this.client = null;
            console.log(`${id}: bot stopped`);
        }).catch(err => {
            console.error(err);
        });
    }
    pause() {

        this.paused = true;
        console.log(`${id}: bot paused`);
    }
    resume() {

        this.paused = false;
        console.log(`${id}: bot resumed`);
    }
}

module.exports = Bot;
