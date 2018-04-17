"use strict";

const discord = require("discord.js");

const utils = require("./utils");
const spnav = require("./api/spnav");
const logConstants = utils.logger;
const logger = utils.globLogger;

let cachedeplist;

class Command {
    constructor(data) {
        this.data = data;
    }
    check(message, guild) {

        let passed = false;
        
        if (Array.isArray(this.data.match)) {
            for (let i = 0; i < this.data.match.length; i++) {
                if (this._checkPrefix(message, guild, this.data.match[i])) {
                    passed = true;
                    break;
                }
            }
        } else {
            if (this._checkPrefix(message, guild, this.data.match)) {
                passed = true;
            }
        }

        if (passed === false) {
            logger.log(logConstants.LOG_DEBUG, "message did not match any command");
            return false;
        }

        logger.log(logConstants.LOG_DEBUG, "command found");

        //groups
        let current = guild.commands.find(e => {
            return e.name == this.data.name;
        });
        if (!current) {
            logger.log(logConstants.LOG_DEBUG, "no local group data found for command, skipping group check");
            return true;
        }

        if (current.group == "") {
            logger.log(logConstants.LOG_DEBUG, "group data not specified, skipping group check");
            return true;
        }

        let group = guild.groups.find(e => {
            return e.name == current.group;
        });
        if (!group) {
            logger.log(logConstants.LOG_DEBUG, "group specified not found, failing command check");
            return false;
        }

        let inherits = guild.groups.filter(e => {
            for (var i = 0; i < group.inherits; i++) {
                if (group.inherits[i] == e.name) {
                    return true
                }
            }
            return false
        });
        if (!inherits || inherits.length != group.inherits) {
            logger.log(logConstants.LOG_DEBUG, "inherited group(s) not found, failing command check");
            return false;
        }

        inherits.unshift(group);

        let exclusive = {
            channels: [],
            roles: [],
            members: [],
        };
        let inclusive = {
            channels: [],
            roles: [],
            members: [],
        };

        for (let i = 0; i < inherits.length; i++) {
            // Channels.
            let excl = true;
            for (let j = 0; j < inherits[i].channels.length; j++) {
                if (inherits[i].channels[j].target == "*") {
                    excl = inherits[i].channels[j].allow;
                    break;
                }
            }
            for (let j = 0; j < inherits[i].channels.length; j++) {
                if (inherits[i].channels[j].target == "*") {
                    continue;
                }
                let found = false;
                if (excl) {
                    for (let k = 0; k < exclusive.channels.length; k++) {
                        if (exclusive.channels[k].target == inherits[i].channels[j].target) {
                            exclusive.channels[k].allow = inherits[i].channels[j].allow;
                            found = true;
                        }
                    }
                    if (!found) {
                        exclusive.channels.push(inherits[i].channels[j]);
                    }
                } else {
                    for (let k = 0; k < inclusive.channels.length; k++) {
                        if (inclusive.channels[k].target == inherits[i].channels[j].target) {
                            inclusive.channels[k].allow = inherits[i].channels[j].allow;
                            found = true;
                        }
                    }
                    if (!found) {
                        inclusive.channels.push(inherits[i].channels[j]);
                    }
                }
            }
            // Roles.
            excl = true;
            for (let j = 0; j < inherits[i].roles.length; j++) {
                if (inherits[i].roles[j].target == "*") {
                    excl = inherits[i].roles[j].allow;
                    break;
                }
            }
            for (let j = 0; j < inherits[i].roles.length; j++) {
                if (inherits[i].roles[j].target == "*") {
                    continue;
                }
                let found = false;
                if (excl) {
                    for (let k = 0; k < exclusive.roles.length; k++) {
                        if (exclusive.roles[k].target == inherits[i].roles[j].target) {
                            exclusive.roles[k].allow = inherits[i].roles[j].allow;
                            found = true;
                        }
                    }
                    if (!found) {
                        exclusive.roles.push(inherits[i].roles[j]);
                    }
                } else {
                    for (let k = 0; k < inclusive.roles.length; k++) {
                        if (inclusive.roles[k].target == inherits[i].roles[j].target) {
                            inclusive.roles[k].allow = inherits[i].roles[j].allow;
                            found = true;
                        }
                    }
                    if (!found) {
                        inclusive.roles.push(inherits[i].roles[j]);
                    }
                }
            }
            // Members.
            excl = true;
            for (let j = 0; j < inherits[i].members.length; j++) {
                if (inherits[i].members[j].target == "*") {
                    excl = inherits[i].members[j].allow;
                    break;
                }
            }
            for (let j = 0; j < inherits[i].members.length; j++) {
                if (inherits[i].members[j].target == "*") {
                    continue;
                }
                let found = false;
                if (excl) {
                    for (let k = 0; k < exclusive.members.length; k++) {
                        if (exclusive.members[k].target == inherits[i].members[j].target) {
                            exclusive.members[k].allow = inherits[i].members[j].allow;
                            found = true;
                        }
                    }
                    if (!found) {
                        exclusive.members.push(inherits[i].members[j]);
                    }
                } else {
                    for (let k = 0; k < inclusive.members.length; k++) {
                        if (inclusive.members[k].target == inherits[i].members[j].target) {
                            inclusive.members[k].allow = inherits[i].members[j].allow;
                            found = true;
                        }
                    }
                    if (!found) {
                        inclusive.members.push(inherits[i].members[j]);
                    }
                }
            }
        }

        logger.log(logConstants.LOG_DEBUG, exclusive);
        logger.log(logConstants.LOG_DEBUG, inclusive);

        // Channels.
        let allow = false
        let found = false
        for (let i = 0; i < exclusive.channels.length; i++) {
            if (exclusive.channels[i].target == message.channel.id) {
                allow = exclusive.channels[i].allow;
                found = true;
                break;
            }
        }
        if (!found) {
            allow = true;
            logger.log(logConstants.LOG_DEBUG, "channel exclusive not found");
        }
        if (!allow) {
            logger.log(logConstants.LOG_DEBUG, "failing command check on channel exclusive");
            return false;
        }
        allow = false
        found = false
        for (let i = 0; i < inclusive.channels.length; i++) {
            if (inclusive.channels[i].target == message.channel.id) {
                allow = inclusive.channels[i].allow;
                found = true;
                break;
            }
        }
        if (!found) {
            allow = false;
            logger.log(logConstants.LOG_DEBUG, "channel inclusive not found");
        }
        if (!allow && inclusive.channels.length != 0) {
            logger.log(logConstants.LOG_DEBUG, "failing command check on channel inclusive");
            return false;
        }
        // Roles.
        allow = false;
        found = false;
        for (let i = 0; i < exclusive.roles.length; i++) {
            found = false;
            if (message.member.roles.get(exclusive.roles[i].target)) {
                allow = exclusive.roles[i].allow;
                found = true;
            }
            if (!found) {
                allow = true;
                logger.log(logConstants.LOG_DEBUG, "role exclusive not found");
            }
            if (!allow) {
                logger.log(logConstants.LOG_DEBUG, "failing command check on role exclusive");
                return false;
            }
        }
        allow = false;
        found = false;
        for (let i = 0; i < inclusive.roles.length; i++) {
            found = false;
            if (message.member.roles.get(inclusive.roles[i].target)) {
                allow = inclusive.roles[i].allow;
                found = true;
            }
            if (!found) {
                allow = false;
                logger.log(logConstants.LOG_DEBUG, "role inclusive not found");
            }
            if (!allow && inclusive.roles.length != 0) {
                logger.log(logConstants.LOG_DEBUG, "failing command check on role exclusive");
                return false;
            }
        }
        // Members.
        allow = false
        found = false
        for (let i = 0; i < exclusive.members.length; i++) {
            if (exclusive.members[i].target == message.channel.id) {
                allow = exclusive.members[i].allow;
                found = true;
                break;
            }
        }
        if (!found) {
            allow = true;
            logger.log(logConstants.LOG_DEBUG, "member exclusive not found");
        }
        if (!allow) {
            logger.log(logConstants.LOG_DEBUG, "failing command check on member exclusive");
            return false;
        }
        allow = false
        found = false
        for (let i = 0; i < inclusive.members.length; i++) {
            if (inclusive.members[i].target == message.channel.id) {
                allow = inclusive.members[i].allow;
                found = true;
                break;
            }
        }
        if (!found) {
            allow = false;
            logger.log(logConstants.LOG_DEBUG, "member inclusive not found");
        }
        if (!allow && inclusive.members.length != 0) {
            logger.log(logConstants.LOG_DEBUG, "failing command check on member inclusive");
            return false;
        }

        logger.log(logConstants.LOG_DEBUG, "command check passed");

        return true   
    }
    _checkPrefix(message, guild, match) {

        switch (this.data.type) {
            case "command":
                return message.content.split(" ")[0].toLowerCase() == (guild.settings.prefix+match.toLowerCase());
                break;
            case "startswith":
                return message.content.toLowerCase().startsWith(match.toLowerCase());
                break;
            case "contains":
                return message.content.toLowerCase().indexOf(match.toLowerCase()) != -1;
                break;
            case "exactmatch":
                return message.content == match;
                break;
            default:
                logger.log(logConstants.LOG_DEBUG, "command type is undefined or did not match and predefined types");
                return false;
                break;
        }
    }
    call(message, guild) {
        logger.log(logConstants.LOG_DEBUG, "calling command");
        this.data.call(message, guild);
    }
}

