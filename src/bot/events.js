"use strict"

const discord = require("discord.js");
const timers = require("timers");

const Server = require("../common/models/server");

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

// TEMP?
const servers = [];

// TEMP
const prefix = "<<";

const glob = {
    server: true,
    channels: [],
    roles: [],
    members: [],
    stats: []
};

const local = {
    server: true,
    channels: [],
    roles: [],
    members: [],
    stats: []
}

class PermissionGroup {
    constructor(json) {
        this.json = json;
    }
    inherit(other) {
        
        const inherit = other.get();
        const base = this.json;

        const server = (inherit.server && base.server) || base.server;

        var found;

        // Channels.
        if (!base.channels) {
            base.channels = [];
        }
        var channels = base.channels.slice();

        found = false;
        for (var i = 0; i < (inherit.channels ? inherit.channels.length : 0); i++) {
            for (var j = 0; j < (base.channels ? base.channels.length : 0); j++) {
                if (inherit.channels[i].id == base.channels[j].id) {
                    channels[j].allow = (inherit.channels[i].allow && base.channels[j].allow) || base.channels[j].allow,
                    found = true;
                }
            }
            if (!found) {
                channels.push(inherit.channels[i]);
            }
        }

        // Roles.
        if (!base.roles) {
            base.roles = [];
        }
        var roles = base.roles.slice();

        found = false;
        for (var i = 0; i < (inherit.roles ? inherit.roles.length : 0); i++) {
            for (var j = 0; j < (base.roles ? base.roles.length : 0); j++) {
                if (inherit.roles[i].id == base.roles[j].id) {
                    roles[j].allow = (inherit.roles[i].allow && base.roles[j].allow) || base.roles[j].allow,
                    found = true;
                }
            }
            if (!found) {
                roles.push(inherit.roles[i]);
            }
        }

        // Members.
        if (!base.members) {
            base.members = [];
        }
        var members = base.members.slice();

        found = false;
        for (var i = 0; i < (inherit.members ? inherit.members.length : 0); i++) {
            for (var j = 0; j < (base.members ? base.members.length : 0); j++) {
                if (inherit.members[i].id == base.members[j].id) {
                    members[j].allow = (inherit.members[i].allow && base.members[j].allow) || base.members[j].allow,
                    found = true;
                }
            }
            if (!found) {
                members.push(inherit.members[i]);
            }
        }

        // TODO: (improve) Stats.
        /*
        if (!base.stats) {
            base.stats = [];
        }
        var stats = base.stats.slice();

        found = false;
        for (var i = 0; i < (inherit.stats ? inherit.stats.length : 0); i++) {
            for (var j = 0; j < (base.stats ? base.stats.length : 0); j++) {
                if ((inherit.stats[i].name == base.stats[j].name) && (inherit.stats[i].operator == base.stats[j].operator)) {
                    stats[j].value = base.stats[j].value;
                    found = true;
                }
            }
            if (!found) {
                stats.push(inherit.stats[i]);
            }
        }
        */
        //

        return new PermissionGroup({
            server: server,
            channels: channels,
            roles: roles,
            members: members,
            //stats: stats
        });
    }
    get() {
        return this.json;
    }
}

var globPerms = new PermissionGroup(glob);
var localPerms = new PermissionGroup(local);

const permJson = (localPerms.inherit(globPerms)).get();

const command = {
    trigger: "test",
    type: "command",
    perms: permJson,
    exec: function(message) {
        message.reply("m: " + servers[0].members.length + ", s: " + servers[0].stats.length);
    }
};

class Command {
    constructor(json) {
        this.json = json;
    }
    _verify(message, prefix) {

        const base = this.json;

        switch(base.type) {
            case "command":
                return message.content.toLowerCase().startsWith(prefix + base.trigger.toLowerCase());
                break;
            case "startswith":
                return message.content.toLowerCase().startsWith(base.trigger.toLowerCase());
                break;
            case "contains":
                return message.content.toLowerCase().indexOf(base.trigger.toLowerCase()) != -1;
                break;
            case "exactmatch":
                return message.content == base.trigger;
                break;
            case "regex":
                const regex = new RegExp(base.value, base.flags);
                return regex.test(message.content);
                break;
        }

        return false;
    }
    _check(message /*members from db*/) {

        const base = this.json;
        const perms = base.perms;

        let server = true, channel = true, roles = true, member = true, stats = true;

        // Server.
        server = perms.server;

        // Channel.
        for (let i = 0; i < perms.channels.length; i++) {
            if (perms.channels[i].id == "*") {
                channel = perms.channels[i].allow;
            }
        }
        for (let i = 0; i < perms.channels.length; i++) {
            if (perms.channels[i].id == message.channel.id) {
                channel = perms.channels[i].allow;
            }
        }

        // Roles.
        for (let i = 0; i < perms.roles.length; i++) {
            if (perms.roles[i].id == "*") {
                roles = perms.roles[i].allow;
            }
        }
        for (let i = 0; i < perms.roles.length; i++) {
            if (message.member.roles.get(perms.roles[i].id)) {
                if (!perms.roles[i].allow) {
                    roles = false;
                    break;
                }
                roles = true;
            }
        }

        // Member.
        for (let i = 0; i < perms.members.length; i++) {
            if (perms.members[i].id == "*") {
                member = perms.members[i].allow;
            }
        }
        for (let i = 0; i < perms.members.length; i++) {
            if (perms.members[i].id == message.member.id) {
                member = perms.members[i].allow;
            }
        }

        // TODO: Stats.
        /*

        */
        //

        // DEBUG
        //console.log("server >> " + server);
        //console.log("channel >> " + channel);
        //console.log("roles >> " + roles);
        //console.log("member >> " + member);
        //console.log("channel >> " + channel);

        return (server && channel && roles && member);
    }
    exec(message, prefix/*, members*/) {

        if (!this._verify(message, prefix)) {
            return;
        }

        if (!this._check(message/*, perms, members*/)) {
            return;
        }

        const base = this.json;
        base.exec(message);
    }
    get() {
        return this.json;
    }
}

