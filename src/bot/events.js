"use strict"

const discord = require("discord.js");

const client = new discord.Client();

// Emitted whenever a channel is created.
client.on("channelCreate", channel => {

});

// Emitted whenever a channel is deleted.
client.on("channelDelete", channel => {

});

// Emitted whenever the pins of a channel are updated. Due to the nature of the WebSocket event,
// not much information can be provided easily here - you need to manually check the pins yourself.
client.on("channelPinsUpdate", (channel, time) => {

});

// Emitted whenever a channel is updated - e.g. name change, topic change.
client.on("channelUpdate", (oldChannel, newChannel) => {

});

// Emitted whenever the client user's settings update.
client.on("clientUserGuildSettingsUpdate", clientUserGuildSettings => {

});

// Emitted when the client user's settings update.
client.on("clientUserSettingsUpdate", clientUserSettings => {

});

// Emitted for general debugging information.
client.on("debug", info => {

});

// Emitted when the client's WebSocket disconnects and will no longer attempt to reconnect.
client.on("disconnect", event => {

});

// Emitted whenever a custom emoji is created in a guild.
client.on("emojiCreate", emoji => {

});

// Emitted whenever a custom guild emoji is deleted.
client.on("emojiDelete", emoji => {

});

// Emitted whenever a custom guild emoji is updated.
client.on("emojiUpdate", (oldEmoji, newEmoji) => {

});

// Emitted whenever the client's WebSocket encounters a connection error.
client.on("error", error => {

});

// Emitted whenever a member is banned from a guild.
client.on("guildBanAdd", (guild, user) => {

});

// Emitted whenever a member is unbanned from a guild.
client.on("guildBanRemove", (guild, user) => {

});

// Emitted whenever the client joins a guild.
client.on("guildCreate", guild => {

});

// Emitted whenever a guild is deleted/left.
client.on("guildDelete", guild => {

});

// Emitted whenever a user joins a guild.
client.on("guildMemberAdd", member => {

});

// Emitted whenever a member becomes available in a large guild.
client.on("guildMemberAvailable", member => {

});

// Emitted whenever a member leaves a guild, or is kicked.
client.on("guildMemberRemove", member => {

});

// Emitted whenever a chunk of guild members is received (all members come from the same guild).
client.on("guildMembersChunk", (members, guild) => {

});

// Emitted once a guild member starts/stops speaking.
client.on("guildMemberSpeaking", (member, speaking) => {

});

// Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
client.on("guildMemberUpdate", (oldMember, newMember) => {

});

// Emitted whenever a guild becomes unavailable, likely due to a server outage.
client.on("guildUnavailable", guild => {

});

// Emitted whenever a guild is updated - e.g. name change.
client.on("guildUpdate", (oldGuild, newGuild) => {

});

// Emitted whenever a message is created.
client.on("message", message => {

});

// Emitted whenever a message is deleted.
client.on("messageDelete", message => {

});

// Emitted whenever messages are deleted in bulk.
client.on("messageDeleteBulk", messages => {

});

// Emitted whenever a reaction is added to a message.
client.on("messageReactionAdd", (messageReaction, user) => {

});

// Emitted whenever a reaction is removed from a message.
client.on("messageReactionRemove", (messageReaction, user) => {

});

// Emitted whenever all reactions are removed from a message.
client.on("messageReactionRemoveAll", message => {

});

// Emitted whenever a message is updated - e.g. embed or content change.
client.on("messageUpdate", (oldMessage, newMessage) => {

});

// Emitted whenever a guild member's presence changes, or they change one of their details.
client.on("presenceUpdate", (oldMember, newMember) => {

});

// Emitted when the client becomes ready to start working.
client.on("ready", () => {

});

// Emitted whenever the client tries to reconnect to the WebSocket.
client.on("reconnecting", () => {

});

// Emitted whenever a WebSocket resumes.
client.on("resume", replayed => {

});

// Emitted whenever a role is created.
client.on("roleCreate", role => {

});

// Emitted whenever a guild role is deleted.
client.on("roleDelete", role => {

});

// Emitted whenever a guild role is updated.
client.on("roleUpdate", (oldRole, newRole) => {

});

// Emitted whenever a user starts typing in a channel.
client.on("typingStart", (channel, user) => {

});

// Emitted whenever a user stops typing in a channel.
client.on("typingStop", (channel, user) => {

});

// Emitted whenever a note is updated.
client.on("userNoteUpdate", (user, oldNote, newNote) => {

});

// Emitted whenever a user's details (e.g. username) are changed.
client.on("userUpdate", (oldUser, newUser) => {

});

// Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
client.on("voiceStateUpdate", (oldMember, newMember) => {

});

// Emitted for general warnings.
client.on("warn", info => {

});

module.exports = client;