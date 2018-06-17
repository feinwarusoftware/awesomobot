"use strict";

const discord = require("discord.js");

const { DatabaseLogger } = require("./database");

const LOG_TYPE = {

    ERROR: "awesomoError",

    CHANNEL_CREATE: "channelCreate",
    CHANNEL_DELETE: "channelDelete",
    CHANNEL_PINS_UPDATE: "channelPinsUpdate",
    CHANNEL_UPDATE: "channelUpdate",
    CLIENT_USER_GUILD_SETTINGS_UPDATE: "clientUserGuildSettingsUpdate",
    EMOJI_CREATE: "emojiCreate",
    EMOJI_DELETE: "emojiDelete",
    EMOJI_UPDATE: "emojiUpdate",
    GUILD_BAN_ADD: "guildBanAdd",
    GUILD_BAN_REMOVE: "guildBanRemove",
    GUILD_CREATE: "guildCreate",
    GUILD_DELETE: "guildDelete",
    GUILD_MEMBER_ADD: "guildMemberAdd",
    GUILD_MEMBER_AVAILABLE: "guildMemberAvailable",
    GUILD_MEMBER_REMOVE: "guildMemberRemove",
    GUILD_MEMBERS_CHUNK: "guildMembersChunk",
    GUILD_MEMBER_SPEAKING: "guildMemberSpeaking",
    GUILD_MEMBER_UPDATE: "guildMemberUpdate",
    GUILD_UNAVAILABLE: "guildUnavailable",
    GUILD_UPDATE: "guildUpdate",
    MESSAGE_DELETE: "messageDelete",
    MESSAGE_DELETE_BULK: "messageDeleteBulk",
    MESSAGE_REACTION_ADD: "messageReactionAdd",
    MESSAGE_REACTION_REMOVE: "messageReactionRemove",
    MESSAGE_REACTION_REMOVE_ALL: "messageReactionRemoveAll",
    MESSAGE_UPDATE: "messageUpdate",
    PRESENCE_UPDATE: "presenceUpdate",
    ROLE_CREATE: "roleCreate",
    ROLE_DELETE: "roleDelete",
    ROLE_UPDATE: "roleUpdate",
    TYPING_START: "typingStart",
    TYPING_STOP: "typingStop",
    VOICE_STATE_UPDATE: "voiceStateUpdate"
};

class DiscordLogger extends DatabaseLogger {
    constructor(db, client) {
        super(db);

        this.client = client;
    }
    log(guildDoc, type, args) {

        let message;
        let discordGuild;

        switch(type) {
            case LOG_TYPE.ERROR:
                discordGuild = args[0];
                message = args[1];
                break;
            case LOG_TYPE.CHANNEL_CREATE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.CHANNEL_DELETE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.CHANNEL_PINS_UPDATE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.CHANNEL_UPDATE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.CLIENT_USER_GUILD_SETTINGS_UPDATE:
                discordGuild = args[0];
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.EMOJI_CREATE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.EMOJI_DELETE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.EMOJI_UPDATE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.GUILD_BAN_ADD:
                discordGuild = args[0];
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.GUILD_BAN_REMOVE:
                discordGuild = args[0];
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.GUILD_CREATE:
                discordGuild = args[0];
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.GUILD_DELETE:
                discordGuild = args[0];
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.GUILD_MEMBER_ADD:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.GUILD_MEMBER_AVAILABLE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.GUILD_MEMBER_REMOVE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.GUILD_MEMBERS_CHUNK:
                discordGuild = args[1];
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.GUILD_MEMBER_SPEAKING:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.GUILD_MEMBER_UPDATE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.GUILD_UNAVAILABLE:
                discordGuild = args[0];
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.GUILD_UPDATE:
                discordGuild = args[0];
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.MESSAGE_DELETE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.MESSAGE_DELETE_BULK:
                discordGuild = args[0].array()[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.MESSAGE_REACTION_ADD:
                discordGuild = args[0].message.guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.MESSAGE_REACTION_REMOVE:
                discordGuild = args[0].message.guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.MESSAGE_REACTION_REMOVE_ALL:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.MESSAGE_UPDATE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.PRESENCE_UPDATE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.ROLE_CREATE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.ROLE_DELETE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.ROLE_UPDATE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.TYPING_START:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.TYPING_STOP:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            case LOG_TYPE.VOICE_STATE_UPDATE:
                discordGuild = args[0].guild;
                message = `*(placeholder)*`;
                break;
            default:
                discordGuild = null;
                message = `unknown log type: ${type}`;
                break;
        }

        this.db.addGuildLog(guildDoc._id, message, type).catch(err => {
            super.error(message);
        });

        if (guildDoc.logEvents.indexOf(type) === -1) {
            return;
        }

        const embed = new discord.RichEmbed();
        embed.setTitle(`Logs - ${type}`);
        embed.setDescription(message);
        embed.setFooter(`Logged with <3 by AWESOM-O`);

        if (discordGuild === null || discordGuild === undefined) {
            if (type !== LOG_TYPE.ERROR) {

                this.error(discordGuild, guildDoc, "unknown log type");
            }
            return;
        }

        let discordChannel;
        if (type === LOG_TYPE.ERROR) {

            discordChannel = discordGuild.channels.get(guildDoc.errorChannelId);
        } else {

            discordChannel = discordGuild.channels.get(guildDoc.logChannelId);
        }

        if (discordChannel === null || discordChannel === undefined) {

            if (type !== LOG_TYPE.ERROR) {

                this.error(discordGuild, guildDoc, "log/error channel(s) not found");
            }
            return;
        }

        discordChannel.send(embed);
    }
    error(guildDoc, discordGuild, message) {

        this.log(guildDoc, LOG_TYPE.ERROR, [ discordGuild, message ]);
    }
}

module.exports = {

    LOG_TYPE,
    DiscordLogger
};
