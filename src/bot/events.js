"use strict"

const discord = require("discord.js");
const timers = require("timers");
const jimp = require("jimp");
const randomstring = require("randomstring");

const embeds = require("./embeds");
const spnav = require("./spnav");

const Server = require("../common/models/server");

const client = new discord.Client();

// TEMP?
const servers = [];

let eplist = [];

// TEMP
const prefix = "-";

//
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
};
//

const pGlob = {
    server: true
};

const pNk = {
    server: true,
    roles: [{
            id: "*",
            allow: false
        },
        {
            id: "375413987338223616",
            allow: true
        }
    ]
}

const pMod = {
    server: true,
    roles: [{
            id: "*",
            allow: false
        },
        {
            id: "372409853894983690",
            allow: true
        }
    ]
};

const pDev = {
    server: true,
    roles: [{
            id: "*",
            allow: false
        },
        {
            id: "378287077806309386",
            allow: true
        }
    ]
};

const pSpamOnly = {
    server: true,
    channels: [
        {
            id: "*",
            allow: false
        },
        {
            id: "375414794536222720",
            allow: true
        },
        {
            id: "378287210711220224",
            allow: true
        },
        {
            id: "389161755575713792",
            allow: true
        }
    ]
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

        for (var i = 0; i < (inherit.channels ? inherit.channels.length : 0); i++) {
            found = false;
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

        for (var i = 0; i < (inherit.roles ? inherit.roles.length : 0); i++) {
            found = false;
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

        for (var i = 0; i < (inherit.members ? inherit.members.length : 0); i++) {
            found = false;
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

//
var globPerms = new PermissionGroup(glob);
var localPerms = new PermissionGroup(local);

const permJson = (localPerms.inherit(globPerms)).get();
//

const pGlobPerms = new PermissionGroup(pGlob);
const pNkPerms = new PermissionGroup(pNk);
const pModPerms = new PermissionGroup(pMod);
const pDevPerms = new PermissionGroup(pDev);

const pGlobJson = pGlobPerms.get();
const pNkJson = pNkPerms.inherit(pGlobPerms).inherit(pModPerms).inherit(pDevPerms).get();
const pModJson = pModPerms.inherit(pGlobPerms).inherit(pDevPerms).get();
const pDevJson = pDevPerms.inherit(pGlobPerms).get();

const commands = [{
        trigger: "test",
        type: "command",
        perms: pDevJson,
        exec: function (message) {
            console.log(servers[0]);
            message.reply("m: " + servers[0].members.length + ", s: " + servers[0].stats.length);
        }
    },
    {
        trigger: "shitme",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            const member = servers[0].members.find(e => {
                return e.id == message.author.id
            });
            if (!member) {
                message.reply("0");
                return;
            }
            const stat = member.stats.find(e => {
                return e.name == "shits"
            });
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
        perms: pModJson,
        exec: function (message) {
            const args = message.content.split(" ");
            if (!args[1]) {
                message.reply("0");
                return;
            }
            let member = servers[0].members.find(e => {
                return e.id == args[1]
            });
            if (!member) {
                member = servers[0].members.find(e => {
                    return e.name == args[1]
                });
                if (!member) {
                    message.reply("0");
                    return;
                }
            }
            const stat = member.stats.find(e => {
                return e.name == "shits"
            });
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
        perms: pGlobJson,
        exec: function (message) {
            servers[0].members.sort((a, b) => {
                const sa = a.stats.find(e => {
                    return e.name == "shits"
                });
                const sb = b.stats.find(e => {
                    return e.name == "shits"
                });

                if (!sa && !sb) {
                    return 0;
                } else if (!sa) {
                    return sb.value - 0;
                } else if (!sb) {
                    return 0 - sa.value;
                } else {
                    return sb.value - sa.value;
                }
            });

            let embed = new discord.RichEmbed();
            embed.setColor(0x8bc34a);
            embed.setAuthor("AWESOM-O // It Hits the Fan", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");

            for (let i = 0; i < (servers[0].members.length > 5 ? 5 : servers[0].members.length); i++) {
                const stat = servers[0].members[i].stats.find(e => {
                    return e.name == "shits";
                });
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
        trigger: "activeme",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            const member = servers[0].members.find(e => {
                return e.id == message.author.id
            });
            if (!member) {
                message.reply("0");
                return;
            }
            const stat = member.stats.find(e => {
                return e.name == "activity"
            });
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
        perms: pModJson,
        exec: function (message) {
            const args = message.content.split(" ");
            if (!args[1]) {
                message.reply("0");
                return;
            }
            let member = servers[0].members.find(e => {
                return e.id == args[1]
            });
            if (!member) {
                member = servers[0].members.find(e => {
                    return e.name == args[1]
                });
                if (!member) {
                    message.reply("0");
                    return;
                }
            }
            const stat = member.stats.find(e => {
                return e.name == "activity"
            });
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
        perms: pGlobJson,
        exec: function (message) {
            servers[0].members.sort((a, b) => {
                const sa = a.stats.find(e => {
                    return e.name == "activity"
                });
                const sb = b.stats.find(e => {
                    return e.name == "activity"
                });

                return sb.value - sa.value;
            });

            let embed = new discord.RichEmbed();
            embed.setColor(0x8bc34a);
            embed.setAuthor("AWESOM-O // Activity", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");

            for (let i = 0; i < (servers[0].members.length > 5 ? 5 : servers[0].members.length); i++) {
                const stat = servers[0].members[i].stats.find(e => {
                    return e.name == "activity";
                });
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
        perms: pGlobJson,
        exec: function (message) {

            const args = message.content.split(" ");
            if (!args[1]) {
                message.reply("query undef");
                return;
            }

            let query = "";
            for (var i = 1; i < args.length; i++) {
                if (args[i].startsWith("-")) {
                    continue;
                }
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
        perms: pGlobJson,
        exec: function (message) {

            const query = eplist[Math.floor(Math.random() * eplist.length)];

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
        perms: pGlobJson,
        exec: function (message) {
            const random = Math.floor(Math.random() * Math.floor(5));
            if (random == 0) {
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
        perms: pGlobJson,
        exec: function (message) {
            const random = Math.floor(Math.random() * Math.floor(5));
            if (random == 0) {
                message.reply("", {
                    file: "https://i.redd.it/dq0owwdrbp4z.png"
                });
                return;
            }
            message.reply("https://reddit.com/r/southpark/");
        }
    },
    {
        trigger: "micro",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            message.delete();
            message.channel.send("", {
                file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
            });
        }
    },
    {
        trigger: "microaggression",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            message.delete();
            message.channel.send("", {
                file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
            });
        }
    },
    {
        trigger: "reminder",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            message.channel.send("", {
                file: "https://cdn.discordapp.com/attachments/378287210711220224/378648515959586816/Towelie_Logo2.png"
            });
        }
    },
    {
        trigger: "welcome",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            message.channel.send("", {
                file: "https://cdn.discordapp.com/attachments/371762864790306820/378305844959248385/Welcome.png"
            });
        }
    },
    {
        trigger: "f",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            const random = Math.floor(Math.random() * Math.floor(3));
            if (random == 0) {
                message.reply("", {
                    file: "https://cdn.discordapp.com/attachments/379432139856412682/401477891998613504/unknown.png"
                });
                return;
            }
            message.reply("Repects have been paid");
        }
    },
    {
        trigger: "times",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            message.channel.send(embeds.times());
        }
    },
    {
        trigger: "batman",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            message.channel.send("", {
                file: "https://cdn.discordapp.com/attachments/379432139856412682/401498015719882752/batman.png"
            });
        }
    },
    {
        trigger: "member",
        type: "startswith",
        perms: pGlobJson,
        exec: function (message) {
            const membermessages = ["I member!", "Ohh yeah I member!", "Me member!", "Ohh boy I member that", "I member!, do you member?"];
            const random = membermessages[Math.floor(Math.random() * membermessages.length)];
            message.reply(random);
        }
    },
    {
        trigger: "i broke the dam",
        type: "startswith",
        perms: pGlobJson,
        exec: function (message) {
            message.reply("No, I broke the dam");
        }
    },


    //2.0 Commands
    {
        trigger: "movieidea",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
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
                "Movie Idea #12: Adam Sandler... like robs a bank and has a some scars or something...",
                "Movie Idea #13: Adam Sandler is a like a guy like in the second world war and stuff",
                "Movie Idea #14: Adam Sandler is in a car... only problem is that he can't go below 50MPH or he'll die",
                "Movie Idea #15: Adam Sandler is scottish and wears a kilt and stuff",
                "Movie Idea #16: Adam Sandler has a dream.. but he thinks it real life and stuff",
                "Movie Idea #17: Adam Sandler is actually a carrot and stuff",
                "Movie Idea #18: Adam Sandler takes too many drugs.. and has to dodge bullets and stuff",
                "Movie Idea #19: Adam Sandler.. has to put a tell the sheep to shut up.. and stuff...",
                "Movie Idea #20: Adam Sandler... is a lion... and he ehh has to become a king and stuff",
                "Movie Idea #21: Adam Sandler has to stick an axe through a door.. but then like freezes and stuff",
                "Movie Idea #22: Adam Sandler... has to wear pyjamas and do work.. but then he is asked to have a shower and stuff...",
                "Movie Idea #23: Adam Sandler has to drive some car into the future... and like has an adventure and something...",
                "Movie Idea #24: Adam Sandler... is an old person... and he doesn't like his life so he eh... attaches balloons to his house and flys and away and stuff..",
                "Movie Idea #25: Adam Sandler... is accused of hitting this girl.. but he did naht hit her.. its not true.. its bullshit.. oh hi mark...",
                "Movie Idea #26: Adam Sandler... doesn't like fart jokes.. so he like tries to kill some canadians.. and saddam hussein comes back and stuff...",
                "Movie Idea #27: Adam Sandler.. is like the captain on this ehh...space..ship.. and ehh he yells khan a lot...",
                "Movie Idea #28: Adam Sandler... has to play drums in this eh.. jazz band but he doesnt know if he is rushing or dragging...",
                "Movie Idea #29: Adam Sandler.. is hungry.. so he plays some games... to get his food stamps...",
                "Movie Idea #30: Adam Sandler.. is this dictator who fancies some girl who works in like some wholefoods place.. so he decides to not be a dictator and stuff..",
                "Movie Idea #31: Adam Sandler and his friend makes a TV show called Adam's World but is not allowed to play stairway in the guitar shop... and stuff...",
                "Movie Idea #34.249.184.154: Adam Sandler... has to make money through patreon to fund the servers....  https://www.patreon.com/awesomo ..not selling out at all...",
                "Movie Idea #69: Adam Sandler is the new kid in a small town in.. eh.. Colorado.. and he has to deal with these 8-year olds and stuff...",
                "Movie Idea #2305: Adam Sandler is trapped on an island... and falls in love with a ehh coconut",
            ];
            const random = movieideas[Math.floor(Math.random() * movieideas.length)];
            message.reply(random);
        }
    },
    {
        trigger: "helpline",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            message.channel.send("https://www.reddit.com/r/suicideprevention/comments/6hjba7/info_suicide_prevention_hotlines/");
        }
    },
    {
        trigger: "info",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            message.channel.send(embeds.info());
        }
    },
    {
        trigger: "help",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            message.channel.send(embeds.help());
        }
    },
    {
        trigger: "harvest",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            message.channel.send(embeds.harvest());
        }
    },
    {
        trigger: "ground",
        type: "command",
        perms: pModJson,
        exec: function (message) {
            const role = message.guild.roles.find(e => {
                return e.name == "Grounded";
            });
            if (!role) {
                message.reply("role err");
                return;
            }
            const args = message.content.split(" ");
            if (!args[1]) {
                message.reply("arg err");
                return;
            }
            let member = message.guild.members.find(e => {
                return e.user.id == args[1];
            });
            if (!member) {
                member = message.guild.members.find(e => {
                    return e.user.username == args[1];
                });
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
        perms: pModJson,
        exec: function (message) {
            const role = message.guild.roles.find(e => {
                return e.name == "Grounded";
            });
            if (!role) {
                message.reply("role err");
                return;
            }
            const args = message.content.split(" ");
            if (!args[1]) {
                message.reply("arg err");
                return;
            }
            let member = message.guild.members.find(e => {
                return e.user.id == args[1];
            });
            if (!member) {
                member = message.guild.members.find(e => {
                    return e.user.username == args[1];
                });
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
        perms: pNkJson,
        exec: function (message) {
            const args = message.content.split(" ");
            if (!args[1]) {
                message.reply("arg err");
                return;
            }


            let cf = message.guild.roles.find(e => {
                return e.name == "Coon & Friends";
            });
            let fp = message.guild.roles.find(e => {
                return e.name == "Freedom Pals";
            });
            let cm = message.guild.roles.find(e => {
                return e.name == "Chaos Minions";
            });
            let gk = message.guild.roles.find(e => {
                return e.name == "Goth Kids";
            });

            if (!cf || !fp || !cm || !gk) {
                message.reply("role err");
                return;
            }

            let mcf = message.member.roles.find(e => {
                return e.name == "Coon & Friends";
            });
            let mfp = message.member.roles.find(e => {
                return e.name == "Freedom Pals";
            });
            let mcm = message.member.roles.find(e => {
                return e.name == "Chaos Minions";
            });
            let mgk = message.member.roles.find(e => {
                return e.name == "Goth Kids";
            });

            let role;
            let name;
            switch (args[1]) {
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
                case "gk":
                    if (mgk) {
                        message.reply("duplicate err");
                        return;
                    }
                    role = gk;
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
            if (mgk) {
                message.member.removeRole(gk);
            }

            message.member.addRole(role);

            message.reply(message.author.username + " joined " + role.name);


            if (role == gk) {
                message.author.send("So you wanna be an edgelord by giving yourself the 'Goth Kids' role?\nWe dont take kindly to types like you; unless you remove your role with '" + prefix + "civilwar', you'll be banned from the server in 60 seconds!\n\n - !Dragon1320 & Mattheous");
            }
        }
    },
    {
        trigger: "civilwar",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            let mcf = message.member.roles.find(e => {
                return e.name == "Coon & Friends";
            });
            let mfp = message.member.roles.find(e => {
                return e.name == "Freedom Pals";
            });
            let mcm = message.member.roles.find(e => {
                return e.name == "Chaos Minions";
            });
            let mgk = message.member.roles.find(e => {
                return e.name == "Goth Kids";
            });
                  
            if (mcf) {
                message.member.removeRole(mcf);
            }
            if (mfp) {
                message.member.removeRole(mfp);
            }
            if (mcm) {
                message.member.removeRole(mcm);
            }
            if (mgk) {
                message.member.removeRole(mgk);
            }

            message.reply(message.author.username + " is no longer part of a group");
        }
    },



    // legacy role commands.
    {
        trigger: prefix + "add",
        type: "startswith",
        perms: pNkJson,
        exec: function (message) {
            const args = message.content.split("add");
            if (!args[1]) {
                message.reply("arg err");
                return;
            }

            let cf = message.guild.roles.find(e => {
                return e.name == "Coon & Friends";
            });
            let fp = message.guild.roles.find(e => {
                return e.name == "Freedom Pals";
            });
            let cm = message.guild.roles.find(e => {
                return e.name == "Chaos Minions";
            });
            let gk = message.guild.roles.find(e => {
                return e.name == "Goth Kids";
            });
            if (!cf || !fp || !cm || !gk) {
                message.reply("role err");
                return;
            }

            let mcf = message.member.roles.find(e => {
                return e.name == "Coon & Friends";
            });
            let mfp = message.member.roles.find(e => {
                return e.name == "Freedom Pals";
            });
            let mcm = message.member.roles.find(e => {
                return e.name == "Chaos Minions";
            });
            let mgk = message.member.roles.find(e => {
                return e.name == "Goth Kids";
            });

            let role;
            let name;
            switch (args[1]) {
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
                case "gk":
                    if (mgk) {
                        message.reply("duplicate err");
                        return;
                    }
                    role = gk;
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
            if (mgk) {
                message.member.removeRole(gk);
            }

            message.member.addRole(role);
            message.reply(message.user.username + " joined " + role.name);
        }
    },

    //Mod Abuse
    {
        trigger: "fuckyourself",
        type: "command",
        perms: pModJson,
        exec: function (message) {
            const embed = new discord.RichEmbed()
                .setImage("http://1.images.southparkstudios.com/blogs/southparkstudios.com/files/2014/09/1801_5a.gif");
            message.channel.send(embed);
        }
    },
    {
        trigger: "fuckyou",
        type: "command",
        perms: pModJson,
        exec: function (message) {
            const embed = new discord.RichEmbed()
                .setImage("https://cdn.vox-cdn.com/thumbor/J0D6YqKKwCqNY2zaej_MEUlT-oo=/3x0:1265x710/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/39977666/fuckyou.0.0.jpg");
            message.channel.send(embed);
        }
    },
    {
        trigger: "dick",
        type: "command",
        perms: pModJson,
        exec: function (message) {
            const embed = new discord.RichEmbed()
                .setImage("https://actualconversationswithmyhusband.files.wordpress.com/2017/01/stop-being-a-dick-scott.gif");
            message.channel.send(embed);
        }
    },
    {
        trigger: "poll",
        type: "command",
        perms: pMod,
        exec: function (message) {
            const args = message.content.split(" ");
            if (!args[1]) {
                return;
            }
            //-poll [This is question 1, This is question 2]
            //-poll [This is question 1 :heart:, This is question 2 :bell:] 01:00:00

            let qs = "";
            let pn = "";
            let bs = false,
                jbe = false,
                be = false,
                tt = false;
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
            while (true) {
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
            embed.setAuthor("AWESOM-O // " + pn + " (15 mins)", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");
            embed.setThumbnail("http://www.clker.com/cliparts/A/q/4/W/q/L/bar-chart-md.png");

            for (let i = 0; i < q.length; i++) {
                embed.addField("Vote " + (i + 1), q[i]);
            }

            message.channel.send(embed).then(message => {

                polls.push({
                    id: message.id,
                    message: message,
                    q: q
                });

                const moreEmoji = function (limit, current) {
                    if (current == limit) {
                        return;
                    }
                    message.react(emoji[current + 1]).then(message => {
                        moreEmoji(limit, current + 1);
                    });
                }

                moreEmoji(q.length, 0);

                const timeout = 900000;
                timers.setTimeout(() => {

                    if (polls.find(e => {
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
                        embed.setThumbnail("http://www.clker.com/cliparts/A/q/4/W/q/L/bar-chart-md.png");

                        for (let i = 0; i < q.length; i++) {
                            resEmbed.addField(q[i], res[i] + " votes");
                        }

                        message.channel.send(resEmbed);
                    }

                    for (let i = 0; i < polls.length; i++) {
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
        perms: pModJson,
        exec: function (message) {
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
        perms: pGlobJson,
        exec: function (message) {
            message.reply("**wonk**");
        }
    },

    // Dev
    {
        trigger: "rid",
        type: "command",
        perms: pDevJson,
        exec: function (message) {
            const args = message.content.split(" ");
            if (!args[1]) {
                return;
            }

            let search = "";
            for (let i = 1; i < args.length; i++) {
                search += args[i] + " ";
            }
            search = search.trim();

            const role = message.guild.roles.find(e => {
                return e.name == search
            });
            if (!role) {
                return;
            }

            message.reply(role.id);
        }
    },
    {
        trigger: "coin",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            const flip = Math.floor(Math.random() * Math.floor(2));
            let res;
            if (flip == 0) {
                res = "heads";
            } else {
                res = "tails";
            }
            message.reply(res);
        }
    },
    {
        trigger: "dice",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {

            const random = Math.floor(Math.random() * Math.floor(10));
            if (random == 0) {
                message.reply("https://pbs.twimg.com/profile_images/650952807449653248/lQc14tHw.jpg");
                return;
            }

            const args = message.content.split(" ");
            if (!args[1]) {

                const roll = Math.floor(Math.random() * Math.floor(6));
                message.reply(roll + 1);
                return;
            }

            const roll = Math.floor(Math.random() * Math.floor(args[1]));
            message.reply(roll + 1);
        }
    },
    {
        trigger: "rps",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            const rps = Math.floor(Math.random() * Math.floor(3));
            let res;
            if (rps == 0) {
                res = "rock";
            } else if (rps == 1) {
                res = "paper";
            } else {
                res = "scissors";
            }
            message.reply(res);
        }
    },
    // Jimp.
    {
        trigger: "nk",
        type: "command",
        perms: pModJson,
        exec: function (message) {

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
                    message.channel.send({
                        file: "./temp.png"
                    });
                });

            }).catch(err => {

                message.reply("Error loading images!");
            });
        }
    },
    // Gifs incoming!
    {
        trigger: "gif",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            const map = ["vchip", "buttersgun", "buttersdance", "kennydance", "meeem", "cartmandance", "slap", "zimmerman", "nice", "triggered", "cartmansmile", "stanninja", "kylethinking", "ninjastar", "cartmaninvisible", "stanpuking", "kylegiant", "iketrumpet"];
            const gifs = {
                vchip: "https://cdn.discordapp.com/attachments/209040403918356481/403242859798462485/vchipgif.gif",
                buttersgun: "https://cdn.discordapp.com/attachments/209040403918356481/403242745436831745/buttersgunguf.gif",
                buttersdance: "https://cdn.discordapp.com/attachments/209040403918356481/403242738428149770/buttersdancegif.gif",
                kennydance: "https://cdn.discordapp.com/attachments/209040403918356481/403242745608798218/kennydancegif.gif",
                meeem: "https://cdn.discordapp.com/attachments/209040403918356481/403242745176522754/meeemgif.gif",
                cartmandance: "https://cdn.discordapp.com/attachments/209040403918356481/403242753695154205/cartmandagif.gif",
                slap: "https://cdn.discordapp.com/attachments/209040403918356481/403242745734365184/slapgif.gif",
                zimmerman: "https://cdn.discordapp.com/attachments/209040403918356481/403242825199779840/zimmermangif.gif",
                nice: "https://cdn.discordapp.com/attachments/209040403918356481/403242751375966208/nicegif.gif",
                triggered: "https://cdn.discordapp.com/attachments/209040403918356481/403242747076542484/triggeredgif.gif",
                cartmansmile: "https://cdn.discordapp.com/attachments/379432139856412682/403236890003767308/3e327295ae5518d4dd6076a99891f2631bc0ebdf_128.gif",
                stanninja: "https://cdn.discordapp.com/attachments/379432139856412682/403236890947485696/fbe592f6de0304252ed1e330c5eec60a5ff4b7ef_128.gif",
                kylethinking: "https://cdn.discordapp.com/attachments/379432139856412682/403236896026656769/dce7da75fa93d5a56eb5d6b4b670efd20ba26c2f_128.gif",
                ninjastar: "https://cdn.discordapp.com/attachments/209040403918356481/403242875229306881/ninjastargif.gif",
                cartmaninvisible: "https://cdn.discordapp.com/attachments/209040403918356481/403242747399634964/cartmaninvisiblegif.gif",
                stanpuking: "https://cdn.discordapp.com/attachments/209040403918356481/403242748897132547/stanpukinggif.gif",
                kylegiant: "https://cdn.discordapp.com/attachments/379432139856412682/404397468030205952/kylegiant.gif",
                iketrumpet: "https://cdn.discordapp.com/attachments/379432139856412682/404397432881938448/iketrumpets.gif"
            };

            const args = message.content.split(" ")

            if (!args[1] || !gifs[args[1]]) {
                let embed = new discord.RichEmbed().setImage(gifs[map[Math.floor(Math.random() * map.length)]]);
                message.channel.send(embed);
                return;
            }

            let embed = new discord.RichEmbed().setImage(gifs[args[1]]);
            message.channel.send(embed);
        }
    },
    {
        trigger: "back",
        type: "command",
        perms: pGlobJson,
        exec: function (message) {
            message.channel.send("<:imback:403307515645001748> <@" + message.author.id + ">" + " is baccccckkk!");
        }
    },

    // temp music
    {
        trigger: "pie",
        type: "command",
        perms: pSpamOnly,
        exec: function (message) {
            if (message.member.voiceChannel) {

                let conn = client.voiceConnections.find(e => {
                    return e.channel.id;
                }, message.member.voiceChannel.id);

                if (conn) {
                    conn.playFile("pie.mp3");
                } else {
                    message.member.voiceChannel.join().then(conn => {
                        conn.playFile("pie.mp3");
                    });
                }

            } else {
                message.reply("You need to be in a voice channel!");
            }
        }
    },
    {
        trigger: "oof",
        type: "command",
        perms: pSpamOnly,
        exec: function (message) {
            if (message.member.voiceChannel) {

                let conn = client.voiceConnections.find(e => {
                    return e.channel.id;
                }, message.member.voiceChannel.id);

                if (conn) {
                    conn.playFile("oof.mp3");
                } else {
                    message.member.voiceChannel.join().then(conn => {
                        conn.playFile("oof.mp3");
                    });
                }

            } else {
                const random = Math.floor(Math.random() * Math.floor(5));
                if (random == 0) {
                    message.reply("https://www.youtube.com/watch?v=KWHrGQpIWP4");
                    return;
                }
                message.reply("https://www.youtube.com/watch?v=f49ELvryhao");
            }
        }
    },
    {
        trigger: "hmmm",
        type: "command",
        perms: pSpamOnly,
        exec: function (message) {
            if (message.member.voiceChannel) {

                let conn = client.voiceConnections.find(e => {
                    return e.channel.id;
                }, message.member.voiceChannel.id);

                if (conn) {
                    conn.playFile("hmmm.mp3");
                } else {
                    message.member.voiceChannel.join().then(conn => {
                        conn.playFile("hmmm.mp3");
                    });
                }

            } else {
                const random = Math.floor(Math.random() * Math.floor(5));
                if (random == 0) {
                    message.reply("https://youtu.be/XF2ayWcJfxo?t=1m20s");
                    return;
                }
                message.reply("Things that make you go :thinking::thinking::thinking:");
            }
        }
    },
    {
        trigger: "vcleave",
        type: "command",
        perms: pSpamOnly,
        exec: function (message) {
            if (message.member.voiceChannel) {

                let conn = client.voiceConnections.find(e => {
                    return e.channel.id;
                }, message.member.voiceChannel.id);

                if (conn) {
                    if (conn) {
                        conn.disconnect();
                    }
                } else {
                    message.reply("The bot is not in your voice channel!");
                }

            } else {
                message.reply("You need to be in a voice channel!");
            }
        }
    },
    {
        trigger: "update-2.0",
        type: "command",
        perms: pDev,
        exec: function (message) {
            message.channel.send("Greetings humans! I am the A.W.E.S.O.M.-O 4000! Recently, I have been updated to version 2.0! This means I have a load of new schweet commands for you to try! Check here to see all the new commands I was programmed with: https://awesomobot.com/commands\n\nAnd also, check out my brand new website! https://awesomobot.com/ is the brand new home of the A.W.E.S.O.M.-O commands and data tracking! Check how many members are online, see the most active, and nerdy members in the server and see how many times you and the other members have said shit. Don't worry, I won't tell your parents.\n\nThank you for sitting through this presentation of A.W.E.S.O.M.-O 2.0. Now I will need to collect your payment for usage of this bot...\n\nJust kidding, but please help support me. I need funding for the website to run and for my batteries to stay alive. If you would like to help, consider donating to our patreon. All proceeds will go directly to supporting the bot to keep it running. Why donate to starving kids in Africa when you can donate to A.W.E.S.O.M.-O, your robot friend?\n\nOnce again, thank you for reading, and be sure to test all my commands. Who knows, there might be some hidden goodies within the commands?\n\n@everyone",
                { file: "https://cdn.discordapp.com/attachments/395553218249097218/405817686086516736/AWESOM-O_2.0.png" });
        }
    }
];

class Command {
    constructor(json) {
        this.json = json;
    }
    _verify(message, prefix) {

        const base = this.json;

        switch (base.type) {
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
    _check(message /*members from db*/ ) {

        const base = this.json;
        const perms = base.perms;

        let server = true,
            channel = true,
            roles = true,
            member = true,
            stats = true;

        // Server.
        server = perms.server;

        // Channel.
        if (perms.channels) {
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
        }

        // Roles.
        if (perms.roles) {
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
        }

        // Member.
        if (perms.members) {
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
    exec(message, prefix /*, members*/ ) {

        if (!this._verify(message, prefix)) {
            return;
        }

        if (!this._check(message /*, perms, members*/ )) {
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

    if (message.author.equals(client.user)) {
        return;
    }

    for (let i = 0; i < cmds.length; i++) {
        cmds[i].exec(message, prefix);
    }

    for (let i = 0; i < servers.length; i++) {
        if (servers[i].id == message.guild.id) {

            if (!servers[i].stats[0]) {
                servers[i].stats[0] = {};
            }
            if (!servers[i].stats[0].commands) {
                servers[i].stats[0].commands = 0;
            }
            if (!servers[i].stats[0].messages) {
                servers[i].stats[0].messages = 0;
            }
            if (message.content.startsWith(prefix)) {
                servers[i].stats[0].commands++;
            } else {
                servers[i].stats[0].messages++;
            }
            break;
        }
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

                    if (!servers[0].members[i].stats[j].value) {
                        servers[0].members[i].stats[j].value = 0;
                    }

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
            stats: [{
                name: "activity",
                value: message.content.length > 20 ? (message.content.length > 100 ? 8 : 6) : 2,
                lastmsg: 0
            }]
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
    if (message.content == (prefix + "micro") || message.content == (prefix + "microaggression")) {
        return;
    }

    try {

        const channel = message.guild.channels.find(e => {
            return e.name == "logs"
        });
        channel.send(embeds.deletion(message));

    } catch (e) {

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
    client.user.setGame("v2 | awesomobot.com");
    console.log("Bot ready!");
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

//
const temp = {
    "total": 2378,
    "list": [{
        "id": "174754869595471873",
        "name": "Kyrion",
        "shits": 303,
        "activity": 58224,
        "lastmsg": 54
    }, {
        "id": "331641326816854028",
        "name": "Tweek Tweak",
        "shits": 177,
        "activity": 43430,
        "lastmsg": 11
    }, {
        "id": 217486439380811780,
        "name": "superfloree",
        "shits": 146,
        "activity": 17616.772924033245,
        "lastmsg": 80
    }, {
        "id": 168232762862600200,
        "name": "kratosgow342",
        "shits": 117,
        "activity": 37350,
        "lastmsg": 1
    }, {
        "id": 168690518899949570,
        "name": "!Dragon1320",
        "shits": 110,
        "activity": 11257,
        "lastmsg": 110
    }, {
        "id": 191579984274522100,
        "name": "Bell",
        "shits": 105,
        "activity": 16744,
        "lastmsg": 17
    }, {
        "id": 262345465306021900,
        "name": "SmashRoyale",
        "shits": 100,
        "activity": 30879.140772982006,
        "lastmsg": 11
    }, {
        "id": 190914446774763520,
        "name": "Mattheous",
        "shits": 94,
        "activity": 8682.621594137521,
        "lastmsg": 133
    }, {
        "id": "142896162955984896",
        "name": "kajcsi",
        "shits": 91,
        "activity": 11114,
        "lastmsg": 22
    }, {
        "id": "99626024181968896",
        "name": "Airborn56",
        "shits": 80,
        "activity": 7712,
        "lastmsg": 37
    }, {
        "id": 230875863644635140,
        "name": "Fa99les",
        "shits": 71,
        "activity": 17448,
        "lastmsg": 269
    }, {
        "id": "210577042998034433",
        "name": "ファックオフ、縮退❤",
        "shits": 66,
        "activity": 10154,
        "lastmsg": 517
    }, {
        "id": "375586532527964160",
        "name": "BBush",
        "shits": 63,
        "activity": 7286,
        "lastmsg": 11
    }, {
        "id": "275397087485755392",
        "name": "*name change",
        "shits": 55,
        "activity": 8492,
        "lastmsg": 71
    }, {
        "id": "228887919689990144",
        "name": "Paladin Butters",
        "shits": 54,
        "activity": 39590,
        "lastmsg": 3
    }, {
        "id": "280031103761514507",
        "name": "MINTBERRYCRRRRRRRRRRRRUNCH!",
        "shits": 48,
        "activity": 21603.135164329025,
        "lastmsg": 1628
    }, {
        "id": "312808956340731905",
        "name": "しろ",
        "shits": 43,
        "activity": 3108.2863365801168,
        "lastmsg": 915
    }, {
        "id": "215982178046181376",
        "name": "Tweekerino",
        "shits": 38,
        "activity": 15012,
        "lastmsg": 13
    }, {
        "id": "213884331838406656",
        "name": "OkAycase",
        "shits": 37,
        "activity": 15186,
        "lastmsg": 83
    }, {
        "id": 194652191896764400,
        "name": "kiyomitsuuu",
        "shits": 34,
        "activity": 2767.8023981981337,
        "lastmsg": 183
    }, {
        "id": "170229410014822400",
        "name": "AlbinoClock",
        "shits": 31,
        "activity": 2429.7038933721606,
        "lastmsg": 782
    }, {
        "id": "198687342079246336",
        "name": "play that music funky white boi",
        "shits": 23,
        "activity": 8560.950340605446,
        "lastmsg": 759
    }, {
        "id": "319999952350740481",
        "name": "Karkat Vantas",
        "shits": 21,
        "activity": 4228.475924098766,
        "lastmsg": 80
    }, {
        "id": "273409276725166081",
        "name": "Ceres",
        "shits": 19,
        "activity": 0,
        "lastmsg": 1809
    }, {
        "id": "395090104491966474",
        "name": "officalchespiny",
        "shits": 19,
        "activity": 4956,
        "lastmsg": 47
    }, {
        "id": "117783098623655936",
        "name": "Fennwayz",
        "shits": 18,
        "activity": 2910,
        "lastmsg": 92
    }, {
        "id": "150687833353486337",
        "name": "Endless Nameless (godo)",
        "shits": 17,
        "activity": 1462.873359734032,
        "lastmsg": 1740
    }, {
        "id": "326447343840788480",
        "name": "DeadMemes",
        "shits": 17,
        "activity": 5566.678235079568,
        "lastmsg": 66
    }, {
        "id": "228561869852508172",
        "name": "Lei",
        "shits": 16,
        "activity": 54,
        "lastmsg": 380
    }, {
        "id": "313768840188395521",
        "name": "🎄 Lania",
        "shits": 16,
        "activity": 3446.009781921823,
        "lastmsg": 3912
    }, {
        "id": "270588978741116938",
        "name": "Dont know who i am",
        "shits": 15,
        "activity": 3916,
        "lastmsg": 180
    }, {
        "id": 220257478296862720,
        "name": "Ravus",
        "shits": 14,
        "activity": 1795.0863603586636,
        "lastmsg": 765
    }, {
        "id": "303133450796400642",
        "name": "shanny 🚀",
        "shits": 14,
        "activity": 0,
        "lastmsg": 5155
    }, {
        "id": 122649425062395900,
        "name": "Ryder",
        "shits": 13,
        "activity": 10322.603307875115,
        "lastmsg": 199
    }, {
        "id": "160088262231195648",
        "name": "Porter",
        "shits": 12,
        "activity": 0,
        "lastmsg": 7280
    }, {
        "id": "383901109288173568",
        "name": "fuckmewahddytilmyfacefallsoff",
        "shits": 12,
        "activity": 2552,
        "lastmsg": 135
    }, {
        "id": "219562678371352577",
        "name": "Umbreon",
        "shits": 12,
        "activity": 0,
        "lastmsg": 2706
    }, {
        "id": 349886534989643800,
        "name": "WonderTweek",
        "shits": 12,
        "activity": 4688.980783134877,
        "lastmsg": 129
    }, {
        "id": "299075711983943681",
        "name": "Xeno",
        "shits": 11,
        "activity": 1233.818321577925,
        "lastmsg": 2017
    }, {
        "id": "330756704985808909",
        "name": "Rick-C137",
        "shits": 11,
        "activity": 2329.142097238959,
        "lastmsg": 1715
    }, {
        "id": "226106120446541824",
        "name": "Lextreme",
        "shits": 10,
        "activity": 1720.777309352385,
        "lastmsg": 698
    }, {
        "id": "157615456826556416",
        "name": "Engikirby",
        "shits": 14,
        "activity": 3840,
        "lastmsg": 13
    }, {
        "id": "212761441676165120",
        "name": "Vex (Creatur3)",
        "shits": 9,
        "activity": 808,
        "lastmsg": 423
    }, {
        "id": "319941812230029312",
        "name": "vit",
        "shits": 8,
        "activity": 0,
        "lastmsg": 2962
    }, {
        "id": "158971865392611328",
        "name": "Wokesy",
        "shits": 8,
        "activity": 0,
        "lastmsg": 6150
    }, {
        "id": "248950499150266369",
        "name": "BaconTheUber",
        "shits": 8,
        "activity": 1962.9598192790086,
        "lastmsg": 1324
    }, {
        "id": "296211279083995136",
        "name": "skinny penis",
        "shits": 8,
        "activity": 1266,
        "lastmsg": 47
    }, {
        "id": "239482850062237707",
        "name": "0utofbody",
        "shits": 7,
        "activity": 996,
        "lastmsg": 455
    }, {
        "id": "267818273389674497",
        "name": "Icy Boi",
        "shits": 7,
        "activity": 1219.3043134131417,
        "lastmsg": 561
    }, {
        "id": "289830409397731338",
        "name": "tweek is my best gay sonn",
        "shits": 7,
        "activity": 0,
        "lastmsg": 3227
    }, {
        "id": "329020358911066113",
        "name": "yes, definitely, absolutely.",
        "shits": 5,
        "activity": 1708,
        "lastmsg": 68
    }, {
        "id": "161573813379792899",
        "name": "Kamui",
        "shits": 5,
        "activity": 12046,
        "lastmsg": 43
    }, {
        "id": 144015500974751740,
        "name": "Alexander Hamilton",
        "shits": 4,
        "activity": 0,
        "lastmsg": 3145
    }, {
        "id": "342296352853721092",
        "name": "VaderSpawn",
        "shits": 4,
        "activity": 0,
        "lastmsg": 7127
    }, {
        "id": "277338703884582923",
        "name": "Polturkey",
        "shits": 4,
        "activity": 320.1410822149002,
        "lastmsg": 368
    }, {
        "id": "257221980426731530",
        "name": "KA E DET SOM SKJEEEER?!!!!",
        "shits": 4,
        "activity": 273.1681508846269,
        "lastmsg": 205
    }, {
        "id": "346750957373227029",
        "name": "cloudshaped",
        "shits": 4,
        "activity": 1278,
        "lastmsg": 177
    }, {
        "id": "287951569809309696",
        "name": "PiggyTerry",
        "shits": 4,
        "activity": 1387.8009705708635,
        "lastmsg": 823
    }, {
        "id": "230225521277927424",
        "name": "ellaisgrumpy",
        "shits": 4,
        "activity": 0,
        "lastmsg": 1986
    }, {
        "id": "277581652484554752",
        "name": "Festive Dany",
        "shits": 3,
        "activity": 248.8059691334032,
        "lastmsg": 1084
    }, {
        "id": "214458285242187777",
        "name": "Calvin Craig",
        "shits": 3,
        "activity": 820.0749926064893,
        "lastmsg": 103
    }, {
        "id": "252747964903063552",
        "name": "dumb",
        "shits": 3,
        "activity": 0,
        "lastmsg": 7756
    }, {
        "id": "326678360812158986",
        "name": "werewolf2814",
        "shits": 3,
        "activity": 0,
        "lastmsg": 4658
    }, {
        "id": "385872274034524161",
        "name": "Samaaah",
        "shits": 3,
        "activity": 0,
        "lastmsg": 2742
    }, {
        "id": "327185764720836608",
        "name": "I'm NoT jUsT gAy I'm A cAtAmiTe.",
        "shits": 3,
        "activity": 668.3548084903787,
        "lastmsg": 142
    }, {
        "id": "363425165536919552",
        "name": "abc",
        "shits": 3,
        "activity": 0,
        "lastmsg": 3445
    }, {
        "id": "198005882586398721",
        "name": "everydaykemkem",
        "shits": 3,
        "activity": 8732,
        "lastmsg": 20
    }, {
        "id": "259787857802035201",
        "name": "Floatie",
        "shits": 3,
        "activity": 0,
        "lastmsg": 789
    }, {
        "id": "196270492208988162",
        "name": "CREPS",
        "shits": 3,
        "activity": 0,
        "lastmsg": 1648
    }, {
        "id": "307248302397718529",
        "name": "GrajowiecPL",
        "shits": 3,
        "activity": 814,
        "lastmsg": 133
    }, {
        "id": "215046363526725632",
        "name": "Draumr",
        "shits": 3,
        "activity": 0,
        "lastmsg": 4038
    }, {
        "id": "332990864538468354",
        "name": "Free Man",
        "shits": 3,
        "activity": 0,
        "lastmsg": 4803
    }, {
        "id": "341761717614804993",
        "name": "Kyle Broflovski",
        "shits": 3,
        "activity": 466.97538739698933,
        "lastmsg": 237
    }, {
        "id": 325285208805081100,
        "name": "SilverFoxtail",
        "shits": 2,
        "activity": 0,
        "lastmsg": 12486
    }, {
        "id": "345336838376128512",
        "name": "gAH AAAAAAA",
        "shits": 2,
        "activity": 296,
        "lastmsg": 50
    }, {
        "id": "213079375434874880",
        "name": "Rev. B",
        "shits": 2,
        "activity": 522,
        "lastmsg": 70
    }, {
        "id": "351781671844053004",
        "name": "boaredaoc",
        "shits": 2,
        "activity": 0,
        "lastmsg": 5326
    }, {
        "id": "335461949250863115",
        "name": "JaimeSimpson05",
        "shits": 2,
        "activity": 0,
        "lastmsg": 6547
    }, {
        "id": "157241268991164416",
        "name": "Bnm",
        "shits": 2,
        "activity": 0,
        "lastmsg": 6720
    }, {
        "id": "361206071253139457",
        "name": "Venhedis",
        "shits": 2,
        "activity": 3474.7906948294903,
        "lastmsg": 143
    }, {
        "id": "233832353468907521",
        "name": "Polnareff",
        "shits": 2,
        "activity": 0,
        "lastmsg": 634
    }, {
        "id": "322273717612969987",
        "name": "Facepalm Marsh",
        "shits": 2,
        "activity": 270,
        "lastmsg": 185
    }, {
        "id": "315618699715411969",
        "name": "JamesRogers",
        "shits": 2,
        "activity": 0,
        "lastmsg": 3033
    }, {
        "id": "119147779795714048",
        "name": "Pokefan993",
        "shits": 2,
        "activity": 0,
        "lastmsg": 7112
    }, {
        "id": "199339588790124546",
        "name": "Scoots",
        "shits": 2,
        "activity": 0,
        "lastmsg": 1057
    }, {
        "id": "342086358010953728",
        "name": "KlausHeissler",
        "shits": 1,
        "activity": 2197.847372835122,
        "lastmsg": 53
    }, {
        "id": "382852098057961496",
        "name": "Brendon",
        "shits": 1,
        "activity": 146,
        "lastmsg": 454
    }, {
        "id": "195586396310732800",
        "name": "Neccria",
        "shits": 1,
        "activity": 0,
        "lastmsg": 2252
    }, {
        "id": "194634079197462529",
        "name": "A Loser Named Michael",
        "shits": 1,
        "activity": 0,
        "lastmsg": 1708
    }, {
        "id": "242044514255110145",
        "name": "OOFthatsroughbuddy",
        "shits": 1,
        "activity": 352,
        "lastmsg": 412
    }, {
        "id": "208603371710578688",
        "name": "CompressedWizard",
        "shits": 1,
        "activity": 0,
        "lastmsg": 9183
    }, {
        "id": "356138814332207104",
        "name": "Ducky Claus",
        "shits": 1,
        "activity": 0,
        "lastmsg": 5668
    }, {
        "id": "364619266852388864",
        "name": "warmachinerox7192",
        "shits": 1,
        "activity": 2,
        "lastmsg": 234
    }, {
        "id": "230502782623285248",
        "name": "Kyle",
        "shits": 1,
        "activity": 1382,
        "lastmsg": 43
    }, {
        "id": "346833866645962753",
        "name": "VATSman892",
        "shits": 1,
        "activity": 446,
        "lastmsg": 389
    }, {
        "id": "352947555501473793",
        "name": "Owl",
        "shits": 1,
        "activity": 0,
        "lastmsg": 6823
    }, {
        "id": "341127145801646080",
        "name": "Delereno",
        "shits": 1,
        "activity": 0,
        "lastmsg": 7304
    }, {
        "id": "272336984104763393",
        "name": "☆ Savөк ☆",
        "shits": 1,
        "activity": 1009.99045714449,
        "lastmsg": 662
    }, {
        "id": "382011429059821569",
        "name": "TheInkDemon678",
        "shits": 1,
        "activity": 0,
        "lastmsg": 2646
    }, {
        "id": "204415305580150785",
        "name": "Blizix",
        "shits": 1,
        "activity": 0,
        "lastmsg": 7051
    }, {
        "id": "377202675596394496",
        "name": "protocol",
        "shits": 1,
        "activity": 0,
        "lastmsg": 7300
    }, {
        "id": "140204090486423552",
        "name": "Dellen",
        "shits": 1,
        "activity": 0,
        "lastmsg": 10795
    }, {
        "id": "314587513018646529",
        "name": "[¿] Kenny McCormick [?]",
        "shits": 1,
        "activity": 0,
        "lastmsg": 5008
    }, {
        "id": "221021977043795969",
        "name": "A Sad Sangheili",
        "shits": 1,
        "activity": 0,
        "lastmsg": 6548
    }, {
        "id": "290328985328549898",
        "name": "Felipe",
        "shits": 1,
        "activity": 0,
        "lastmsg": 2967
    }, {
        "id": "336842890527375363",
        "name": "Maya",
        "shits": 1,
        "activity": 0,
        "lastmsg": 1675
    }, {
        "id": "210274015682494466",
        "name": "Philip_Daniel ('a=452.89)",
        "shits": 1,
        "activity": 0,
        "lastmsg": 731
    }, {
        "id": "294093612029837323",
        "name": "Banjo Unleashed",
        "shits": 1,
        "activity": 0,
        "lastmsg": 10430
    }, {
        "id": "264563883153293312",
        "name": "Shuichi",
        "shits": 1,
        "activity": 0,
        "lastmsg": 6476
    }, {
        "id": "302317832807383041",
        "name": "From God's Perspective",
        "shits": 1,
        "activity": 12,
        "lastmsg": 73
    }, {
        "id": "356941255579533313",
        "name": "A Dead Kenny",
        "shits": 1,
        "activity": 28,
        "lastmsg": 147
    }, {
        "id": "264088740375429121",
        "name": "GeraltOfEthiopia",
        "shits": 1,
        "activity": 0,
        "lastmsg": 9963
    }, {
        "id": "305815788894289941",
        "name": "RandomComrade",
        "shits": 1,
        "activity": 0,
        "lastmsg": 6761
    }, {
        "id": "170773798918946816",
        "name": "TheRockzSG",
        "shits": 1,
        "activity": 0,
        "lastmsg": 9838
    }, {
        "id": 203602726892863500,
        "name": "!Zerobyte",
        "shits": 1,
        "activity": 0,
        "lastmsg": 12486
    }, {
        "id": "133099495411023872",
        "name": "Nerd Letter",
        "shits": 1,
        "activity": 0,
        "lastmsg": 6685
    }, {
        "id": "282258121701720066",
        "name": "Gracie",
        "shits": 1,
        "activity": 0,
        "lastmsg": 2724
    }, {
        "id": "357552726789324800",
        "name": "Spirit Chan",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5093
    }, {
        "id": "323413101149945857",
        "name": "Hey",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12240
    }, {
        "id": "297737269140389888",
        "name": "DoorKnobCum4938",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7585
    }, {
        "id": "325600863865274379",
        "name": "Mieon (≚ᄌ≚)ƶƵ",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11717
    }, {
        "id": "376939941638176770",
        "name": "Butters the Futa King",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10782
    }, {
        "id": "244141448142782474",
        "name": "avacadoloki",
        "shits": 0,
        "activity": 346,
        "lastmsg": 90
    }, {
        "id": "248977438191648769",
        "name": "2ndparty",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8195
    }, {
        "id": "363003387031191553",
        "name": "Xero",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5610
    }, {
        "id": "171493147292073984",
        "name": "Syntrick",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5566
    }, {
        "id": "330672414880956419",
        "name": "Bubbly",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12438
    }, {
        "id": "361498162378047488",
        "name": "A Silent Night 2 Remember",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9557
    }, {
        "id": "186877285771509761",
        "name": "irene",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10985
    }, {
        "id": "143772403829309440",
        "name": "tarm",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11145
    }, {
        "id": "384236051952173056",
        "name": "kyle",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9901
    }, {
        "id": "98542850995650560",
        "name": "slat3",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7294
    }, {
        "id": "178850358452289538",
        "name": "Cass",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1355
    }, {
        "id": "145181137197596672",
        "name": "POWER",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4588
    }, {
        "id": "342135357233430528",
        "name": "Festive Toast n' Jam",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12215
    }, {
        "id": "336280106198630400",
        "name": "Croissant ( ͡~ ͜ʖ ͡°)",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3023
    }, {
        "id": "323190010964869120",
        "name": "фHiф",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11386
    }, {
        "id": "293884532753432587",
        "name": "SW1774",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9280
    }, {
        "id": "224661038216249345",
        "name": "Lord Foxy Boy",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10664
    }, {
        "id": "334785919674613761",
        "name": "Kylie The Badass Ginger",
        "shits": 0,
        "activity": 6,
        "lastmsg": 215
    }, {
        "id": "316768012407668756",
        "name": "Girble",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10397
    }, {
        "id": "383164960509001740",
        "name": "Cu-Miun",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11524
    }, {
        "id": "93766974877741056",
        "name": "meowzzies",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9077
    }, {
        "id": "292562717527506944",
        "name": "PurpleShlurp",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10359
    }, {
        "id": "174961449330802689",
        "name": "Ricky",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6184
    }, {
        "id": "259939492922654721",
        "name": "freddyairmail",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5829
    }, {
        "id": "396468761311313931",
        "name": "fandom queer trash",
        "shits": 0,
        "activity": 0,
        "lastmsg": 702
    }, {
        "id": "368618417684611072",
        "name": "zdub350",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9327
    }, {
        "id": "127206060904677376",
        "name": "evey119",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9316
    }, {
        "id": "299170703255535616",
        "name": "bunny",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1758
    }, {
        "id": "143866772360134656",
        "name": "Scarlet",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1253
    }, {
        "id": "194920411958476816",
        "name": "TGF",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9271
    }, {
        "id": "338403341455327242",
        "name": "A tua irmã de quatro",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12472
    }, {
        "id": "131244146324144137",
        "name": "lilpumpkin2000",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9314
    }, {
        "id": "370800063427117059",
        "name": "Revvy",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5258
    }, {
        "id": "215285904963665920",
        "name": "Ionic Ass Cannon",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7297
    }, {
        "id": "382201054043045888",
        "name": "pingQ",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10763
    }, {
        "id": "313428733899964417",
        "name": "Hayleycakes2009",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9300
    }, {
        "id": "234518776454840320",
        "name": "ＺＵＣＣ",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12358
    }, {
        "id": "371070223882780682",
        "name": "NoobVanNoob",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7259
    }, {
        "id": "364804540635152386",
        "name": "P0rtals",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1123
    }, {
        "id": "221803637591113729",
        "name": "smokeymicpot",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3649
    }, {
        "id": "201421675558862848",
        "name": "Gonso a secas",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3602
    }, {
        "id": "384489695238684673",
        "name": "The Space",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8911
    }, {
        "id": "293477659781103616",
        "name": "KDbeast42813",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8906
    }, {
        "id": "283285670795935745",
        "name": "Ilkay",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5750
    }, {
        "id": "340224253494558731",
        "name": "BlakeIsLIT",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5698
    }, {
        "id": "328367483775877120",
        "name": "loop",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4221
    }, {
        "id": "385827419610808340",
        "name": "Patrick",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9160
    }, {
        "id": "381575867672821760",
        "name": "Wonder Tweek",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8654
    }, {
        "id": "201014010395623424",
        "name": "alfredo2006",
        "shits": 0,
        "activity": 389.0596528926743,
        "lastmsg": 128
    }, {
        "id": "262655459658432514",
        "name": "Travall",
        "shits": 0,
        "activity": 20,
        "lastmsg": 145
    }, {
        "id": "220726653117136897",
        "name": "Saurav",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3873
    }, {
        "id": "329430391872159755",
        "name": "F.Dank",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9253
    }, {
        "id": "300947353060507648",
        "name": "Ray~Kun",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8576
    }, {
        "id": "361636825170706442",
        "name": "heyitsbailey",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8535
    }, {
        "id": "280844846904770561",
        "name": "Woodland Critters",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8516
    }, {
        "id": "173275217722998786",
        "name": "Edgar",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7314
    }, {
        "id": "395167253533818880",
        "name": "waqasvic",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1176
    }, {
        "id": "256379238230392833",
        "name": "pure irony",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7712
    }, {
        "id": "142885328724819969",
        "name": "Samurai",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8401
    }, {
        "id": "272862527900221440",
        "name": "rikkun",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8396
    }, {
        "id": "96373682871492608",
        "name": "Hexxie 🍒",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3116
    }, {
        "id": "133046540074876929",
        "name": "Tyeiz",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7885
    }, {
        "id": "348989621742600194",
        "name": "Eli",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11109
    }, {
        "id": "275754534285082624",
        "name": "himiko",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8807
    }, {
        "id": "199740565753954304",
        "name": "Centrist16",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8157
    }, {
        "id": "265547706905264152",
        "name": "oncelier",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8150
    }, {
        "id": "352452842801332226",
        "name": "Jelly",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2733
    }, {
        "id": "371143800590041089",
        "name": "Jarabe",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5613
    }, {
        "id": "107810822859821056",
        "name": "swiggaswayslit",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9095
    }, {
        "id": "148969884615704576",
        "name": "saku",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2001
    }, {
        "id": "145284235354308608",
        "name": "definiteely",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8617
    }, {
        "id": "327238996683915267",
        "name": "K1NG L0P3Z",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3026
    }, {
        "id": "304980605207183370",
        "name": "Sigma",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2960
    }, {
        "id": "272986016242204672",
        "name": "nathanielcwm",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9148
    }, {
        "id": "356560547245981697",
        "name": "leodood",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9448
    }, {
        "id": "337082933733097474",
        "name": "Kathiyar",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7243
    }, {
        "id": "253691181970489344",
        "name": "×+",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6153
    }, {
        "id": "326728154511048708",
        "name": "Noka",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6875
    }, {
        "id": "298610959335948289",
        "name": "Scancilen",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7383
    }, {
        "id": "267907982115864576",
        "name": "Ryan eats 20 peppers and dies",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1800
    }, {
        "id": "252303783785136138",
        "name": "Zipphy",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5813
    }, {
        "id": "209192627306889216",
        "name": "Habri",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7260
    }, {
        "id": "365957462333063170",
        "name": "Alexdewa",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1806
    }, {
        "id": "173525714409226240",
        "name": "DaimeowSparklez",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9003
    }, {
        "id": "268936097399177218",
        "name": "angelkenny",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1002
    }, {
        "id": "66021750319620096",
        "name": "Tobled",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7276
    }, {
        "id": "388165140152844288",
        "name": "pickwickjesus",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7298
    }, {
        "id": "308665976231165953",
        "name": "pokemonmaster!",
        "shits": 0,
        "activity": 114,
        "lastmsg": 147
    }, {
        "id": "139478949779603465",
        "name": "Dank Tree",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7296
    }, {
        "id": "295721447995736064",
        "name": "jka0004",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11094
    }, {
        "id": "175361312484884482",
        "name": "corylulu",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7275
    }, {
        "id": "348292774870908929",
        "name": "axoloto",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7259
    }, {
        "id": "324864375817240577",
        "name": "hatrack",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7164
    }, {
        "id": "107560034455543808",
        "name": "Midnight",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11616
    }, {
        "id": "308362412908871682",
        "name": "Highlandcatt",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5742
    }, {
        "id": "292497046353477633",
        "name": "Kae",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7148
    }, {
        "id": "268650976460668929",
        "name": "somevietlove",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9633
    }, {
        "id": "349149314372861953",
        "name": "MateiTheSouthParkFan",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8385
    }, {
        "id": "111910654452989952",
        "name": "RosstheBossy",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7297
    }, {
        "id": "366750726640107520",
        "name": "dieandfuckingloveme",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6158
    }, {
        "id": "202967811285450752",
        "name": "HyyDee",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10990
    }, {
        "id": "254243953828823041",
        "name": "yuri",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6827
    }, {
        "id": "286268252730949633",
        "name": "The Great Garbo",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11691
    }, {
        "id": "295577134259240962",
        "name": "bkr121",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6801
    }, {
        "id": "326045308184166400",
        "name": "Tweek Tweak",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10844
    }, {
        "id": "308912385325006848",
        "name": "DragonFart",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6533
    }, {
        "id": "244240370450432001",
        "name": "Crystalpyg613",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11140
    }, {
        "id": "300373645555924993",
        "name": "MCMAYNERBERRY",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11071
    }, {
        "id": "382245126409551873",
        "name": "LORDE",
        "shits": 0,
        "activity": 182,
        "lastmsg": 426
    }, {
        "id": "173866620844900352",
        "name": "jokerj4513",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4123
    }, {
        "id": "286242060271484928",
        "name": "nuke",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6166
    }, {
        "id": "213402490752729089",
        "name": "victorREZNOV12",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11645
    }, {
        "id": "273558514784403466",
        "name": "•sad-cormick•",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1947
    }, {
        "id": "288988292588896256",
        "name": "Catharsis",
        "shits": 0,
        "activity": 8,
        "lastmsg": 144
    }, {
        "id": "293891845908594689",
        "name": "bluh",
        "shits": 0,
        "activity": 2,
        "lastmsg": 398
    }, {
        "id": "212027945211002880",
        "name": "Dexter (Kitkat)",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3837
    }, {
        "id": "387263906508308500",
        "name": "Ice....",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6376
    }, {
        "id": "311676229898076170",
        "name": "Master Assassin",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6491
    }, {
        "id": "223967777898102784",
        "name": "emithecheme",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6964
    }, {
        "id": "126131102153834497",
        "name": "Δbility",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6894
    }, {
        "id": "262979877005688832",
        "name": "Mr.SnowBones",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3271
    }, {
        "id": "247338595839377418",
        "name": "Samuel_420",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7461
    }, {
        "id": "237825448862547978",
        "name": "....🥃",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6583
    }, {
        "id": "220010763593580545",
        "name": "pornjesus",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6813
    }, {
        "id": "320130681265192960",
        "name": "OPERA",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2947
    }, {
        "id": "281967911680081923",
        "name": "the bard",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9635
    }, {
        "id": "318211176930738177",
        "name": "4in",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4023
    }, {
        "id": "262354819652517888",
        "name": "Gook Jr.",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9632
    }, {
        "id": "230841624685445120",
        "name": "Ben | Gongon",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5460
    }, {
        "id": "177092979155140608",
        "name": "Star 🎄",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3897
    }, {
        "id": "322586251280515082",
        "name": "Beth.",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5397
    }, {
        "id": "195206033558339584",
        "name": "Surgt11",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6267
    }, {
        "id": "135821957844172800",
        "name": "Poker1st",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5874
    }, {
        "id": "250366258741116928",
        "name": "Shmow",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5086
    }, {
        "id": "214584733395451905",
        "name": "merry birbmas",
        "shits": 0,
        "activity": 438,
        "lastmsg": 88
    }, {
        "id": "197336283176108032",
        "name": "Syncro37",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5308
    }, {
        "id": "250235216155639808",
        "name": "Husk le Pups",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5550
    }, {
        "id": "352605872704192513",
        "name": "TheShareBear",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3581
    }, {
        "id": "192806211534585856",
        "name": "shiki",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11422
    }, {
        "id": "133950904226414593",
        "name": "Quaxo",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10816
    }, {
        "id": "164752496982491136",
        "name": "The Christmas Egg",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3933
    }, {
        "id": "199762100183105536",
        "name": "Yuriprime",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4361
    }, {
        "id": "327292206354399235",
        "name": "ducc",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11019
    }, {
        "id": "343417573880102912",
        "name": "Cookie",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11631
    }, {
        "id": "374270368522698753",
        "name": "BlueSah89",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9317
    }, {
        "id": "173168799506235392",
        "name": "Craig Tucker",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4087
    }, {
        "id": "363857633998012416",
        "name": "Sophelia",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4364
    }, {
        "id": "333162055542767619",
        "name": "najen",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8620
    }, {
        "id": "281550411058642946",
        "name": "Xor",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2849
    }, {
        "id": "347502445103939586",
        "name": "PinkPawedProductions",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4326
    }, {
        "id": "294613651808190464",
        "name": "She's the one I love",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1144
    }, {
        "id": "155149108183695360",
        "name": "Dyno",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9108
    }, {
        "id": "316372939157012481",
        "name": "Witt",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3892
    }, {
        "id": "248958355996016662",
        "name": "Noerdy",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5875
    }, {
        "id": "297544042718298125",
        "name": "necks_lvl",
        "shits": 0,
        "activity": 0,
        "lastmsg": 677
    }, {
        "id": "144872569525239809",
        "name": "nitroyoshi9",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11610
    }, {
        "id": "330044916216365056",
        "name": "Micavolg2344",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3915
    }, {
        "id": "314917673123446786",
        "name": "Alkalye",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3886
    }, {
        "id": "255764664938528784",
        "name": "1998CR",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3847
    }, {
        "id": "253903514391150592",
        "name": "That One South Park Fan",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4451
    }, {
        "id": "273268037837127690",
        "name": "MonstoBusta2000",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2227
    }, {
        "id": "391393163186798594",
        "name": "Bitterra",
        "shits": 0,
        "activity": 6,
        "lastmsg": 141
    }, {
        "id": "349968272738877440",
        "name": "Blu Haired Boi",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10542
    }, {
        "id": "307976961064435713",
        "name": "RedBot",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12244
    }, {
        "id": "181370713817612289",
        "name": "Kawa",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3523
    }, {
        "id": "389259207750451201",
        "name": "csensang",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4072
    }, {
        "id": "324313543753203723",
        "name": "GhostCPYT",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11632
    }, {
        "id": "374108952746786818",
        "name": "Tweak",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3154
    }, {
        "id": "148170360406147075",
        "name": "Seaner23",
        "shits": 0,
        "activity": 0,
        "lastmsg": 898
    }, {
        "id": "333369502026956802",
        "name": "fat",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2143
    }, {
        "id": "305792949193539584",
        "name": "Max is Festive",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10035
    }, {
        "id": "331010622760288257",
        "name": "Xheraldo",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8676
    }, {
        "id": "390208355873849355",
        "name": "Perroloco",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3670
    }, {
        "id": "331766123924160533",
        "name": "Rodent",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2002
    }, {
        "id": "169152171873533952",
        "name": "why",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8877
    }, {
        "id": "190837075183009792",
        "name": "Lightning",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9171
    }, {
        "id": "289829303565156353",
        "name": "feliz hannkuah",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2415
    }, {
        "id": "373089771771396099",
        "name": "FrightfulDread",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2719
    }, {
        "id": "248084943522103296",
        "name": "Katsura",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5959
    }, {
        "id": "388838167119396864",
        "name": "CreekShipper64",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1645
    }, {
        "id": "104984717891223552",
        "name": "2th",
        "shits": 0,
        "activity": 20,
        "lastmsg": 71
    }, {
        "id": "372155002396868614",
        "name": "ＷＩＺＡＲＤ",
        "shits": 0,
        "activity": 842,
        "lastmsg": 57
    }, {
        "id": "330193848137678848",
        "name": "Raven",
        "shits": 0,
        "activity": 108,
        "lastmsg": 312
    }, {
        "id": "156564558368997376",
        "name": "boop",
        "shits": 0,
        "activity": 98,
        "lastmsg": 255
    }, {
        "id": "270343911581417482",
        "name": "blizz",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2123
    }, {
        "id": "171798358153887744",
        "name": "Lolwutburger",
        "shits": 0,
        "activity": 882,
        "lastmsg": 253
    }, {
        "id": "256545543398883329",
        "name": "randall",
        "shits": 0,
        "activity": 22.153086488973877,
        "lastmsg": 698
    }, {
        "id": "383370313611870218",
        "name": "Magnet Cloud",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8156
    }, {
        "id": "313466406563872769",
        "name": "theboss",
        "shits": 0,
        "activity": 158,
        "lastmsg": 425
    }, {
        "id": "67773365326184448",
        "name": "Meoin",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9321
    }, {
        "id": "273864312206917634",
        "name": "Wheatley",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1993
    }, {
        "id": "267056064527073280",
        "name": "Ice",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3311
    }, {
        "id": "156055487618482176",
        "name": "🎄 マフィン 🍊",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8927
    }, {
        "id": "352657542452609024",
        "name": "tit slit",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7286
    }, {
        "id": "396344307902054401",
        "name": "Mr. Mantis",
        "shits": 0,
        "activity": 1764,
        "lastmsg": 85
    }, {
        "id": "395675681574354944",
        "name": "Cloyster//LunalaDalaShala",
        "shits": 0,
        "activity": 52,
        "lastmsg": 477
    }, {
        "id": "245408198713016320",
        "name": "Mysterion?",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9311
    }, {
        "id": "379142078048894976",
        "name": "MLGesus",
        "shits": 0,
        "activity": 48,
        "lastmsg": 350
    }, {
        "id": "262071124463058944",
        "name": "Ghostler",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2511
    }, {
        "id": "227482342309101568",
        "name": "what the FUCK is up kyle",
        "shits": 0,
        "activity": 40,
        "lastmsg": 399
    }, {
        "id": "195968053123481601",
        "name": "Jay Frost",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8819
    }, {
        "id": "381481841636671498",
        "name": "Shanmalon",
        "shits": 0,
        "activity": 5.71622455545256,
        "lastmsg": 658
    }, {
        "id": "336851422639554560",
        "name": "Policeman Craig",
        "shits": 0,
        "activity": 8,
        "lastmsg": 83
    }, {
        "id": "202609552804282368",
        "name": "Karachoice07",
        "shits": 0,
        "activity": 0,
        "lastmsg": 899
    }, {
        "id": "215651576356929546",
        "name": "l1nka7",
        "shits": 0,
        "activity": 2114,
        "lastmsg": 149
    }, {
        "id": "192752976606003201",
        "name": "LANES",
        "shits": 0,
        "activity": 120,
        "lastmsg": 416
    }, {
        "id": "369188529965760535",
        "name": "!.[!Heidi Turner].!",
        "shits": 0,
        "activity": 0,
        "lastmsg": 754
    }, {
        "id": "168758473587163137",
        "name": "Oneironaut",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9064
    }, {
        "id": "254751031001481216",
        "name": "stinky",
        "shits": 0,
        "activity": 360,
        "lastmsg": 57
    }, {
        "id": "368352414409162752",
        "name": "Abeldor",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8657
    }, {
        "id": "307446347559206922",
        "name": "skankhunt42",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8620
    }, {
        "id": "304819781838700546",
        "name": "Th3 R4nd0m P3rs0n",
        "shits": 0,
        "activity": 14,
        "lastmsg": 97
    }, {
        "id": "377183753061138444",
        "name": "jazzeuopho",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8023
    }, {
        "id": "280425545886597131",
        "name": "Super Adam",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5382
    }, {
        "id": "306436950842146816",
        "name": "dead meme🤔",
        "shits": 0,
        "activity": 6,
        "lastmsg": 427
    }, {
        "id": "229183531006296064",
        "name": "Yasoran",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12068
    }, {
        "id": "104747875782660096",
        "name": "Sorathomos",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10864
    }, {
        "id": "258397522207178753",
        "name": "Wyatt",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7304
    }, {
        "id": "276488010726637578",
        "name": "MayContainWheat",
        "shits": 1,
        "activity": 52,
        "lastmsg": 21
    }, {
        "id": "158150240715800576",
        "name": "Shadok123",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9426
    }]
}
//

// Warning! Callback hell incoming!
// Achtung - warnings are best done in German!
function loadAssets(cb) {

    // Load the db first.
    const ourServerId = "371762864790306817";
    Server.findById(ourServerId, (err, server) => {
        if (err) {
            console.log("1 >> THE DB IS BROKEN, WERE ALL FUCKED!");
            cb("error!");
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

        // temp fix
        const members = servers[0].members;
        for (let i = 0; i < members.length; i++) {
            for (let j = 0; j < members[i].stats.length; j++) {
                if (members[i].stats[j].name == "activity" && !members[i].stats[j].value) {
                    members[i].stats[j].value = 0;
                }
            }
        }

        console.log("Undefined activity replaced.");
        //

        // Then load assets.
        Promise.all([jimp.read("./src/bot/assets/base.png"), jimp.read("./src/bot/assets/mask.png"), jimp.loadFont("./src/bot/assets/helvetica-light.fnt")]).then(values => {
            jBase = values[0];
            jMask = values[1];
            jFont = values[2];

            console.log("DEBUG >> Loaded [" + "3" + "] assets.");

            // And finally load the ep list.
            spnav.getEpList((list) => {
                eplist = list;
                console.log("DEBUG >> Loaded [" + list.length + "] episodes.");

                // Set up db sve interval. (def: 300000)
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

                                const guild = client.guilds.find(e => {
                                    return e.id == ourServerId;
                                });
                                if (!servers[i].stats[0]) {
                                    servers[i].stats[0] = {};
                                }
                                if (!guild) {
                                    servers[i].stats[0].totalMembers = 0;
                                } else {
                                    servers[i].stats[0].totalMembers = guild.memberCount;
                                }

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

                // Cb if successfull.

                cb();

            });

        }).catch(err => {

            console.log("ERROR >> Failed to load assets.");
            cb("error!");
            return;
        });
    });
}

module.exports = {
    client,
    loadAssets
};