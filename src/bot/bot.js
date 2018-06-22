"use strict";

const fs = require("fs");
const path = require("path");

const discord = require("discord.js");
const mongoose = require("mongoose");

const sandbox = require("./sandbox");
const Logger = require("../logger");

const botLogger = new Logger();

// init db
// init logger
// init sandbox
// load local commands
// run commands preloading
// make sure theyre in db



const client = new discord.Client();
client.on("channelCreate", channel => {

});
client.on("channelDelete", channel => {

});
client.on("channelPinsUpdate", (channel, time) => {

});
client.on("channelUpdate", (oldChannel, newChannel) => {

});
client.on("clientUserGuildSettingsUpdate", clientUserGuildSettings => {

});
client.on("clientUserSettingsUpdate", clientUserSettings => {
    //client
});
client.on("debug", info => {
    //client
});
client.on("disconnect", event => {
    //client
});
client.on("emojiCreate", emoji => {

});
client.on("emojiDelete", emoji => {

});
client.on("emojiUpdate", (oldEmoji, newEmoji) => {

});
client.on("error", error => {
    //client
});
client.on("guildBanAdd", (guild, user) => {

});
client.on("guildBanRemove", (guild, user) => {

});
client.on("guildCreate", guild => {

});
client.on("guildDelete", guild => {

});
client.on("guildMemberAdd", member => {

});
client.on("guildMemberAvailable", member => {

});
client.on("guildMemberRemove", member => {

});
client.on("guildMembersChunk", (members, guild) => {

});
client.on("guildMemberSpeaking", (member, speaking) => {

});
client.on("guildMemberUpdate", (oldMember, newMember) => {

});
client.on("guildUnavailable", guild => {

});
client.on("guildUpdate", (oldGuild, newGuild) => {

});
client.on("message", message => {
    //special

    // load guild
    // load scripts
    // run command checks
    // run perms checks
    // fetch code (local vs db)
    // run code appropriately
});
client.on("messageDelete", message => {

});
client.on("messageDeleteBulk", messages => {

});
client.on("messageReactionAdd", (messageReaction, user) => {

});
client.on("messageReactionRemove", (messageReaction, user) => {

});
client.on("messageReactionRemoveAll", message => {

});
client.on("messageUpdate", (oldMessage, newMessage) => {

});
client.on("presenceUpdate", (oldMember, newMember) => {

});
client.on("ready", () => {
    //client
});
client.on("reconnecting", () => {
    //client
});
client.on("resume", replayed => {
    //client
});
client.on("roleCreate", role => {

});
client.on("roleDelete", role => {

});
client.on("roleUpdate", (oldRole, newRole) => {

});
client.on("typingStart", (channel, user) => {

});
client.on("typingStop", (channel, user) => {

});
client.on("userNoteUpdate", (user, oldNote, newNote) => {
    //client
});
client.on("userUpdate", (oldUser, newUser) => {
    //client
});
client.on("voiceStateUpdate", (oldMember, newMember) => {

});
client.on("warn", info => {
    //client
});

client.login("token");