const commands = [
    new Command({
        name: "one test boii",
        desc: "a test command for testing lol",
        type: "command",
        match: "test",
        call: function(message, guild) {
            message.channel.send("testing...");
        }
    }),
    new Command({
        name: "wikia search",
        desc: "Searches wikia for the query that you entered. Currently only works with the southpark fandom",
        type: "command",
        match: ["w", "wiki", "wikia", "search"],
        call: function(message, guild) {

            const query = message.content.substring(message.content.indexOf(" ") + 1);
            
            spnav.wikiaSearch(query).then(result => {
                const embed = new discord.RichEmbed()
                    .setColor(0x8bc34a)
                    .setAuthor("AWESOM-O // " + result.title, "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846")
                    .setURL(result.url)
                    .setDescription(result.desc);

                if (result.thumbnail.indexOf(".png") !== -1) {
                    embed.setThumbnail(result.thumbnail.substring(0, result.thumbnail.indexOf(".png") + 4));
                } else if (result.thumbnail.indexOf(".jpg") !== -1) {
                    embed.setThumbnail(result.thumbnail.substring(0, result.thumbnail.indexOf(".jpg") + 4));
                } else if (result.thumbnail.indexOf(".jpeg") !== -1) {
                    embed.setThumbnail(result.thumbnail.substring(0, result.thumbnail.indexOf(".jpeg") + 5));
                } else if (result.thumbnail.indexOf(".gif") !== -1) {
                    embed.setThumbnail(result.thumbnail.substring(0, result.thumbnail.indexOf(".gif") + 4));
                } else {
                    embed.setThumbnail(result.thumbnail);
                }

                message.channel.send(embed);

            }).catch(error => {
                message.reply(`fucking rip... ${error}`);
            });
        }
    }),
    new Command({
        name: "random search",
        desc: "Searches wikia for a random episode. Currently only works with the southpark fandom",
        type: "command",
        match: ["r", "rw", "rwiki", "rwikia", "rsearch", "random"],
        call: function(message, guild) {
            
            if (cachedeplist === undefined) {

                spnav.getEpList().then(result => {
                    cachedeplist = result;
                    this.call(message, guild);

                }).catch(error => {
                    message.reply(`fucking rip... ${error}`);
                });

                return;
            }

            const query = cachedeplist[Math.floor(Math.random() * cachedeplist.length)];
            
            spnav.wikiaSearch(query).then(result => {
                const embed = new discord.RichEmbed()
                    .setColor(0x8bc34a)
                    .setAuthor("AWESOM-O // " + result.title, "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846")
                    .setURL(result.url)
                    .setDescription(result.desc);

                if (result.thumbnail.indexOf(".png") !== -1) {
                    embed.setThumbnail(result.thumbnail.substring(0, result.thumbnail.indexOf(".png") + 4));
                } else if (result.thumbnail.indexOf(".jpg") !== -1) {
                    embed.setThumbnail(result.thumbnail.substring(0, result.thumbnail.indexOf(".jpg") + 4));
                } else if (result.thumbnail.indexOf(".jpeg") !== -1) {
                    embed.setThumbnail(result.thumbnail.substring(0, result.thumbnail.indexOf(".jpeg") + 5));
                } else if (result.thumbnail.indexOf(".gif") !== -1) {
                    embed.setThumbnail(result.thumbnail.substring(0, result.thumbnail.indexOf(".gif") + 4));
                } else {
                    embed.setThumbnail(result.thumbnail);
                }

                message.channel.send(embed);

            }).catch(error => {
                message.reply(`fucking rip... ${error}`);
            });
        }
    }),
    new Command({
        name: "discord avatar",
        desc: "(no description)",
        type: "command",
        match: "avatar",
        call: function(message, guild) {

            let scaledSize = 512;

            let currentSize = parseInt(message.author.avatarURL.substring(message.author.avatarURL.indexOf("size=") + 5), 10);
            if (currentSize === undefined) {
                message.reply("so... the bot shit itself, blame dragon");
            }
            if (currentSize < scaledSize) {
                scaledSize = currentSize;
            }
            
            message.reply(message.author.avatarURL.substring(0, message.author.avatarURL.indexOf("size=") + 5) + scaledSize);
        }
    }),
    new Command({
        name: "subreddit link",
        desc: "(no description)",
        type: "command",
        match: "sub",
        call: function(message, guild) {
            
            message.reply("https://reddit.com/r/southpark/");
        }
    }),
    new Command({
        name: "microaggression",
        desc: "(no description)",
        type: "command",
        match: "micro",
        call: function(message, guild) {

            message.channel.send("", {
                file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
            });
        }
    }),
    new Command({
        name: "reminder",
        desc: "Don't forget to bring a towel!",
        type: "command",
        match: "reminder",
        call: function(message, guild) {

            message.channel.send("", {
                file: "https://cdn.discordapp.com/attachments/378287210711220224/378648515959586816/Towelie_Logo2.png"
            });
        }
    }),
    new Command({
        name: "welcome",
        desc: "(no description)",
        type: "command",
        match: "welcome",
        call: function(message, guild) {
            
            message.channel.send("", {
                file: "https://cdn.discordapp.com/attachments/371762864790306820/378305844959248385/Welcome.png"
            });
        }
    }),
    new Command({
        name: "pay respects",
        desc: "(no description)",
        type: "command",
        match: "f",
        call: function(message, guild) {
            
            message.reply("Repects have been paid");
        }
    }),
    new Command({
        name: "times",
        desc: "(no description)",
        type: "",
        match: "",
        call: function(message, guild) {
            
            // temp
        }
    }),
    new Command({
        name: "batman",
        desc: "(no description)",
        type: "command",
        match: "batman",
        call: function(message, guild) {
            
            message.channel.send("", {
                file: "https://cdn.discordapp.com/attachments/379432139856412682/401498015719882752/batman.png"
            });
        }
    }),
    new Command({
        name: "member",
        desc: "(no description)",
        type: "startswith",
        match: "member",
        call: function(message, guild) {
            
            const memberMessages = ["I member!", "Ohh yeah I member!", "Me member!", "Ohh boy I member that", "I member!, do you member?"];
            message.reply(memberMessages[Math.floor(Math.random() * memberMessages.length)]);
        }
    }),
    new Command({
        name: "i broke the dam",
        desc: "(no description)",
        type: "startswith",
        match: "i broke the dam",
        call: function(message, guild) {
         
            message.reply("No, I broke the dam");
        }
    }),
    new Command({
        name: "movie idea",
        desc: "(no description)",
        type: "command",
        match: "movieidea",
        call: function(message, guild) {
            
            const movieIdeas = [
                "Movie Idea #01: Adam Sandler... is like in love with some girl.. but then it turns out that the girl is actually a golden retriever or something..",
                "Movie Idea #02: Adam Sandler... inherits like a billion dollars.. but first he needs to become a boxer or something",
                "Movie Idea #03: Rob Schneider... is forced to write in javascript... and something",
                "Movie Idea #04: Adam Sandler is kidnapped and made to copy bootstrap code",
                "Movie Idea #05: Adam Sandler... is actually some guy with some sword that lights up and stuff",
                "Movie Idea #06: Adam Sandler... is a robot sent from the future to kill another robot",
                "Movie Idea #07: Adam Sandler... has like a katana sword.. and eh needs to kill some guy named Bill",
                "Movie Idea #08: Adam Sandler is forced to train under this chinese guy... thats actually japanese and stuff",
                "Movie Idea #09: AWESOM-O is forced to clean up rubbish and then like goes into space and stuff",
                "Movie Idea #10: Adam Sandler argues with this red light robot on some.. eh spaceship",
                "Movie Idea #11: Adam Sandler... is a toy.. and completes a story",
                "Movie Idea #12: Adam Sandler... like robs a bank and has a some scars or something...",
                "Movie Idea #13: Rob Schneider is a like a guy like in the second world war and stuff",
                "Movie Idea #14: Adam Sandler is in a car... only problem is that he can't go below 50MPH or he'll die",
                "Movie Idea #15: Adam Sandler is scottish and wears a kilt and stuff",
                "Movie Idea #16: Adam Sandler has a dream.. but he thinks it real life and stuff",
                "Movie Idea #17: Rob Schneider is actually a carrot and stuff",
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
                "Movie Idea #28: Rob Schneider... has to play drums in this eh.. jazz band but he doesnt know if he is rushing or dragging...",
                "Movie Idea #29: Adam Sandler.. is hungry.. so he plays some games... to get his food stamps...",
                "Movie Idea #30: Adam Sandler.. is this dictator who fancies some girl who works in like some wholefoods place.. so he decides to not be a dictator and stuff..",
                "Movie Idea #31: Adam Sandler and his friend makes a TV show called Adam's World but is not allowed to play stairway in the guitar shop... and stuff...",
                "Movie Idea #34.249.184.154: Adam Sandler... has to make money through patreon to fund the servers....  https://www.patreon.com/awesomo ..not selling out at all...",
                "Movie Idea #35: Rob Schneider is afraid of ghosts, and he has to like bust 'em up and stuff..",
                "Movie Idea #69: Adam Sandler is the new kid in a small town in.. eh.. Colorado.. and he has to deal with these 8-year olds and stuff...",
                "Movie Idea #2305: Adam Sandler is trapped on an island... and falls in love with a ehh coconut",
            ];

            message.reply(movieIdeas[Math.floor(Math.random() * movieIdeas.length)]);
        }
    }),
    new Command({
        name: "helpline",
        desc: "(no description)",
        type: "command",
        match: "helpline",
        call: function(message, guild) {
            
            message.reply("https://www.reddit.com/r/suicideprevention/comments/6hjba7/info_suicide_prevention_hotlines/");
        }
    }),
    new Command({
        name: "info",
        desc: "(no description)",
        type: "",
        match: "",
        call: function(message, guild) {
            
            // temp
        }
    }),
    new Command({
        name: "help",
        desc: "(no description)",
        type: "",
        match: "",
        call: function(message, guild) {
            
            // temp
        }
    }),
    new Command({
        name: "harvest",
        desc: "(no description)",
        type: "command",
        match: "harvest",
        call: function(message, guild) {
            
            // temp
        }
    }),
    new Command({
        name: "join",
        desc: "(no description)",
        type: "",
        match: "",
        call: function(message, guild) {
            
            // temp
        }
    }),
    new Command({
        name: "civilwar",
        desc: "(no description)",
        type: "",
        match: "",
        call: function(message, guild) {
            
            // temp
        }
    }),
    new Command({
        name: "fuck yourself",
        desc: "(no description)",
        type: "command",
        match: "fuckyourself",
        call: function(message, guild) {
            
            message.channel.send(new discord.RichEmbed().setImage("http://1.images.southparkstudios.com/blogs/southparkstudios.com/files/2014/09/1801_5a.gif"));
        }
    }),
    new Command({
        name: "fuck you",
        desc: "(no description)",
        type: "command",
        match: "fuckyou",
        call: function(message, guild) {

            message.channel.send(new discord.RichEmbed().setImage("https://cdn.vox-cdn.com/thumbor/J0D6YqKKwCqNY2zaej_MEUlT-oo=/3x0:1265x710/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/39977666/fuckyou.0.0.jpg"));
        }
    }),
    new Command({
        name: "dick",
        desc: "(no description)",
        type: "command",
        match: "dick",
        call: function(message, guild) {

            message.channel.send(new discord.RichEmbed().setImage("https://actualconversationswithmyhusband.files.wordpress.com/2017/01/stop-being-a-dick-scott.gif"));
        }
    }),
    new Command({
        name: "wink",
        desc: "wonk",
        type: "command",
        match: "wink",
        call: function(message, guild) {
            
            message.reply("**wonk**");
        }
    }),
    new Command({
        name: "coin flip",
        desc: "(no description)",
        type: "command",
        match: "coin",
        call: function(message, guild) {
            
            message.reply(Math.floor(Math.random() * 2) === 0 ? "heads" : "tails");
        }
    }),
    new Command({
        name: "dice",
        desc: "(no description)",
        type: "command",
        match: "dice",
        call: function(message, guild) {
         
            message.reply(Math.floor(Math.random() * 6) + 1);
        }
    }),
    new Command({
        name: "rps",
        desc: "(no description)",
        type: "command",
        match: "rps",
        call: function(message, guild) {
            
            const rand = Math.floor(Math.random() * 3);
            message.reply(rand === 0 ? "Rock" : rand === 1 ? "Paper" : "Scissors");
        }
    }),
    new Command({
        name: "nk",
        desc: "(no description)",
        type: "",
        match: "",
        call: function(message, guild) {
            
            // temp
        }
    }),
    new Command({
        name: "gif",
        desc: "(no description)",
        type: "",
        match: "",
        call: function(message, guild) {

            // temp
        }
    }),
    new Command({
        name: "im baaaaaaack",
        desc: "(no description)",
        type: "command",
        match: "back",
        call: function(message, guild) {
            
            message.channel.send("<:imback:403307515645001748> <@" + message.author.id + ">" + " is baaaaaaack!");
        }
    }),
    new Command({
        name: "pie",
        desc: "(no description)",
        type: "",
        match: "",
        call: function(message, guild) {
            
        }
    }),
    new Command({
        name: "hmmm",
        desc: "(no description)",
        type: "",
        match: "",
        call: function(message, guild) {
            
        }
    }),
    new Command({
        name: "fm",
        desc: "(no description)",
        type: "",
        match: "",
        call: function(message, guild) {
            
        }
    }),
    new Command({
        name: "love",
        desc: "(no description)",
        type: "",
        match: "",
        call: function(message, guild) {
            
        }
    }),
    new Command({
        name: "butters",
        desc: "(no description)",
        type: "",
        match: "",
        call: function(message, guild) {
            
        }
    })
];

module.exports = commands;