const cmd = new Command(command);

// Emitted whenever a message is created.
client.on("message", message => {

    if (message.author.equals(client.user)) { return; }

    cmd.exec(message, prefix);

    const ourServerId = "371762864790306817";

    // TEMP?
    if (message.content.startsWith("<<debug")) {
        console.log(servers);
    }

    // activity
    for (let i = 0; i < servers[0].members.length; i++) {
        if (servers[0].members[i].id == message.author.id) {
            let found = false;
            for (let j = 0; j < servers[0].members[i].stats.length; j++) {
                if (servers[0].members[i].stats[j].name == "activity") {
                    servers[0].members[i].stats[j].value += message.content.length > 20 ? (message.content.length > 100 ? 8 : 6) : 2;
                    servers[0].members[i].stats[j].lastmsg = 0;
                    found = true;
                }
            }
            if (!found) {
                servers[0].members[i].stats.push({
                    name: "activity",
                    value: message.content.length > 20 ? (message.content.length > 100 ? 8 : 6) : 2,
                    lastmsg: 0
                });
            }
        }
    }

    // shits
    if (message.content.indexOf("shit") != -1) {

        // Find /r/southpark server.
        const server = servers.find(e => {
            return e._id == ourServerId;
        });
        if (server == undefined) {
            console.log("1 >> THE BOT IS BROKEN, WERE ALL FUCKED!");
            return;
        }

        // Find current member.
        if (server.members == undefined) {
            server.members = [];
        }
        const member = server.members.find(e => {
            return e.id == message.author.id;
        });
        if (member == undefined) {
            server.members.push({
                id: message.author.id,
                name: message.author.username,
                stats: [
                    {
                        name: "shits",
                        value: 1
                    }
                ]
            });
            return;
        }

        // Find 'shits' stat.
        if (member.stats == undefined) {
            member.stats = [];
        }
        const stat = member.stats.find(e => {
            return e.name == "shits";
        });
        if (stat == undefined) {
            member.stats.push({
                name: "shits",
                value: 1
            });
            return;
        }

        stat.value += 1;

        for (var i = 0; i < member.stats.length; i++) {
            if (member.stats[i].name == "shits") {
                member.stats[i] = stat;
                break;
            }
        }

        for (var i = 0; i < server.members.length; i++) {
            if (server.members[i].id == message.author.id) {
                server.members[i] = member;
                break;
            }
        }
    }
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

    console.log("DEBUG >> ready!");

    const ourServerId = "371762864790306817";
    Server.findById(ourServerId, (err, server) => {
        if (err) {
            console.log("1 >> THE DB IS BROKEN, WERE ALL FUCKED!");
            return;
        }

        var found = false;
        for (var i = 0; i < servers.length; i++) {
            if (servers[i]._id == server._id) {

                found = true;
                servers[i] = server;
            }
        }

        if (!found) {
            servers.push(server);
        }
    });

    const interval = 300000;
    timers.setInterval(() => {

        // activity
        for (let i = 0; i < servers[0].members.length; i++) {
            for (let j = 0; j < servers[0].members[i].stats.length; j++) {
                if (servers[0].members[i].stats[j].name == "activity") {
                    servers[0].members[i].stats[j].lastmsg += 1;
                    if (servers[0].members[i].stats[j].lastmsg >= 576) {
                        servers[0].members[i].stats[j].value -= (Math.log10(servers[0].members[i].stats[j].lastmsg - 575) * 70) / 288;
                    }
                    if (servers[0].members[i].stats[j].value < 0) {
                        servers[0].members[i].stats[j].value = 0;
                    }
                }
            }
        }

        Server.findById(ourServerId, (err, server) => {
            if (err) {
                console.log("2 >> THE DB IS BROKEN, WERE ALL FUCKED!");
                return;
            }

            let found = false;
            for (var i = 0; i < servers.length; i++) {
                if (servers[i]._id == server._id) {
    
                    found = true;

                    // Convert old json storage and save in db.
                    /*
                    const members = [];
                    for (var j = 0; j < temp.list.length; j++) {
                        members.push({
                            id: temp.list[j].id,
                            name: temp.list[j].name,
                            stats: [
                                {
                                    name: "shits",
                                    value: temp.list[j].shits
                                },
                                {
                                    name: "activity",
                                    value: temp.list[j].activity
                                }
                            ]
                        });
                    }
                    */

                    server.members = servers[i].members;
                    server.stats = servers[i].stats;
                }
            }
    
            if (!found) {
                console.log("3 >> THE DB IS BROKEN, WERE ALL FUCKED!");
            }

            server.save(err => {
                if (err) {
                    console.log("4 >> THE DB IS BROKEN, WERE ALL FUCKED!");
                }
            });
        });

    }, interval);
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