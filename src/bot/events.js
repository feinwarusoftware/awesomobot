"use strict"

const discord = require("discord.js");
const timers = require("timers");
const jimp = require("jimp");
const randomstring = require("randomstring");

const embeds = require("./embeds");
const spnav = require("./spnav");

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

let eplist = [];

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

let polls = [];
const emoji = {
    1: "1⃣",
    2: "2⃣",
    3: "3⃣",
    4: "4⃣",
    5: "5⃣",
    6: "6⃣",
    7: "7⃣",
    8: "8⃣",
    9: "9⃣",
};

var globPerms = new PermissionGroup(glob);
var localPerms = new PermissionGroup(local);

const permJson = (localPerms.inherit(globPerms)).get();

const commands = [
    {
        trigger: "test",
        type: "command",
        perms: permJson,
        exec: function(message) {
            console.log(servers[0]);
            message.reply("m: " + servers[0].members.length + ", s: " + servers[0].stats.length);
        } 
    },
    {
        trigger: "shitme",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const member = servers[0].members.find(e => { return e.id == message.author.id });
            if (!member) {
                message.reply("0");
                return;
            }
            const stat = member.stats.find(e => { return e.name == "shits" });
            if (!stat) {
                message.reply("0");
                return;
            }
            message.reply(stat.value);
        } 
    },
    {
        trigger: "shitval",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const args = message.content.split(" ");
            if (!args[1]) {
                message.reply("0");
                return;
            }
            let member = servers[0].members.find(e => { return e.id == args[1] });
            if (!member) {
                member = servers[0].members.find(e => { return e.name == args[1] });
                if (!member) {
                    message.reply("0");
                    return;
                }
            }
            const stat = member.stats.find(e => { return e.name == "shits" });
            if (!stat) {
                message.reply("0");
                return;
            }
            message.reply(stat.value);
        }
    },
    {
        trigger: "shitlist",
        type: "command",
        perms: permJson,
        exec: function(message) {

            let rem = 0;

            servers[0].members.sort((a, b) => {
                const sa = a.stats.find(e => { return e.name == "shits" });
                const sb = b.stats.find(e => { return e.name == "shits" });

                if (!sa || !sb) {
                    return Math.min();
                }

                return sb.value - sa.value;
            });

            let embed = new discord.RichEmbed();
            embed.setColor(0x8bc34a);
            embed.setAuthor("AWESOM-O // It Hits the Fan", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");

            for (let i = 0; i < (servers[0].members.length > 5 ? 5 : servers[0].members.length); i++) {
                const stat = servers[0].members[i].stats.find(e => { return e.name == "shits" });
                if (stat) {
                    embed.addField("#" + (i + 1), servers[0].members[i].name + ": " + stat.value, true);
                }
            }

            message.channel.send(embed);
        }
    },
    {
        trigger: "activeme",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const member = servers[0].members.find(e => { return e.id == message.author.id });
            if (!member) {
                message.reply("0");
                return;
            }
            const stat = member.stats.find(e => { return e.name == "activity" });
            if (!stat) {
                message.reply("0");
                return;
            }
            message.reply(stat.value);
        } 
    },
    {
        trigger: "activeval",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const args = message.content.split(" ");
            if (!args[1]) {
                message.reply("0");
                return;
            }
            let member = servers[0].members.find(e => { return e.id == args[1] });
            if (!member) {
                member = servers[0].members.find(e => { return e.name == args[1] });
                if (!member) {
                    message.reply("0");
                    return;
                }
            }
            const stat = member.stats.find(e => { return e.name == "activity" });
            if (!stat) {
                message.reply("0");
                return;
            }
            message.reply(stat.value);
        } 
    },
    {
        trigger: "activelist",
        type: "command",
        perms: permJson,
        exec: function(message) {
            servers[0].members.sort((a, b) => {
                const sa = a.stats.find(e => { return e.name == "activity" });
                const sb = b.stats.find(e => { return e.name == "activity" });

                return sb.value - sa.value;
            });

            let embed = new discord.RichEmbed();
            embed.setColor(0x8bc34a);
            embed.setAuthor("AWESOM-O // Activity", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");

            for (let i = 0; i < (servers[0].members.length > 5 ? 5 : servers[0].members.length); i++) {
                const stat = servers[0].members[i].stats.find(e => { return e.name == "activity" });
                if (!stat) {
                    embed.addField("#" + (i + 1), servers[0].members[i].name + ": 0", true);
                } else {
                    embed.addField("#" + (i + 1), servers[0].members[i].name + ": " + stat.value, true);
                }
            }

            message.channel.send(embed);
        } 
    },
    {
        trigger: "w",
        type: "command",
        perms: permJson,
        exec: function(message) {

            const args = message.content.split(" ");
            if (!args[1]) {
                message.reply("query undef");
                return;
            }

            let query = "";
            for (var i = 1; i < args.length; i++) {
                if (args[i].startsWith("-")) { continue; }
                query += (args[i] + " ");
            }
            query = query.trim();
            
            spnav.getPageInfo(query, (title, url, desc, thumbnail) => {

                let embed = new discord.RichEmbed();
                embed.setColor(0x8bc34a);
                embed.setAuthor("AWESOM-O // " + title, "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");
                embed.setURL(url);
                embed.setThumbnail(thumbnail);
                embed.setDescription(desc);
            
                message.channel.send(embed);
            });
        } 
    },
    {
        trigger: "random",
        type: "command",
        perms: permJson,
        exec: function(message) {
            
            const query = eplist[Math.floor(Math.random()*eplist.length)];
            
            spnav.getPageInfo(query, (title, url, desc, thumbnail) => {

                let embed = new discord.RichEmbed();
                embed.setColor(0x8bc34a);
                embed.setAuthor("AWESOM-O // " + title, "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");
                embed.setURL(url);
                embed.setThumbnail(thumbnail);
                embed.setDescription(desc);
            
                message.channel.send(embed);
            });
        } 
    },
    {
        trigger: "avatar",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const random = Math.floor(Math.random() * Math.floor(5));
            if (random == 0){
                message.reply("https://www.youtube.com/watch?v=jVhlJNJopOQ");
                return;
            }
            const avatarUrl = message.author.avatarURL;
            message.reply(avatarUrl.substring(0, avatarUrl.length - 4) + "512");
        } 
    },
    {
        trigger: "sub",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const random = Math.floor(Math.random() * Math.floor(5));
            if (random == 0){
                message.reply("", { file: "https://i.redd.it/dq0owwdrbp4z.png" });
                return;
            }
            message.reply("https://reddit.com/r/southpark/");
        } 
    },
    {
        trigger: "micro",
        type: "command",
        perms: permJson,
        exec: function(message) {
            message.delete()
            message.channel.send("", { file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png" });
        } 
    },
    {
        trigger: "microaggression",
        type: "command",
        perms: permJson,
        exec: function(message) {
            message.delete()
            message.channel.send("", { file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png" });
        } 
    },
    {
        trigger: "reminder",
        type: "command",
        perms: permJson,
        exec: function(message) {
            message.channel.send("", { file: "https://cdn.discordapp.com/attachments/378287210711220224/378648515959586816/Towelie_Logo2.png" });
        } 
    },
    {
        trigger: "welcome",
        type: "command",
        perms: permJson,
        exec: function(message) {
            message.channel.send("", { file: "https://cdn.discordapp.com/attachments/371762864790306820/378305844959248385/Welcome.png" });
        } 
    },
    {
        trigger: "f",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const random = Math.floor(Math.random() * Math.floor(3));
            if (random == 0){
                message.reply("", { file: "https://cdn.discordapp.com/attachments/379432139856412682/401477891998613504/unknown.png" });
                return;
            }
            message.reply("Repects have been paid");
        } 
    },
    {
        trigger: "times",
        type: "command",
        perms: permJson,
        exec: function(message) {
            message.channel.send(embeds.times());
        } 
    },
    {
        trigger: "batman",
        type: "command",
        perms: permJson,
        exec: function(message) {
            message.channel.send("", { file: "https://cdn.discordapp.com/attachments/379432139856412682/401498015719882752/batman.png" });
        } 
    },
    {
        trigger: "member",
        type: "startswith",
        perms: permJson,
        exec: function(message) {
            const membermessages = ["I member!", "Ohh yeah I member!", "Me member!", "Ohh boy I member that", "I member!, do you member?"];
            const random = membermessages[Math.floor(Math.random()*membermessages.length)];
            message.reply(random);
        } 
    },
    {
        trigger: "i broke the dam",
        type: "startswith",
        perms: permJson,
        exec: function(message) {
            message.reply("No, I broke the dam");
        } 
    },
    

    //2.0 Commands
    {
        trigger: "movieidea",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const movieideas = [
            "Movie Idea #01: Adam Sandler... is like in love with some girl.. but then it turns out that the girl is actually a golden retriever or something..", 
            "Movie Idea #02: Adam Sandler... inherits like a billion dollars.. but first he needs to become a boxer or something",
            "Movie Idea #03: Adam Sandler... is forced to write in javascript... and something",
            "Movie Idea #04: Adam Sandler is kidnapped and made to copy bootstrap code",
            "Movie Idea #05: Adam Sandler... is actually some guy with some sword that lights up and stuff",
            "Movie Idea #06: Adam Sandler... is a robot sent from the future to kill another robot",
            "Movie Idea #07: Adam Sandler... has like a katana sword.. and eh needs to kill some guy named Bill",
            "Movie Idea #08: Adam Sandler is forced to train under this chinese guy... thats actually japanese and stuff",
            "Movie Idea #09: AWESOM-O is forced to clean up rubbish and then like goes into space and stuff",
            "Movie Idea #10: Adam Sandler argues with this red light robot on some.. eh spaceship",
            "Movie Idea #11: Adam Sandler... is a toy.. and completes a story",
            "Movie Idea #12: Adam Sandler... like robs a bank and has a white face... and some scars and something",
            "Movie Idea #13: Adam Sandler is a like a guy like in the second world war and stuff",
            "Movie Idea #14: Adam Sandler is in a car... only problem is that he can't go below 50MPH or he'll die",
            "Movie Idea #15: Adam Sandler is scottish and wears a kilt and stuff",
            "Movie Idea #16: Adam Sandler has a dream.. but he thinks it real life and stuff",
            "Movie Idea #17: Adam Sandler is actually a carrot and stuff",
            "Movie Idea #18: Adam Sandler takes too many drugs.. and has to dodge bullets and stuff",
            "Movie Idea #19: Adam Sandler.. has to put a tell the sheep to shut up.. and stuff...",
            "Movie Idea #20: Adam Sandler... is a lion... and he ehh has to become a king and stuff",
            "Movie Idea #21: Adam Sandler has to stick his through a door.. but then like freezes and stuff",
            "Movie Idea #22: Adam Sandler... has to wear pyjamas and do work.. but then he is asked to have a shower and stuff...",
            "Movie Idea #23: Adam Sandler has to drive some car into the future... and like has an adventure and something...",
            "Movie Idea #24: Adam Sandler... is an old person... and he doesn't like his life so he eh... attaches balloons to his house and flys and away and stuff..",
            "Movie Idea #25: Adam Sandler... is accused of hitting this girl.. but eh he did naht hit her.. its not true.. its bullshit.. oh hi mark...",
            "Movie Idea #26: Adam Sandler... doesn't like farts.. so he like tries to kill some canadians.. and saddam hussein comes back and stuff...",
            "Movie Idea #27: Adam Sandler.. is like the captain on this ehh...space..ship.. and ehh he yells khan a lot...",
            "Movie Idea #28: Adam Sandler... has to play drums in this eh.. jazz band but he doesnt know if he is rushing or dragging...",
            "Movie Idea #29: Adam Sandler.. is hungry.. so he plays some games... to get his food stamps...",
            "Movie Idea #30: Adam Sandler.. is this dictator who fancies some girl who works in like some wholefoods place.. so he decides to not be a dictator and stuff..",
            "Movie Idea #31: Adam Sandler and his friend makes a TV show called Adam's World but is not allowed to play stairway in the guitar shop... and stuff...",
            "Movie Idea #34.249.184.154: Adam Sandler... has to make money through patreon to fund the servers....  https://www.patreon.com/awesomo ..not selling out at all...",
            "Movie Idea #69: Adam Sandler is the new kid in a small town in.. eh.. Colorado.. and he has to deal with these 8-year olds and stuff...",
            "Movie Idea #2305: Adam Sandler is trapped on an island... and falls in love with a ehh coconut",
            ];
            const random = movieideas[Math.floor(Math.random()*movieideas.length)];
            message.reply(random);
        } 
    },
    {
        trigger: "helpline",
        type: "command",
        perms: permJson,
        exec: function(message) {
            message.channel.send("https://www.reddit.com/r/suicideprevention/comments/6hjba7/info_suicide_prevention_hotlines/");
        } 
    },
    {
        trigger: "oof",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const random = Math.floor(Math.random() * Math.floor(5));
            if (random == 0){
                message.reply("https://www.youtube.com/watch?v=KWHrGQpIWP4");
                return;
            }
            message.reply("https://www.youtube.com/watch?v=f49ELvryhao");
        } 
    },
    {
        trigger: "info",
        type: "command",
        perms: permJson,
        exec: function(message) {
            message.channel.send(embeds.info());
        } 
    },
    {
        trigger: "help",
        type: "command",
        perms: permJson,
        exec: function(message) {
            message.channel.send(embeds.help());
        } 
    },
    {
        trigger: "harvest",
        type: "command",
        perms: permJson,
        exec: function(message) {
            message.channel.send(embeds.harvest());
        } 
    },
    {
        trigger: "ground",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const role = message.guild.roles.find(e => { return e.name == "Grounded"; });
            if (!role) {
                message.reply("role err");
                return;
            }
            const args = message.content.split(" ");
            if (!args[1]) {
                message.reply("arg err");
                return;
            }
            let member = message.guild.members.find(e => { return e.user.id == args[1]; });
            if (!member) {
                member = message.guild.members.find(e => { return e.user.username == args[1]; });
                if (!member) {
                    message.reply("member err");
                    return;
                }
            }
            member.addRole(role);
            message.reply("Grounded " + member.user.username);
        } 
    },
    {
        trigger: "unground",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const role = message.guild.roles.find(e => { return e.name == "Grounded"; });
            if (!role) {
                message.reply("role err");
                return;
            }
            const args = message.content.split(" ");
            if (!args[1]) {
                message.reply("arg err");
                return;
            }
            let member = message.guild.members.find(e => { return e.user.id == args[1]; });
            if (!member) {
                member = message.guild.members.find(e => { return e.user.username == args[1]; });
                if (!member) {
                    message.reply("member err");
                    return;
                }
            }
            member.removeRole(role);
            message.reply("Ungrounded " + member.user.username);
        } 
    },
    {
        trigger: "join",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const args = message.content.split(" ");
            if (!args[1]) {
                message.reply("arg err");
                return;
            }

            let cf = message.guild.roles.find(e => { return e.name == "Coon & Friends"; });
            let fp = message.guild.roles.find(e => { return e.name == "Freedom Pals"; });
            let cm = message.guild.roles.find(e => { return e.name == "Chaos Minions"; });
            if (!cf || !fp || !cm) {
                message.reply("role err");
                return;
            }

            let mcf = message.member.roles.find(e => { return e.name == "Coon & Friends"; });
            let mfp = message.member.roles.find(e => { return e.name == "Freedom Pals"; });
            let mcm = message.member.roles.find(e => { return e.name == "Chaos Minions"; });

            let role;
            let name;
            switch(args[1]) {
                case "cf":
                    if (mcf) {
                        message.reply("duplicate err");
                        return;
                    }
                    role = cf;
                    break;
                case "fp":
                    if (mfp) {
                        message.reply("duplicate err");
                        return;
                    }
                    role = fp;
                    break;
                case "cm":
                    if (mcm) {
                        message.reply("duplicate err");
                        return;
                    }
                    role = cm;
                    break;
            }

            if (mcf) {
                message.member.removeRole(cf);
            }
            if (mfp) {
                message.member.removeRole(fp);
            }
            if (mcm) {
                message.member.removeRole(cm);
            }

            message.member.addRole(role);
            message.reply(message.member.nickname + " joined " + role.name);
        }
    },
    {
        trigger: "civilwar",
        type: "command",
        perms: permJson,
        exec: function(message) {
            let mcf = message.member.roles.find(e => { return e.name == "Coon & Friends"; });
            let mfp = message.member.roles.find(e => { return e.name == "Freedom Pals"; });
            let mcm = message.member.roles.find(e => { return e.name == "Chaos Minions"; });
            if (mcf) {
                message.member.removeRole(mcf);
            }
            if (mfp) {
                message.member.removeRole(mfp);
            }
            if (mcm) {
                message.member.removeRole(mcm);
            }

            message.reply(message.member.nickname + " is no longer part of a group");
        }
    },
    // legacy role commands.
    {
        trigger: prefix + "add",
        type: "startswith",
        perms: permJson,
        exec: function(message) {
            const args = message.content.split("add");
            if (!args[1]) {
                message.reply("arg err");
                return;
            }

            let cf = message.guild.roles.find(e => { return e.name == "Coon & Friends"; });
            let fp = message.guild.roles.find(e => { return e.name == "Freedom Pals"; });
            let cm = message.guild.roles.find(e => { return e.name == "Chaos Minions"; });
            if (!cf || !fp || !cm) {
                message.reply("role err");
                return;
            }

            let mcf = message.member.roles.find(e => { return e.name == "Coon & Friends"; });
            let mfp = message.member.roles.find(e => { return e.name == "Freedom Pals"; });
            let mcm = message.member.roles.find(e => { return e.name == "Chaos Minions"; });

            let role;
            let name;
            switch(args[1]) {
                case "cf":
                    if (mcf) {
                        message.reply("duplicate err");
                        return;
                    }
                    role = cf;
                    break;
                case "fp":
                    if (mfp) {
                        message.reply("duplicate err");
                        return;
                    }
                    role = fp;
                    break;
                case "cm":
                    if (mcm) {
                        message.reply("duplicate err");
                        return;
                    }
                    role = cm;
                    break;
            }

            if (mcf) {
                message.member.removeRole(cf);
            }
            if (mfp) {
                message.member.removeRole(fp);
            }
            if (mcm) {
                message.member.removeRole(cm);
            }

            message.member.addRole(role);
            message.reply(message.member.nickname + " joined " + role.name);
        }
    },



    //Mod Abuse
    {
        trigger: "fuckyourself",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const embed = new discord.RichEmbed()
            .setImage("http://1.images.southparkstudios.com/blogs/southparkstudios.com/files/2014/09/1801_5a.gif");
        message.channel.send(embed);
        } 
    },
    {
        trigger: "fuckyou",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const embed = new discord.RichEmbed()
                .setImage("https://cdn.vox-cdn.com/thumbor/J0D6YqKKwCqNY2zaej_MEUlT-oo=/3x0:1265x710/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/39977666/fuckyou.0.0.jpg");
            message.channel.send(embed);
        } 
    },
    {
        trigger: "dick",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const embed = new discord.RichEmbed()
                .setImage("https://actualconversationswithmyhusband.files.wordpress.com/2017/01/stop-being-a-dick-scott.gif");
            message.channel.send(embed);
        } 
    },
    {
        trigger: "poll",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const args = message.content.split(" ");
            if (!args[1]) {
                return;
            }
            //-poll [This is question 1, This is question 2]
            //-poll [This is question 1 :heart:, This is question 2 :bell:] 01:00:00

            let qs = "";
            let pn = "";
            let bs = false, jbe = false, be = false, tt = false;
            for (let i = 1; i < args.length; i++) {
                if (args[i].indexOf("[") != -1) {
                    bs = true;
                }
                if (jbe) {
                    be = true;
                }
                if (args[i].indexOf("]") != -1) {
                    jbe = true;
                }

                if (bs && !be && pn != "") {
                    tt = true;
                }

                if (bs && !be) {
                    qs += args[i] + " ";
                }
                if (!tt && !bs) {
                    pn += args[i] + " ";
                }
                if (!tt && be) {
                    pn += args[i] + " ";
                }
            }
            qs = qs.trim();
            pn = pn.trim();

            let q = [];
            let s, e = 1;
            while(true) {
                s = qs.indexOf(",", e);
                if (s == -1) {
                    s = qs.indexOf("]", e);
                    if (s == -1) {
                        break;;
                    }
                }
                q.push(qs.substring(s, e).trim());
                e = s + 1;
            }

            const embed = new discord.RichEmbed();
            embed.setColor(0x8bc34a);
            embed.setAuthor("AWESOM-O // " + pn + " (30 mins)", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");

            for (let i = 0; i < q.length; i++) {
                embed.addField("Vote " + (i + 1), q[i]);
            }

            message.channel.send(embed).then(message => {

                polls.push({
                    id: message.id,
                    message: message,
                    q: q
                });

                const moreEmoji = function(limit, current) {
                    if (current == limit) {
                        return;
                    }
                    message.react(emoji[current + 1]).then(message => {
                        moreEmoji(limit, current + 1);
                    });
                }
                
                moreEmoji(q.length, 0);

                const timeout = 1800000;
                timers.setTimeout(() => {

                    if (!polls.find(e => {
                        return e.id == message.id;
                    })) {

                        let res = [];
                        for (let i = 0; i < q.length; i++) {
                            const react = message.reactions.get(emoji[i + 1]);
                            if (!react) {
                                res.push(0);
                                continue;
                            }
                            res.push(react.count - 1);
                        }
                        
                        const resEmbed = new discord.RichEmbed();
                        resEmbed.setColor(0x8bc34a);
                        resEmbed.setAuthor("AWESOM-O // Poll results!", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");
                        
                        for (let i = 0; i < q.length; i++) {
                            resEmbed.addField(q[i], res[i] + " votes");
                        }
    
                        message.channel.send(resEmbed);

                        for (let  i = 0; i < polls.length; i++) {
                            if (polls[i].id == message.id) {
                                polls.splice(i, 1);
                                break;
                            }
                        }
                    }

                    for (let  i = 0; i < polls.length; i++) {
                        if (polls[i].id == message.id) {
                            polls.splice(i, 1);
                            break;
                        }
                    }
            
                }, timeout);
            });
        }
    },
    {
        trigger: "endpoll",
        type: "command",
        perms: permJson,
        exec: function(message) {
            const args = message.content.split(" ");
            if (!args[1]) {
                return;
            }

            const poll = polls.find(e => {
                return e.id == args[1];
            });
            if (!poll) {
                return;
            }

            let res = [];
            for (let i = 0; i < poll.q.length; i++) {
                const react = poll.message.reactions.get(emoji[i + 1]);
                if (!react) {
                    res.push(0);
                    continue;
                }
                res.push(react.count - 1);
            }
            
            const resEmbed = new discord.RichEmbed();
            resEmbed.setColor(0x8bc34a);
            resEmbed.setAuthor("AWESOM-O // Poll results!", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");
            
            for (let i = 0; i < poll.q.length; i++) {
                resEmbed.addField(poll.q[i], res[i] + " votes");
            }

            message.channel.send(resEmbed);
        }
    },
    {
        trigger: "wink",
        type: "command",
        perms: permJson,
        exec: function(message) {
            message.reply("**wonk**");
        }
    },

    // Jimp.
    {
        trigger: "nk",
        type: "command",
        perms: permJson,
        exec: function(message) {

            const args = message.content.split(" ");
    
            var target = "";
            for (var i = 1; i < args.length; i++) {
                target += args[i] + " ";
            }
            target = target.trim();
    
            var targetMember = message.guild.members.find(e => {
                return e.user.username == target;
            });
    
            if (!targetMember) {
    
                targetMember = message.guild.members.find(e => {
                    return e.user.id == target;
                });
    
                if (!targetMember) {
                    message.reply("User not found!");
                    return;
                }
            }

            Promise.all([jimp.read("https://cdn.discordapp.com/avatars/" + targetMember.user.id + "/" + targetMember.user.avatar + ".png?size=128"), jimp.read("./src/bot/assets/label.png")]).then(values => {
                
                const avatar = values[0];
                const tLabel = values[1];
            
                avatar.mask(jMask, 0, 0);
                tLabel.print(jFont, 0, 10, targetMember.user.username);

                avatar.rotate(-5);
                tLabel.rotate(-5);

                jBase.composite(avatar, 635, 260);
                jBase.composite(tLabel, 775, 260);

                jBase.write("./temp.png", () => {
                    message.channel.send({ file: "./temp.png" });
                });

            }).catch(err => {

                message.reply("Error loading images!");
            });
        }
    }
];

class Command {
    constructor(json) {
        this.json = json;
    }
    _verify(message, prefix) {

        const base = this.json;

        switch(base.type) {
            case "command":
                return message.content.split(" ")[0].toLowerCase() == (prefix + base.trigger.toLowerCase());
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

let cmds = [];
for (let i = 0; i < commands.length; i++) {
    cmds.push(new Command(commands[i]));
}

// Emitted whenever a message is created.
client.on("message", message => {

    if (message.author.equals(client.user)) { return; }

    for (let i = 0; i < cmds.length; i++) {
        cmds[i].exec(message, prefix);
    }

    const ourServerId = "371762864790306817";

    // TEMP?
    if (message.content.startsWith("<<debug")) {
        console.log(servers);
    }

    // activity
    let exists = false;

    for (let i = 0; i < servers[0].members.length; i++) {

        if (servers[0].members[i].id == message.author.id) {

            let found = false;

            for (let j = 0; j < servers[0].members[i].stats.length; j++) {

                if (servers[0].members[i].stats[j].name == "activity") {

                    servers[0].members[i].stats[j].value += message.content.length > 20 ? (message.content.length > 100 ? 8 : 6) : 2;
                    servers[0].members[i].stats[j].lastmsg = 0;
                    found = true;

                    break;
                }

            }

            if (!found) {

                servers[0].members[i].stats.push({
                    name: "activity",
                    value: message.content.length > 20 ? (message.content.length > 100 ? 8 : 6) : 2,
                    lastmsg: 0
                });

            }

            exists = true;

            break;
        }

    }

    if (!exists) {

        servers[0].members.push({
            id: message.author.id,
            name: message.author.username,
            stats: [
                {
                    name: "activity",
                    value: message.content.length > 20 ? (message.content.length > 100 ? 8 : 6) : 2,
                    lastmsg: 0
                }
            ]
        });

    }

    /*
    let exists = false;
    for (let i = 0; i < servers[0].members.length; i++) {
        let found = false;
        if (servers[0].members[i].id == message.author.id) {
            for (let j = 0; j < servers[0].members[i].stats.length; j++) {
                if (servers[0].members[i].stats[j].name == "activity") {
                    servers[0].members[i].stats[j].value += message.content.length > 20 ? (message.content.length > 100 ? 8 : 6) : 2;
                    servers[0].members[i].stats[j].lastmsg = 0;
                    found = true;
                }
            }
            exists = true;
        }
        if (!found) {
            servers[0].members[i].stats.push({
                name: "activity",
                value: message.content.length > 20 ? (message.content.length > 100 ? 8 : 6) : 2,
                lastmsg: 0
            });
        }
    }
    if (!exists) {
        servers[0].members.push({
            id: message.author.id,
            name: message.author.username,
            stats: [
                {
                    name: "activity",
                    value: message.content.length > 20 ? (message.content.length > 100 ? 8 : 6) : 2,
                    lastmsg: 0
                }
            ]
        });
    }
    */

    if (message.content.indexOf("shit") != -1) {
        for (let i = 0; i < servers[0].members.length; i++) {

            if (servers[0].members[i].id == message.author.id) {

                let found = false;

                for (let j = 0; j < servers[0].members[i].stats.length; j++) {

                    if (servers[0].members[i].stats[j].name == "shits") {

                        servers[0].members[i].stats[j].value += 1;
                        found = true;

                        break;
                    }

                }

                if (!found) {

                    servers[0].members[i].stats.push({
                        name: "shits",
                        value: 1
                    });

                }

                break;
            }
        }
    }

    /*
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
    */
});

// Emitted whenever a message is deleted.
client.on("messageDelete", message => {
    try {

        const channel = message.guild.channels.find(e => { return e.name == "logs" });
        channel.send(embeds.deletion(message));

    } catch(e) {

        console.log("Error logging message deletion");
    }
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

// Jimp shit.
let jBase, jMask, jFont;

// Emitted when the client becomes ready to start working.
client.on("ready", () => {

    // get ep list.
    spnav.getEpList((list) => {
        eplist = list;
        console.log("DEBUG >> Loaded [" + list.length + "] episodes.");
    });

    // Load jimp images.
    Promise.all([jimp.read("./src/bot/assets/base.png"), jimp.read("./src/bot/assets/mask.png"), jimp.loadFont("./src/bot/assets/helvetica-light.fnt")]).then(values => {
        jBase = values[0];
        jMask = values[1];
        jFont = values[2];

        console.log("DEBUG >> Loaded [" + "3" + "] assets.");
    }).catch(err => {

        console.log("ERROR >> Failed to load assets.");
    });

    // Get server from db.
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
            console.log("DEBUG >> Fetched [" + "1" + "] servers.");
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
