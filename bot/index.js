"use strict";

const discord = require("discord.js");
const db = require("../db");
const sandbox = require("./sandbox");

const EVENTS = {
    CHANNEL_CREATE: 0,
    CHANNEL_DELETE: 1,
    CHANNEL_PINS_UPDATE: 2,
    CHANNEL_UPDATE: 3,
    CLIENT_USER_GUILD_SETTINGS_UPDATE: 4,
    CLIENT_USER_SETTINGS_UPDATE: 5,
    DEBUG: 6,
    DISCONNECT: 7,
    EMOJI_CREATE: 8,
    EMOJI_DELETE: 9,
    EMOJI_UPDATE: 10,
    ERROR: 11,
    GUILD_BAN_ADD: 12,
    GUILD_BAN_REMOVE: 13,
    GUILD_CREATE: 14,
    GUILD_DELETE: 15,
    GUILD_MEMBER_ADD: 16,
    GUILD_MEMBER_AVAILABLE: 17,
    GUILD_MEMBER_REMOVE: 18,
    GUILD_MEMBER_CHUNK: 19,
    GUILD_MEMBER_SPEAKING: 20,
    GUILD_MEMBER_UPDATE: 21,
    GUILD_UNAVAILABLE: 22,
    GUILD_UPDATE: 23,
    MESSAGE: 24,
    MESSAGE_DELETE: 25,
    MESSAGE_DELETE_BULK: 26,
    MESSAGE_REACTION_ADD: 27,
    MESSAGE_REACTION_REMOVE: 28,
    MESSAGE_REACTION_REMOVE_ALL: 29,
    MESSAGE_UPDATE: 30,
    PRESENCE_UPDATE: 31,
    READY: 32,
    RECONNECTING: 33,
    RESUME: 34,
    ROLE_CREATE: 35,
    ROLE_DELETE: 36,
    ROLE_UPDATE: 37,
    TYPING_START: 38,
    TYPING_STOP: 39,
    USER_NOTE_UPDATE: 40,
    USER_UPDATE: 41,
    VOICE_STATE_UPDATE: 42,
    WARN: 43
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
        this.paused = false;
        this.client = new discord.Client();
        this.db = new db.Database(`bot:${id}-db`, `mongodb://localhost/bot-${id}`);
        this.sandbox = new sandbox.Sandbox(`bot:${id}-sb`);
        
        this.client.on("channelCreate", channel => {
            this._handleEvent(EVENTS.CHANNEL_CREATE, channel.guild.id, arguments);
        });
        this.client.on("channelDelete", channel => {
            this._handleEvent(EVENTS.CHANNEL_DELETE, channel.guild.id, arguments);
        });
        this.client.on("channelPinsUpdate", (channel, time) => {
            this._handleEvent(EVENTS.CHANNEL_PINS_UPDATE, channel.guild.id, arguments);
        });
        this.client.on("channelUpdate", (oldChannel, newChannel) => {
            this._handleEvent(EVENTS.CHANNEL_UPDATE, oldChannel.guild.id, arguments);
        });
        this.client.on("clientUserGuildSettingsUpdate", clientUserGuildSettings => {
            this._handleEvent(EVENTS.CLIENT_USER_GUILD_SETTINGS_UPDATE, clientUserGuildSettings.guildID, arguments);
        });
        this.client.on("clientUserSettingsUpdate", clientUserSettings => {
            this._handleEvent(EVENTS.CLIENT_USER_SETTINGS_UPDATE, null, arguments);
        });
        this.client.on("debug", info => {
            this._handleEvent(EVENTS.DEBUG, null, null);
        });
        this.client.on("disconnect", event => {
            this._handleEvent(EVENTS.DISCONNECT, null, arguments);
        });
        this.client.on("emojiCreate", emoji => {
            this._handleEvent(EVENTS.EMOJI_CREATE, emoji.guild.id, arguments);
        });
        this.client.on("emojiDelete", emoji => {
            this._handleEvent(EVENTS.EMOJI_DELETE, emoji.guild.id, arguments);
        });
        this.client.on("emojiUpdate", (oldEmoji, newEmoji) => {
            this._handleEvent(EVENTS.EMOJI_UPDATE, oldEmoji.guild.id, arguments);
        });
        this.client.on("error", error => {
            this._handleEvent(EVENTS.ERROR, null, arguments);
        });
        this.client.on("guildBanAdd", (guild, user) => {
            this._handleEvent(EVENTS.GUILD_BAN_ADD, guild.id, arguments);
        });
        this.client.on("guildBanRemove", (guild, user) => {
            this._handleEvent(EVENTS.GUILD_BAN_REMOVE, guild.id, arguments);
        });
        this.client.on("guildCreate", guild => {
            this._handleEvent(EVENTS.GUILD_CREATE, guild.id, arguments);
        });
        this.client.on("guildDelete", guild => {
            this._handleEvent(EVENTS.GUILD_DELETE, guild.id, arguments);
        });
        this.client.on("guildMemberAdd", member => {
            this._handleEvent(EVENTS.GUILD_MEMBER_ADD, member.guild.id, arguments);
        });
        this.client.on("guildMemberAvailable", member => {
            this._handleEvent(EVENTS.GUILD_MEMBER_AVAILABLE, member.guild.id, arguments);
        });
        this.client.on("guildMemberRemove", member => {
            this._handleEvent(EVENTS.GUILD_MEMBER_REMOVE, member.guild.id, arguments);
        });
        this.client.on("guildMembersChunk", (members, guild) => {
            this._handleEvent(EVENTS.GUILD_MEMBER_CHUNK, guild.id, arguments);
        });
        this.client.on("guildMemberSpeaking", (member, speaking) => {
            this._handleEvent(EVENTS.GUILD_MEMBER_SPEAKING, member.guild.id, arguments);
        });
        this.client.on("guildMemberUpdate", (oldMember, newMember) => {
            this._handleEvent(EVENTS.GUILD_MEMBER_UPDATE, oldMember.guild.id, arguments);
        });
        this.client.on("guildUnavailable", guild => {
            this._handleEvent(EVENTS.GUILD_UNAVAILABLE, guild.id, arguments);
        });
        this.client.on("guildUpdate", (oldGuild, newGuild) => {
            this._handleEvent(EVENTS.GUILD_UPDATE, oldGuild.id, arguments);
        });
        this.client.on("message", message => {
            this._handleEvent(EVENTS.MESSAGE, message.guild.id, arguments);
        });
        this.client.on("messageDelete", message => {
            this._handleEvent(EVENTS.MESSAGE_DELETE, message.guild.id, arguments);
        });
        this.client.on("messageDeleteBulk", messages => {
            this._handleEvent(EVENTS.MESSAGE_DELETE_BULK, messages[0].guild.id, arguments);
        });
        this.client.on("messageReactionAdd", (messageReaction, user) => {
            this._handleEvent(EVENTS.MESSAGE_REACTION_ADD, messageReaction.message.guild.id, arguments);
        });
        this.client.on("messageReactionRemove", (messageReaction, user) => {
            this._handleEvent(EVENTS.MESSAGE_REACTION_REMOVE, messageReaction.message.guild.id, arguments);
        });
        this.client.on("messageReactionRemoveAll", message => {
            this._handleEvent(EVENTS.MESSAGE_REACTION_REMOVE_ALL, message.guild.id, arguments);
        });
        this.client.on("messageUpdate", (oldMessage, newMessage) => {
            this._handleEvent(EVENTS.MESSAGE_UPDATE, oldMessage.guild.id, arguments);
        });
        this.client.on("presenceUpdate", (oldMember, newMember) => {
            this._handleEvent(EVENTS.PRESENCE_UPDATE, oldMember.guild.id, arguments);
        });
        this.client.on("ready", () => {
            this._handleEvent(EVENTS.READY, null, arguments);
        });
        this.client.on("reconnecting", () => {
            this._handleEvent(EVENTS.RECONNECTING, null, arguments);
        });
        this.client.on("resume", replayed => {
            this._handleEvent(EVENTS.RESUME, null, arguments);
        });
        this.client.on("roleCreate", role => {
            this._handleEvent(EVENTS.ROLE_CREATE, role.guild.id, arguments);
        });
        this.client.on("roleDelete", role => {
            this._handleEvent(EVENTS.ROLE_DELETE, role.guild.id, arguments);
        });
        this.client.on("roleUpdate", (oldRole, newRole) => {
            this._handleEvent(EVENTS.ROLE_UPDATE, oldRole.guild.id, arguments);
        });
        this.client.on("typingStart", (channel, user) => {
            this._handleEvent(EVENTS.TYPING_START, channel.guild.id, arguments);
        });
        this.client.on("typingStop", (channel, user) => {
            this._handleEvent(EVENTS.TYPING_STOP, channel.guild.id, arguments);
        });
        this.client.on("userNoteUpdate", (user, oldNote, newNote) => {
            this._handleEvent(EVENTS.USER_NOTE_UPDATE, null,arguments);
        });
        this.client.on("userUpdate", (oldUser, newUser) => {
            this._handleEvent(EVENTS.USER_UPDATE, null, arguments);
        });
        this.client.on("voiceStateUpdate", (oldMember, newMember) => {
            this._handleEvent(EVENTS.VOICE_STATE_UPDATE, oldMember.guild.id, arguments);
        });
        this.client.on("warn", info => {
            this._handleEvent(EVENTS.WARN, null, arguments);
        }); 
    }
    async _handleEvent(event, guildId, args) {
        if (guildId === null) {
            return;
        }

        console.log(`bot:${this.id} event: ${event}`);
        if (this.paused === true) {
            return;
        }

        const guild = await this._loadGuild(guildId);
        if (guild === null) {
            console.error("guild not found");
            return;
        }

        const scripts = await this._loadScripts(guild);
        if (scripts === null) {
            console.error("scripts not found");
            return;
        }

        let eventScripts = [];
        for (let i = 0; i < scripts.length; i++) {
            if (scripts.event === event) {
                eventScripts.push(scripts[i]);
            }
        }

        for (let i = 0; i < eventScripts.length; i++) {
            this.sandbox.exec(eventScripts[i].code);
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
            console.log(`${this.id}: bot started`);
        }).catch(err => {
            console.error(err);
        });
    }
    stop() {

        this.client.destroy().then(() => {
            this.client = null;
            console.log(`${this.id}: bot stopped`);
        }).catch(err => {
            console.error(err);
        });
    }
    pause() {

        this.paused = true;
        console.log(`${this.id}: bot paused`);
    }
    resume() {

        this.paused = false;
        console.log(`${this.id}: bot resumed`);
    }
}

module.exports = {
 
    Bot,

    EVENTS,
    PERMS
};
