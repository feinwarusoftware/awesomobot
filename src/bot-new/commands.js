"use strict";

const discord = require("discord.js");
const moment = require("moment");
const momentTz = require("moment-timezone");
const path = require("path");

const utils = require("./utils");
const spnav = require("./api/spnav");
const lastfm = require("./api/lastfm");
const logConstants = utils.logger;
const logger = utils.globLogger;

const jimp = require("jimp");

// EXPERIMENTAL
const vm = require("vm");
//

let cachedeplist;

class Command {
    constructor(data) {
        this.data = data;
    }
    check(client, message, guild) {

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

        //
        let defaultGroup;
        for (let i = 0; i < guild.groups.length; i++) {
            if (guild.groups[i].name === "def") {
                defaultGroup = guild.groups[i];
                break;
            }
        }
        //

        //groups
        let current = guild.commands.find(e => {
            return e.name == this.data.name;
        });
        if (current === undefined) {
            if (defaultGroup === undefined) {
                logger.log(logConstants.LOG_DEBUG, "no local group data found for command, skipping group check");
                return true;
            }
            current = {
                name: this.data.name,
                group: defaultGroup.name
            }
        }

        if (current.group == "") {
            logger.log(logConstants.LOG_DEBUG, "group data not specified, skipping group check");
            return true;
        }

        let group = guild.groups.find(e => {
            return e.name == current.group;
        });
        if (group === undefined) {
            logger.log(logConstants.LOG_DEBUG, "group specified not found, failing command check");
            return false;
        }

        let inherits = [];
        for (let i = 0; i < group.inherits.length; i++) {
            for (let j = 0; j < guild.groups.length; j++) {
                if (group.inherits[i] === guild.groups[j].name) {
                    inherits.push(guild.groups[j]);
                }
            }
        }

        if (!inherits || inherits.length != group.inherits.length) {
            logger.log(logConstants.LOG_DEBUG, "inherited group(s) not found, failing command check");
            return false;
        }

        inherits.unshift(group);

        let exclusive = {
            channels: [],
            roles: [],
            members: [],
            badges: []
        };
        let inclusive = {
            channels: [],
            roles: [],
            members: [],
            badges: []
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
            // Badges.
            excl = true;
            for (let j = 0; j < inherits[i].badges.length; j++) {
                if (inherits[i].badges[j].target == "*") {
                    excl = inherits[i].badges[j].allow;
                    break;
                }
            }
            for (let j = 0; j < inherits[i].badges.length; j++) {
                if (inherits[i].badges[j].target == "*") {
                    continue;
                }
                let found = false;
                if (excl) {
                    for (let k = 0; k < exclusive.badges.length; k++) {
                        if (exclusive.badges[k].target == inherits[i].badges[j].target) {
                            exclusive.badges[k].allow = inherits[i].badges[j].allow;
                            found = true;
                        }
                    }
                    if (!found) {
                        exclusive.badges.push(inherits[i].badges[j]);
                    }
                } else {
                    for (let k = 0; k < inclusive.badges.length; k++) {
                        if (inclusive.badges[k].target == inherits[i].badges[j].target) {
                            inclusive.badges[k].allow = inherits[i].badges[j].allow;
                            found = true;
                        }
                    }
                    if (!found) {
                        inclusive.badges.push(inherits[i].badges[j]);
                    }
                }
            }
        }

        logger.log(logConstants.LOG_DEBUG, exclusive);
        logger.log(logConstants.LOG_DEBUG, inclusive);

        // Channels.
        let allow = false;
        let found = false;
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
            // inform the suer that they can't run the command, only works if the type === command
            if (this.data.type === "command") {
                message.reply(`you don't have permission to run the '**${message.content.split(" ")[0]}**' command in this channel`);
            }
            return false;
        }
        allow = false;
        found = false;
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
            // inform the suer that they can't run the command, only works if the type === command
            if (this.data.type === "command") {
                message.reply(`you don't have permission to run the '**${message.content.split(" ")[0]}**' command in this channel`);
            }
            return false;
        }
        // Roles.
        allow = false;
        found = false;
        for (let i = 0; i < exclusive.roles.length; i++) {
            //found = false;
            if (message.member.roles.get(exclusive.roles[i].target)) {
                if (exclusive.roles[i].allow === true) {
                    allow = true;
                }
                found = true;
            }
        }
        if (!found) {
            allow = true;
            logger.log(logConstants.LOG_DEBUG, "role exclusive not found");
        }
        if (!allow) {
            logger.log(logConstants.LOG_DEBUG, "failing command check on role exclusive");
            // inform the suer that they can't run the command, only works if the type === command
            if (this.data.type === "command") {
                message.reply(`you don't have permission to run the '**${message.content.split(" ")[0]}**' command with your current roles`);
            }
            return false;
        }
        allow = false;
        found = false;
        for (let i = 0; i < inclusive.roles.length; i++) {
            //found = false;
            if (message.member.roles.get(inclusive.roles[i].target)) {
                if (inclusive.roles[i].allow === true) {
                    allow = true;
                }
                found = true;
            }
        }
        if (!found) {
            allow = false;
            logger.log(logConstants.LOG_DEBUG, "role inclusive not found");
        }
        if (!allow && inclusive.roles.length != 0) {
            logger.log(logConstants.LOG_DEBUG, "failing command check on role exclusive");
            // inform the suer that they can't run the command, only works if the type === command
            if (this.data.type === "command") {
                message.reply(`you don't have permission to run the '**${message.content.split(" ")[0]}**' command with your current roles`);
            }
            return false;
        }
        // Members.
        allow = false;
        found = false;
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
            // inform the suer that they can't run the command, only works if the type === command
            if (this.data.type === "command") {
                message.reply(`you don't have permission to run the '**${message.content.split(" ")[0]}**' command`);
            }
            return false;
        }
        allow = false;
        found = false;
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
            // inform the suer that they can't run the command, only works if the type === command
            if (this.data.type === "command") {
                message.reply(`you don't have permission to run the '**${message.content.split(" ")[0]}**' command`);
            }
            return false;
        }
        // Badges.
        const guildMember = guild.members.find(e => {
            return e.id === message.author.id;
        });
        if (guildMember === undefined && (exclusive.badges.length > 0 || inclusive.badges.length > 0)) {
            logger.log(logConstants.LOG_DEBUG, "failing command check on badges");
            // inform the suer that they can't run the command, only works if the type === command
            if (this.data.type === "command") {
                message.reply(`you don't have permission to run the '**${message.content.split(" ")[0]}**' command with your current badges`);
            }
            return false;
        }
        allow = false;
        found = false;
        for (let i = 0; i < exclusive.badges.length; i++) {
            found = false;
            if (guildMember.badges.find(e => {
                    return e.name === exclusive.badges[i].target;
                }) !== undefined) {
                allow = exclusive.badges[i].allow;
                found = true;
            }
            if (found === false) {
                allow = true;
                logger.log(logConstants.LOG_DEBUG, "badge exclusive not found");
            }
            if (allow === false) {
                logger.log(logConstants.LOG_DEBUG, "failing command check on badge exclusive");
                // inform the suer that they can't run the command, only works if the type === command
                if (this.data.type === "command") {
                    message.reply(`you don't have permission to run the '**${message.content.split(" ")[0]}**' command with your current badges`);
                }
                return false;
            }
        }
        allow = false;
        found = false;
        for (let i = 0; i < inclusive.badges.length; i++) {
            found = false;
            if (guildMember.badges.find(e => {
                    return e.name === inclusive.badges[i].target;
                }) !== undefined) {
                allow = inclusive.badges[i].allow;
                found = true;
            }
            if (found === false) {
                allow = false;
                logger.log(logConstants.LOG_DEBUG, "badge inclusive not found");
            }
            if (allow === false && inclusive.badges.length !== 0) {
                logger.log(logConstants.LOG_DEBUG, "failing command check on badge inclusive");
                // inform the suer that they can't run the command, only works if the type === command
                if (this.data.type === "command") {
                    message.reply(`you don't have permission to run the '**${message.content.split(" ")[0]}**' command with your current badges`);
                }
                return false;
            }
        }

        logger.log(logConstants.LOG_DEBUG, "command check passed");

        return true;
    }
    _checkPrefix(message, guild, match) {

        switch (this.data.type) {
            case "command":
                return message.content.split(" ")[0].toLowerCase() == (guild.settings.prefix + match.toLowerCase());
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
    call(client, message, guild) {
        logger.log(logConstants.LOG_DEBUG, "calling command");
        this.data.call(client, message, guild);
    }
}

const commands = [
    new Command({
        name: "one test boii",
        desc: "a test command for testing lol",
        type: "command",
        order: "any", // order: "any, first, last", - def = any
        continue: false, // continue: false, true, - def = false
        match: "test",
        call: function (client, message, guild) {

            message.channel.send("", {
                embed: {
                    title: "timer",
                    description: `${new Date().getHours()}h ${new Date().getMinutes()}m ${new Date().getSeconds()}s`
                }
            }).then(message => {

                timer(message);

            });

            function timer(message) {

                setTimeout(() => {

                    message.edit("", {

                        embed: {
                            title: "timer",
                            description: `${new Date().getHours()}h ${new Date().getMinutes()}m ${new Date().getSeconds()}s`
                        }

                    }).then(message => {

                        timer(message);

                    });

                }, 5000);
            }
        }
    }),
    new Command({
        name: "pd test",
        desc: "a test command for testing lol",
        type: "command",
        match: "cardtest",
        call: function (client, message, guild) {

            const text = message.content.split(" ")[1];
            if (text === undefined) {
                return;
            }

            jimp.read(path.join(__dirname, "assets", "card_base.png")).then(cardBase => {
                jimp.loadFont(path.join(__dirname, "assets", "font.fnt")).then(spFont => {

                    cardBase.print(spFont, 50, 370, text);

                    cardBase.write(path.join(__dirname, "assets", "temp.png"), () => {

                        message.channel.send("", {
                            file: path.join(__dirname, "assets", "temp.png")
                        });
                    });

                }).catch(error => {
                    console.log(error);
                });
            }).catch(error => {
                console.log(error);
            });
        }
    }),
    new Command({
        name: "activity position",
        desc: "shows your activity and that of two members above and below you",
        type: "command",
        match: "activepos",
        call: function (client, message, guild) {

            guild.members.sort((a, b) => {

                let activityA = a.stats.find(e => {
                    return e.name === "activity";
                });
                let activityB = b.stats.find(e => {
                    return e.name === "activity";
                });
                if (activityA === undefined) {
                    activityA = {
                        value: 0
                    }
                }
                if (activityB === undefined) {
                    activityB = {
                        value: 0
                    }
                }

                return activityB.value - activityA.value;
            });

            let embed = new discord.RichEmbed()
                .setColor(0x8bc34a)
                .setAuthor(`AWESOM-O // Activity ${message.author.username} +- 2`, "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");

            let memberIndex;
            for (let i = 0; i < guild.members.length; i++) {
                if (guild.members[i].id === message.author.id) {
                    memberIndex = i;
                    break;
                }
            }

            let start = memberIndex - 2 > 0 ? memberIndex - 2 : 0;
            let end = memberIndex + 2 > guild.members.length - 1 ? guild.members.length - 1 : memberIndex + 2;

            for (let i = start; i < end + 1; i++) {

                let member = message.guild.members.find(e => {
                    return e.id === guild.members[i].id;
                });
                if (member === undefined || member === null) {
                    member = {
                        user: {
                            username: "null"
                        }
                    };
                }

                let activity = guild.members[i].stats.find(e => {
                    return e.name === "activity";
                });
                if (activity === undefined || activity === null) {
                    break;
                }

                embed.addField(`${i === memberIndex ? `**#${i + 1}**` : `#${i + 1}`}`, `${i === memberIndex ? `**${member.user.username} - ${activity.value}**` : `${member.user.username} - ${activity.value}`}`);
            }

            message.channel.send(embed);
        }
    }),
    new Command({
        name: "activity top",
        desc: "shows the top 5 member's activity",
        type: "command",
        match: ["activetop", "activelist"],
        call: function (client, message, guild) {

            guild.members.sort((a, b) => {

                let activityA = a.stats.find(e => {
                    return e.name === "activity";
                });
                let activityB = b.stats.find(e => {
                    return e.name === "activity";
                });
                if (activityA === undefined) {
                    activityA = {
                        value: 0
                    }
                }
                if (activityB === undefined) {
                    activityB = {
                        value: 0
                    }
                }

                return activityB.value - activityA.value;
            });

            let embed = new discord.RichEmbed()
                .setColor(0x8bc34a)
                .setAuthor("AWESOM-O // Activity Top 5", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");

            let topx = guild.members.length > 5 ? 5 : guild.members.length;

            for (let i = 0; i < topx; i++) {

                let member = message.guild.members.find(e => {
                    return e.id === guild.members[i].id;
                });
                if (member === undefined || member === null) {
                    member = {
                        user: {
                            username: "null"
                        }
                    };
                }

                let activity = guild.members[i].stats.find(e => {
                    return e.name === "activity";
                });
                if (activity === undefined || activity === null) {
                    continue;
                }

                embed.addField(`#${i + 1}`, `${member.user.username} - ${activity.value}`);
            }

            message.channel.send(embed);
        }
    }),
    new Command({
        name: "activity",
        desc: "shows your activity",
        type: "command",
        match: "activeme",
        call: function (client, message, guild) {

            let member = guild.members.find(e => {
                return e.id === message.author.id;
            });
            if (member === undefined || member === null) {

                message.reply("your activity score is: 0");
                return;
            }

            let stat = member.stats.find(e => {
                return e.name === "activity";
            });
            if (stat === undefined || stat === null) {

                message.reply("your activity score is: 0");
                return;
            }

            message.reply(`your activity score is: ${stat.value}`);
        }
    }),
    //
    new Command({
        name: "shits position",
        desc: "shows your shits and that of two members above and below you",
        type: "command",
        match: "shitpos",
        call: function (client, message, guild) {

            guild.members.sort((a, b) => {

                let shitsA = a.stats.find(e => {
                    return e.name === "shits";
                });
                let shitsB = b.stats.find(e => {
                    return e.name === "shits";
                });
                if (shitsA === undefined) {
                    shitsA = {
                        value: 0
                    }
                }
                if (shitsB === undefined) {
                    shitsB = {
                        value: 0
                    }
                }

                return shitsB.value - shitsA.value;
            });

            let embed = new discord.RichEmbed()
                .setColor(0x8bc34a)
                .setAuthor(`AWESOM-O // Shits ${message.author.username} +- 2`, "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");

            let memberIndex;
            for (let i = 0; i < guild.members.length; i++) {
                if (guild.members[i].id === message.author.id) {
                    memberIndex = i;
                    break;
                }
            }

            let start = memberIndex - 2 > 0 ? memberIndex - 2 : 0;
            let end = memberIndex + 2 > guild.members.length - 1 ? guild.members.length - 1 : memberIndex + 2;

            for (let i = start; i < end + 1; i++) {

                let member = message.guild.members.find(e => {
                    return e.id === guild.members[i].id;
                });
                if (member === undefined || member === null) {
                    member = {
                        user: {
                            username: "null"
                        }
                    };
                }

                let shits = guild.members[i].stats.find(e => {
                    return e.name === "shits";
                });
                if (shits === undefined || shits === null) {
                    break;
                }

                embed.addField(`${i === memberIndex ? `**#${i + 1}**` : `#${i + 1}`}`, `${i === memberIndex ? `**${member.user.username} - ${shits.value}**` : `${member.user.username} - ${shits.value}`}`);
            }

            message.channel.send(embed);
        }
    }),
    new Command({
        name: "shits top",
        desc: "shows the top 5 member's shits",
        type: "command",
        match: ["shittop", "shitlist"],
        call: function (client, message, guild) {

            guild.members.sort((a, b) => {

                let shitsA = a.stats.find(e => {
                    return e.name === "shits";
                });
                let shitsB = b.stats.find(e => {
                    return e.name === "shits";
                });
                if (shitsA === undefined) {
                    shitsA = {
                        value: 0
                    }
                }
                if (shitsB === undefined) {
                    shitsB = {
                        value: 0
                    }
                }

                return shitsB.value - shitsA.value;
            });

            let embed = new discord.RichEmbed()
                .setColor(0x8bc34a)
                .setAuthor("AWESOM-O // Shits Top 5", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");

            let topx = guild.members.length > 5 ? 5 : guild.members.length;

            for (let i = 0; i < topx; i++) {

                let member = message.guild.members.find(e => {
                    return e.id === guild.members[i].id;
                });
                if (member === undefined || member === null) {
                    member = {
                        user: {
                            username: "null"
                        }
                    };
                }

                let shits = guild.members[i].stats.find(e => {
                    return e.name === "shits";
                });
                if (shits === undefined || shits === null) {
                    continue;
                }

                embed.addField(`#${i + 1}`, `${member.user.username} - ${shits.value}`);
            }

            message.channel.send(embed);
        }
    }),
    new Command({
        name: "shits",
        desc: "shows your shits",
        type: "command",
        match: "shitme",
        call: function (client, message, guild) {

            let member = guild.members.find(e => {
                return e.id === message.author.id;
            });
            if (member === undefined || member === null) {

                message.reply("your shit score is: 0");
                return;
            }

            let stat = member.stats.find(e => {
                return e.name === "shits";
            });
            if (stat === undefined || stat === null) {

                message.reply("your shit score is: 0");
                return;
            }

            message.reply(`your shit score is: ${stat.value}`);
        }
    }),
    //
    /*
    new Command({
        name: "one scripty boii",
        desc: "its ya big boii js",
        type: "command",
        match: "script",
        call: function (client, message, guild) {

            if (message.content.indexOf(" ") === -1) {
                message.reply("please enter a message id after the command");
                return;
            }

            const id = message.content.substring(message.content.indexOf(" ") + 1);

            const channels = message.guild.channels.array();
            for (let i = 0; i < channels.length; i++) {
                if (channels[i].type !== "text" || channels[i].name !== "scripts") {
                    continue;
                }
                channels[i].fetchMessage(id).then(script => {

                    //
                    let code = script.content;

                    if (code.startsWith("```js")) {
                        code = code.substring(5);
                    }
                    if (code.startsWith("```")) {
                        code = code.substring(3);
                    }
                    if (code.endsWith("```")) {
                        code = code.substring(0, code.length - 3)
                    }
                    
                    // Node sandbox.
                    const sandbox = {
                        message: message
                    };

                    vm.createContext(sandbox);

                    vm.runInContext(`"use strict"\n${code}`, sandbox);
                    //

                }).catch(error => {
                    message.reply(`message with id: ${id}, not found in channel #${channels[i].name}`);
                });
            }
        }
    }),
    */
    /*
    new Command({
        name: "addscript",
        desc: "adds a script to the bot",
        type: "command",
        match: "addscript",
        call: function (client, message, guild) {

            const args = message.content.split(" ");
            if (args[1] === undefined) {
                message.reply("you need to specify the word to bind to");
                return;
            }
            if (args[2] === undefined) {
                message.reply("you need to write a script there boii");
                return;
            }

            const name = args[1];
            const value = message.content.substring(args[0].length + args[1].length + 2);

            let script = guild.scripts.find(e => {
                return e.name === name;
            });
            if (script !== undefined) {
                if (message.author.id === script.authorId) {
                    message.reply(`there is already a script with this name, you can remove it with '**${guild.settings.prefix}remscript ${name}**'`);
                } else {
                    const member = message.guild.members.find(e => {
                        return e.id === script.authorId;
                    });
                    if (member === undefined || member === null) {
                        message.reply(`there is already a '**${name}**' script and awesomo doesn't know who it belongs to`);
                        return;
                    }
                    message.reply(`there is already a '**${name}**' script belonging to **${member.user.username}**`);
                }
                return;
            }

            guild.scripts.push({
                name: name,
                authorId: message.author.id,
                value: value
            });

            message.reply(`successfully bound '**${name}**' to '**${value}**'`);
        }
    }),
    new Command({
        name: "remscript",
        desc: "removes a script from the bot",
        type: "command",
        match: "remscript",
        call: function (client, message, guild) {

            const args = message.content.split(" ");
            if (args[1] === undefined) {
                message.reply("you need to specify the word that you're trying to unbind");
                return;
            }

            const name = args[1];

            let script = guild.scripts.find(e => {
                return e.name === name;
            });
            if (script === undefined) {
                message.reply(`'**${name}**' isn't bound to anything`);
                return;
            }

            if (message.author.id === script.authorId) {
                for (let i = 0; i < guild.scripts.length; i++) {
                    if (guild.scripts[i].name === name) {
                        guild.scripts.splice(i, 1);
                        message.reply(`successfully unbound '**${name}**'`);
                        return;
                    }
                }
            } else {
                const member = message.guild.members.find(e => {
                    return e.id === script.authorId;
                });
                if (member === undefined || member === null) {
                    message.reply(`the '**${name}**' script belongs to someone else but awesomo doesn't know who it is`);
                    return;
                }
                message.reply(`the '**${name}**' script belongs to **${member.user.username}**, if you want it gone, please ask them to unbind it`);
                return;
            }

            message.reply(`looks like awesomo shit itself, blame dragon`);
        }
    }),
    */
    new Command({
        name: "echo",
        desc: "sends a message in discord",
        type: "command",
        match: "echo",
        call: function (client, message, guild) {

            const response = message.content.substring(message.content.indexOf(" ") + 1);

            //{embed} --author ya boii --description yay it werks!!! {then} sdfjpsdfps

            //{embed} --description sfoifhsoifh sdfsodf --whatever

            doStuff(0);

            function doStuff(start) {

                if (start === response.length) {
                    return;
                }

                let end = response.indexOf("{then}", start + 1);
                if (end === -1) {
                    end = response.length;
                }

                sendMessage(response.substring(start, end)).then(() => {

                    if (end === response.length) {
                        start = end;
                    } else {
                        start = end + 6;
                    }

                    doStuff(start);

                }).catch(error => {
                    message.reply(error);
                });
            }

            function sendMessage(response) {
                return new Promise((resolve, reject) => {
                    const embedIndex = response.indexOf("{embed}");
                    if (embedIndex === -1) {

                        const fileIndex = response.indexOf("{file}");
                        if (fileIndex === -1) {

                            message.channel.send(response.trim()).then(() => {
                                return resolve();
                            }).catch(error => {
                                return reject(error);
                            });
                        } else {

                            message.channel.send("", {
                                file: response.substring(fileIndex + 6).trim()
                            }).then(() => {
                                return resolve();
                            }).catch(error => {
                                return reject(error);
                            });
                        }
                    } else {
                        let embed = new discord.RichEmbed();

                        const fields = [
                            "author",
                            "color",
                            "description",
                            "footer",
                            "image",
                            "thumbnail"
                        ];

                        function findNext(start) {
                            let index = -1;
                            for (let i = 0; i < fields.length; i++) {
                                let pos = response.indexOf("--" + fields[i], start)
                                if (pos !== -1) {

                                    if (index === -1) {
                                        index = pos;
                                    }

                                    if (pos < index) {
                                        index = pos;
                                    }
                                }
                            }
                            return index;
                        }

                        let start = findNext(0);
                        while (start !== response.length) {

                            let end = findNext(start + 1);
                            if (end === -1) {
                                end = response.length;
                            }

                            let field = response.substring(start + 2, response.indexOf(" ", start));
                            if (field === -1) {
                                reject("well the bot fucking broke");
                            }

                            let index;
                            for (let i = 0; i < fields.length; i++) {
                                if (fields[i] === field) {
                                    index = i;
                                    break;
                                }
                            }
                            if (index === undefined) {
                                reject("well the bot fucking broke");
                            }

                            let value = response.substring(start + fields[index].length + 2, end).trim();

                            switch (fields[index]) {
                                case "author":
                                    embed.setAuthor(value);
                                    break;
                                case "color":
                                    embed.setColor(value);
                                    break;
                                case "description":
                                    embed.setDescription(value);
                                    break;
                                case "footer":
                                    embed.setFooter(value);
                                    break;
                                case "image":
                                    embed.setImage(value);
                                    break;
                                case "thumbnail":
                                    embed.setThumbnail(value);
                                    break;
                            }

                            start = end;
                        }

                        if (embed.description !== undefined) {
                            embed.description = embed.description.replace(/\\n/g, "\n");
                        }

                        message.channel.send(embed).then(() => {
                            return resolve();
                        }).catch(error => {
                            return reject(error);
                        });
                    }
                })
            }
        }
    }),
    new Command({
        name: "bind",
        desc: "binds a command to a certain word",
        type: "command",
        match: "bind",
        call: function (client, message, guild) {

            const args = message.content.split(" ");
            if (args[1] === undefined) {
                message.reply("you need to specify the word to bind to");
                return;
            }
            if (args[2] === undefined) {
                message.reply("you need to specify the command that you want to bind");
                return;
            }

            const name = args[1];
            const value = message.content.substring(args[0].length + args[1].length + 2);

            let binding = guild.bindings.find(e => {
                return e.name === name;
            });
            if (binding !== undefined) {
                if (message.author.id === binding.authorId) {
                    message.reply(`there is already a binding with this name, you can remove it with '**${guild.settings.prefix}unbind ${name}**'`);
                } else {
                    const member = message.guild.members.find(e => {
                        return e.id === binding.authorId;
                    });
                    if (member === undefined || member === null) {
                        message.reply(`there is already a '**${name}**' binding and awesomo doesn't know who it belongs to`);
                        return;
                    }
                    message.reply(`there is already a '**${name}**' binding belonging to **${member.user.username}**`);
                }
                return;
            }

            guild.bindings.push({
                name: name,
                authorId: message.author.id,
                value: value
            });

            message.reply(`successfully bound '**${name}**' to '**${value}**'`);
        }
    }),
    new Command({
        name: "unbind",
        desc: "unbinds a command from a certain word",
        type: "command",
        match: "unbind",
        call: function (client, message, guild) {

            const args = message.content.split(" ");
            if (args[1] === undefined) {
                message.reply("you need to specify the word that you're trying to unbind");
                return;
            }

            const name = args[1];

            let binding = guild.bindings.find(e => {
                return e.name === name;
            });
            if (binding === undefined) {
                message.reply(`'**${name}**' isn't bound to anything`);
                return;
            }

            if (message.author.id === binding.authorId) {
                for (let i = 0; i < guild.bindings.length; i++) {
                    if (guild.bindings[i].name === name) {
                        guild.bindings.splice(i, 1);
                        message.reply(`successfully unbound '**${name}**'`);
                        return;
                    }
                }
            } else {
                const member = message.guild.members.find(e => {
                    return e.id === binding.authorId;
                });
                if (member === undefined || member === null) {
                    message.reply(`the '**${name}**' binding belongs to someone else but awesomo doesn't know who it is`);
                    return;
                }
                message.reply(`the '**${name}**' binding belongs to **${member.user.username}**, if you want it gone, please ask them to unbind it`);
                return;
            }

            message.reply(`looks like awesomo shit itself, blame dragon`);
        }
    }),
    new Command({
        name: "give a badge",
        desc: "a test command for testing xd",
        type: "command",
        match: ["givebadge", "badgegive"],
        call: function (client, message, guild) {

            const args = message.content.split(" ");
            if (args[1] === undefined) {
                message.reply("you're missing the member's id");
                return;
            }
            if (args[2] === undefined) {
                message.reply("you're missing the badge name");
                return;
            }

            const memberId = args[1];
            const badgeName = message.content.substring(message.content.indexOf(" ", args[0].length + 1) + 1);

            // Make sure the member actually exists.
            const guildMember = message.guild.members.find(e => {
                return e.id === memberId;
            });
            if (guildMember === undefined) {
                message.reply("the member that you're trying to give a badge to isn't in this guild");
                return;
            }

            let memberIndex;
            for (let i = 0; i < guild.members.length; i++) {
                if (guild.members[i].id === memberId) {
                    memberIndex = i;
                    break;
                }
            }
            if (memberIndex === undefined) {
                guild.members.push({
                    id: memberId,
                    stats: [],
                    badges: []
                });
                memberIndex = guild.members.length - 1;
            }

            let badgeIndex;
            for (let i = 0; i < guild.members[memberIndex].badges.length; i++) {
                if (guild.members[memberIndex].badges[i].name === badgeName) {
                    badgeIndex = i;
                    break;
                }
            }
            if (badgeIndex === undefined) {
                guild.members[memberIndex].badges.push({
                    name: badgeName,
                    value: true
                });
                badgeIndex = guild.members[memberIndex].badges.length - 1;

                message.reply(`**${guildMember.user.username}** now has the '**${badgeName}**' badge`);
                return;
            }

            message.reply(`**${guildMember.user.username}** already has the '**${badgeName}**' badge`);
        }
    }),
    new Command({
        name: "take a badge",
        desc: "a test command for testing xd",
        type: "command",
        match: ["takebadge", "badgetake"],
        call: function (client, message, guild) {

            const args = message.content.split(" ");
            if (args[1] === undefined) {
                message.reply("you're missing the member's id");
                return;
            }
            if (args[2] === undefined) {
                message.reply("you're missing the badge name");
                return;
            }

            const memberId = args[1];
            const badgeName = message.content.substring(message.content.indexOf(" ", args[0].length + 1) + 1);

            // Make sure the member actually exists.
            const guildMember = message.guild.members.find(e => {
                return e.id === memberId;
            });
            if (guildMember === undefined) {
                message.reply("the member that you're trying to give a badge to isn't in this guild");
                return;
            }

            let memberIndex;
            for (let i = 0; i < guild.members.length; i++) {
                if (guild.members[i].id === memberId) {
                    memberIndex = i;
                    break;
                }
            }
            if (memberIndex === undefined) {
                guild.members.push({
                    id: memberId,
                    stats: [],
                    badges: []
                });
                memberIndex = guild.members.length - 1;
            }

            let badgeIndex;
            for (let i = 0; i < guild.members[memberIndex].badges.length; i++) {
                if (guild.members[memberIndex].badges[i].name === badgeName) {
                    badgeIndex = i;
                    break;
                }
            }
            if (badgeIndex === undefined) {
                message.reply(`**${guildMember.user.username}** doesn't have the '**${badgeName}**' badge. I can't take away something they don't have`);
                return;
            }

            guild.members[memberIndex].badges.splice(badgeIndex, 1);

            message.reply(`**${guildMember.user.username}** has had their '**${badgeName}**' badge taken away`);
        }
    }),
    new Command({
        name: "list all badges",
        desc: "a test command for testing xd",
        type: "command",
        match: ["listbadge", "badgelist"],
        call: function (client, message, guild) {

            const args = message.content.split(" ");

            let memberId = args[1];
            if (memberId === undefined) {
                memberId = message.author.id;
            }

            // Make sure the member actually exists.
            const guildMember = message.guild.members.find(e => {
                return e.id === memberId;
            });
            if (guildMember === undefined) {
                message.reply("the member that you're trying to give a badge to isn't in this guild");
                return;
            }

            let memberIndex;
            for (let i = 0; i < guild.members.length; i++) {
                if (guild.members[i].id === memberId) {
                    memberIndex = i;
                    break;
                }
            }
            if (memberIndex === undefined) {
                message.reply(`${guildMember.id === message.author.id ? "you don't" : `**${guildMember.user.username}** doesn't`} have any badges`);
                return;
            }
            if (guild.members[memberIndex].badges.length === 0) {
                message.reply(`${guildMember.id === message.author.id ? "you don't" : `**${guildMember.user.username}** doesn't`} have any badges`);
                return;
            }

            let badges = "";
            for (let i = 0; i < guild.members[memberIndex].badges.length; i++) {
                if (i === guild.members[memberIndex].badges.length - 1) {
                    badges += `**${guild.members[memberIndex].badges[i].name}**`;
                } else {
                    badges += `**${guild.members[memberIndex].badges[i].name}**, `;
                }
            }

            message.reply(`${guildMember.id === message.author.id ? "you have" : `**${guildMember.user.username}** has`} the following badges: ${badges}`);
        }
    }),
    new Command({
        name: "activity counter",
        desc: "increments the activity counter if the message doesnt match a command",
        type: "contains",
        order: "last",
        continue: true,
        match: "",
        call: function (client, message, guild) {

            // Ignores towelbot and betabot.
            if (message.author.id === "431126638625816587" || message.author.id === "372462428690055169") {
                return;
            }

            let memberIndex;
            for (let i = 0; i < guild.members.length; i++) {
                if (guild.members[i].id === message.author.id) {
                    memberIndex = i;
                    break;
                }
            }
            if (memberIndex === undefined) {
                guild.members.push({
                    id: message.author.id,
                    stats: []
                });
                memberIndex = guild.members.length - 1;
            }

            let statIndex;
            for (let i = 0; i < guild.members[memberIndex].stats.length; i++) {
                if (guild.members[memberIndex].stats[i].name === "activity") {
                    statIndex = i;
                    break;
                }
            }
            if (statIndex === undefined) {
                guild.members[memberIndex].stats.push({
                    name: "activity",
                    value: 0
                });
                statIndex = guild.members[memberIndex].stats.length - 1;
            }

            guild.members[memberIndex].stats[statIndex].value++;
        }
    }),
    new Command({
        name: "shit counter",
        desc: "increments the shit counter if the message contains the word shit, ignores commands",
        type: "contains",
        order: "last",
        continue: true,
        match: "shit",
        call: function (client, message, guild) {

            let memberIndex;
            for (let i = 0; i < guild.members.length; i++) {
                if (guild.members[i].id === message.author.id) {
                    memberIndex = i;
                    break;
                }
            }
            if (memberIndex === undefined) {
                guild.members.push({
                    id: message.author.id,
                    stats: []
                });
                memberIndex = guild.members.length - 1;
            }

            let statIndex;
            for (let i = 0; i < guild.members[memberIndex].stats.length; i++) {
                if (guild.members[memberIndex].stats[i].name === "shits") {
                    statIndex = i;
                    break;
                }
            }
            if (statIndex === undefined) {
                guild.members[memberIndex].stats.push({
                    name: "shits",
                    value: 0
                });
                statIndex = guild.members[memberIndex].stats.length - 1;
            }

            guild.members[memberIndex].stats[statIndex].value++;
        }
    }),
    new Command({
        name: "wikia search",
        desc: "Searches wikia for the query that you entered. Currently only works with the southpark fandom",
        type: "command",
        match: ["w", "wiki", "wikia", "search"],
        call: function (client, message, guild) {

            if (message.content.split(" ")[1] === undefined) {
                message.reply(`you're missing a query to search for, if you want to search for a random episode, use: ${guild.settings.prefix}r`);
            }

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
        call: function (client, message, guild) {

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
        call: function (client, message, guild) {

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
        call: function (client, message, guild) {

            message.reply("https://reddit.com/r/southpark/");
        }
    }),
    new Command({
        name: "microaggression",
        desc: "(no description)",
        type: "command",
        match: "micro",
        call: function (client, message, guild) {

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
        call: function (client, message, guild) {

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
        call: function (client, message, guild) {

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
        call: function (client, message, guild) {

            message.reply("Repects have been paid");
        }
    }),
    new Command({
        name: "times",
        desc: "(no description)",
        type: "command",
        match: "times",
        call: function (client, message, guild) {

            message.channel.send(new discord.RichEmbed()
                .setColor(0x8bc34a)
                .setAuthor("AWESOM-O // Times")
                .addField("PST", momentTz().tz("America/Los_Angeles").format("Do MMMM YYYY, h:mm:ss a"))
                .addField("EST", momentTz().tz("America/New_York").format("Do MMMM YYYY, h:mm:ss a"))
                .addField("GMT", momentTz().tz("Europe/Dublin").format("Do MMMM YYYY, h:mm:ss a"))
                .addField("CST", momentTz().tz("Asia/Hong_Kong").format("Do MMMM YYYY, h:mm:ss a"))
                .setThumbnail("https://cdn.discordapp.com/attachments/379432139856412682/401485874040143872/hmmwhatsthetime.png"));
        }
    }),
    new Command({
        name: "batman",
        desc: "(no description)",
        type: "command",
        match: "batman",
        call: function (client, message, guild) {

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
        call: function (client, message, guild) {

            const memberMessages = ["I member!", "Ohh yeah I member!", "Me member!", "Ohh boy I member that", "I member!, do you member?"];
            message.reply(memberMessages[Math.floor(Math.random() * memberMessages.length)]);
        }
    }),
    new Command({
        name: "i broke the dam",
        desc: "(no description)",
        type: "startswith",
        match: "i broke the dam",
        call: function (client, message, guild) {

            message.reply("No, I broke the dam");
        }
    }),
    new Command({
        name: "movie idea",
        desc: "(no description)",
        type: "command",
        match: "movieidea",
        call: function (client, message, guild) {

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
        call: function (client, message, guild) {

            message.reply("https://www.reddit.com/r/suicideprevention/comments/6hjba7/info_suicide_prevention_hotlines/");
        }
    }),
    new Command({
        name: "info",
        desc: "(no description)",
        type: "command",
        match: "info",
        call: function (client, message, guild) {

            message.channel.send(new discord.RichEmbed()
                .setColor(0x8bc34a)
                .setAuthor("AWESOM-O // Info", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .setThumbnail("https://vignette.wikia.nocookie.net/southpark/images/6/6d/Awesomo-0.png/revision/latest?cb=20170601014435")
                .setTitle("Your all purpose South Park Bot!")
                .addField("-help for a list of commands", "If a command is missing, feel free to inform us")
                .addField("Crafted with love by Dragon1320, Mattheous and TowelRoyale. ♥")
                .addField("Online Dashboard", "https://awesomobot.com/")
                .setFooter("This bot is pretty schweet!"));
        }
    }),
    new Command({
        name: "help",
        desc: "(no description)",
        type: "command",
        match: "help",
        call: function (client, message, guild) {

            message.channel.send(new discord.RichEmbed()
                .setColor(0x8bc34a)
                .setAuthor("AWESOM-O // Help", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .setThumbnail("https://images.emojiterra.com/twitter/512px/1f914.png")
                .addField("List of Commands", "https://awesomobot.com/commands/")
                .setFooter("These dev people are very helpful!"));
        }
    }),
    new Command({
        name: "harvest",
        desc: "(no description)",
        type: "command",
        match: "harvest",
        call: function (client, message, guild) {

            message.channel.send(new discord.RichEmbed()
                .setColor(0x8bc34a)
                .setAuthor("AWESOM-O // Harvest", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .setImage("http://diymag.com/media/img/Artists/D/Dua_Lipa/_1500x1000_crop_center-center_75/Dua-Lipa-4-lo-res-1.jpg")
                .setTitle("Dua Lipa")
                .setDescription("Dua Lipa is an English singer, songwriter, and model. Her musical career began at age 14, when she began covering songs by other artists on YouTube. In 2015, she was signed with Warner Music Group and released her first single soon after. In December 2016, a documentary about Lipa was commissioned by The Fader magazine, titled See in Blue.")
                .setFooter("Ave, ave versus christus!")
                .setURL("https://youtu.be/6H3UiwU1N5I?t=3m2s"));
        }
    }),
    new Command({
        name: "join team",
        desc: "(no description)",
        type: "command",
        match: "join",
        call: function (client, message, guild) {

            const teams = guild.settings.teamRoles;

            const targetAlias = message.content.split(" ")[1];
            if (targetAlias === undefined) {
                message.reply("You didn't specify the team that you want to join");
                return;
            }

            const targetTeam = teams.find(e => {
                return e.alias === targetAlias;
            });
            if (targetTeam === undefined) {
                message.reply("The team that you're trying to join doesn't exist");
                return;
            }

            const roles = message.guild.roles.array();
            const targetRole = roles.find(e => {
                return e.id === targetTeam.id;
            });
            if (targetRole === undefined) {
                message.reply("The team that you're trying to join doesn't exist");
                return;
            }

            for (let i = 0; i < teams.length; i++) {
                if (teams[i].id === targetTeam.id) {
                    continue;
                }
                const otherRole = message.member.roles.array().find(e => {
                    return e.id === teams[i].id;
                });
                if (otherRole !== undefined) {
                    message.member.removeRole(otherRole);
                    break;
                }
            }

            message.member.addRole(targetRole).then(() => {
                message.reply(`you are now part of: **${targetRole.name}**`);
            }).catch(error => {
                message.reply(`looks like awesomo died, his last words were: ${error}`);
            });
        }
    }),
    new Command({
        name: "leave team",
        desc: "(no description)",
        type: "command",
        match: "civilwar",
        call: function (client, message, guild) {

            const teams = guild.settings.teamRoles;

            for (let i = 0; i < teams.length; i++) {
                const role = message.member.roles.array().find(e => {
                    return e.id === teams[i].id;
                });
                if (role !== undefined) {
                    message.member.removeRole(role).then(() => {
                        message.reply(`you are no longer part of: **${role.name}**`);
                    }).catch(error => {
                        message.reply(`looks like awesomo died, his last words were: ${error}`);
                    });
                    return;
                }
            }

            message.reply("you can't leave a group if you're not part of any");
        }
    }),
    new Command({
        name: "fuck yourself",
        desc: "(no description)",
        type: "command",
        match: "fuckyourself",
        call: function (client, message, guild) {

            message.channel.send(new discord.RichEmbed().setImage("http://1.images.southparkstudios.com/blogs/southparkstudios.com/files/2014/09/1801_5a.gif"));
        }
    }),
    new Command({
        name: "fuck you",
        desc: "(no description)",
        type: "command",
        match: "fuckyou",
        call: function (client, message, guild) {

            message.channel.send(new discord.RichEmbed().setImage("https://cdn.vox-cdn.com/thumbor/J0D6YqKKwCqNY2zaej_MEUlT-oo=/3x0:1265x710/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/39977666/fuckyou.0.0.jpg"));
        }
    }),
    new Command({
        name: "dick",
        desc: "(no description)",
        type: "command",
        match: "dick",
        call: function (client, message, guild) {

            message.channel.send(new discord.RichEmbed().setImage("https://actualconversationswithmyhusband.files.wordpress.com/2017/01/stop-being-a-dick-scott.gif"));
        }
    }),
    new Command({
        name: "wink",
        desc: "wonk",
        type: "command",
        match: "wink",
        call: function (client, message, guild) {

            message.reply("**wonk**");
        }
    }),
    new Command({
        name: "coin flip",
        desc: "(no description)",
        type: "command",
        match: "coin",
        call: function (client, message, guild) {

            message.reply(Math.floor(Math.random() * 2) === 0 ? "heads" : "tails");
        }
    }),
    new Command({
        name: "dice",
        desc: "(no description)",
        type: "command",
        match: "dice",
        call: function (client, message, guild) {

            message.reply(Math.floor(Math.random() * 6) + 1);
        }
    }),
    new Command({
        name: "rps",
        desc: "(no description)",
        type: "command",
        match: "rps",
        call: function (client, message, guild) {

            const rand = Math.floor(Math.random() * 3);
            message.reply(rand === 0 ? "Rock" : rand === 1 ? "Paper" : "Scissors");
        }
    }),
    new Command({
        name: "nk",
        desc: "(no description)",
        type: "",
        match: "",
        call: function (client, message, guild) {

            // temp
        }
    }),
    new Command({
        name: "gif",
        desc: "(no description)",
        type: "command",
        match: "gif",
        call: function (client, message, guild) {

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
    }),
    new Command({
        name: "im baaaaaaack",
        desc: "(no description)",
        type: "command",
        match: "back",
        call: function (client, message, guild) {

            message.channel.send("<:imback:403307515645001748> <@" + message.author.id + ">" + " is baaaaaaack!");
        }
    }),
    new Command({
        name: "oof",
        desc: "(no description)",
        type: "command",
        match: "oof",
        call: function (client, message, guild) {

            if (message.member.voiceChannel !== undefined && message.member.voiceChannel !== null) {

                let conn = client.voiceConnections.find(e => {
                    return e.channel.id;
                }, message.member.voiceChannel.id);

                if (conn !== undefined && conn !== null) {
                    let disp = conn.playFile("oof.mp3");
                    disp.on("end", () => {
                        conn.disconnect();
                    });
                } else {
                    message.member.voiceChannel.join().then(conn => {
                        let disp = conn.playFile("oof.mp3");
                        disp.on("end", () => {
                            conn.disconnect();
                        });
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
    }),
    new Command({
        name: "hmmm",
        desc: "(no description)",
        type: "command",
        match: "hmmm",
        call: function (client, message, guild) {

            message.reply("Things that make you go :thinking::thinking::thinking:");
        }
    }),
    new Command({
        name: "fm",
        desc: "(no description)",
        type: "command",
        match: "fm",
        call: function (client, message, guild) {

            const args = message.content.split(" ");
            if (args[1] === undefined) {
                message.reply("youre missing the username to look up");
                return;
            }
            if (args[2] === undefined && args[3] === undefined) {
                args[2] = "recent";
                args[3] = null;
            } else {
                if (args[2] === undefined) {
                    message.reply("youre missing either 'artists', 'albums', or 'tracks'");
                    return;
                }
                if (args[3] === undefined) {
                    message.reply("youre missing the time frame to look up, either 'week', 'month', or 'all'");
                    return;
                }
            }

            let method;

            switch (args[2]) {
                case "recent":
                    method = lastfm.USER_GET_RECENT_TRACKS;
                    break;
                case "artists":
                    method = lastfm.USER_GET_TOP_ARTISTS;
                    break;
                case "albums":
                    method = lastfm.USER_GET_TOP_ALBUMS;
                    break;
                case "tracks":
                    method = lastfm.USER_GET_TOP_TRACKS;
                    break;
                default:
                    message.reply(`'${args[2]}' is not a valid argument, choose either 'artists', 'albums', or 'tracks'`);
                    break;
            }

            let period;

            switch (args[3]) {
                case null:
                    period = null;
                    break;
                case "all":
                    period = lastfm.PERIOD_OVERALL;
                    break;
                case "month":
                    period = lastfm.PERIOD_MONTH;
                    break;
                case "week":
                    period = lastfm.PERIOD_WEEK;
                    break;
                default:
                    message.reply(`'${args[3]}' is not a valid argument, choose either 'week', 'month', or 'all'`);
                    break;
            }

            let options = {};
            options.user = args[1];
            options.method = method;
            options.limit = 5;
            if (period !== null) {
                options.period = period;
            }

            lastfm.makeApiRequest(options).then(response => {

                if (response.data.error !== undefined) {
                    message.reply("error making lastfm api request, check if you entered the user correctly");
                    return;
                }

                let topFieldName;
                if (args[2] === "recent") {
                    topFieldName = "recenttracks"
                } else {
                    topFieldName = `top${args[2]}`;
                }

                let scopeName;
                if (args[3] === null) {
                    scopeName = "track"
                } else {
                    scopeName = args[2].substring(0, args[2].length - 1);
                }

                let embed = new discord.RichEmbed()
                    .setColor(0x8bc34a)
                    .setAuthor("AWESOM-O // Last.fm", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                    .setThumbnail(response.data[topFieldName][scopeName][0].image[response.data[topFieldName][scopeName][0].image.length - 1]["#text"])
                    .setTitle(`last.fm ${args[2] === "recent" ? "" : "top"} ${args[3] === null ? "" : args[3]} ${args[2]}`)
                    .setFooter("View full stats on last.fm")
                    .setURL(`https://last.fm/user/${args[1]}`);

                for (let i = 0; i < response.data[topFieldName][scopeName].length; i++) {
                    embed.addField(response.data[topFieldName][scopeName][i].name, `${response.data[topFieldName][scopeName][i].playcount === undefined ? response.data[topFieldName][scopeName][i].artist["#text"] : response.data[topFieldName][scopeName][i].playcount + " plays"}`);
                }

                /*
                let embed = new discord.RichEmbed()
                    .setColor(0x8bc34a)
                    .setAuthor("AWESOM-O // Last.fm", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                    .setThumbnail(data[`top${args[2]}`][args[2].substring(0, args[2].length - 1)][0].image[data[`top${args[2]}`][args[2].substring(0, args[2].length - 1)][0].image.length - 1]["#text"])
                    .setTitle(`last.fm top ${args[3]} ${args[2]}`)
                    .setFooter("View full stats on last.fm")
                    .setURL(`https://last.fm/user/${args[1]}`);

                for (let i = 0; i < data[`top${args[2]}`][args[2].substring(0, args[2].length - 1)].length; i++) {
                    embed.addField(data[`top${args[2]}`][args[2].substring(0, args[2].length - 1)][i].name, `${data[`top${args[2]}`][args[2].substring(0, args[2].length - 1)][i].playcount} plays`);
                }
                */

                message.channel.send(embed);
            }).catch(error => {
                message.reply("error making lastfm api request");
            });
        }
    }),
    new Command({
        name: "love",
        desc: "(no description)",
        type: "command",
        match: "love",
        call: function (client, message, guild) {

            const chefquotes = [
                "I'm very proud of you, children. Let's all go home and find a nice white woman to make love to.",
                "Stan, sometimes God takes those closest to us.",
                "Well, look at it this way: if you want to make a baby cry, first you give it a lollipop.",
                "Look, schools are teaching condom use to younger and younger students each day! But sex isn't something that should be taught in textbooks and diagrams. Sex is emotional and spiritual. It needs to be taught by family. I know it can be hard, parents, but if you leave it up to the schools to teach sex to kids, you don't know who they're learning it from. It could be from someone who doesn't know, someone who has a bad opinion of it, or even a complete pervert.",
                "It's very simple, children; The right time to start having sex is 17.",
                "Yeah, I don't think ol' Mackey knows a hymen from a hysterectomy. And Ms. Choksondik? I'd be surprised she's ever been laid in her life.",
                "Dag-nabbit children! How come every time you come in here you've got to be asking me questions I shouldn't be answering? \"Chef, what's a clitoris? What's a lesbian, Chef? How come they call it a rim job Chef?\". For once, can't you kids come in here and say \"Hey Chef, nice day isn't it\"?",
                "Well look at you cute little crackers with your money and your fancy clothes and your cell phones. It's almost like you were... Oh my God! Children, what have I told you about drugs?",
                "Well whatever you're doing, just remember this: Having money may seem fun but... Oh never mind.",
                "Sometimes you fall in love!\nAnd you think you'll feel that way forever!\nYou change your life and ignore your friends cause you think it can't get any better!\nBut then love goes away, no matter what it doesn't stay as strong!\nAnd then your left with nothin cause your thinking with your dong!\nSo watch out for that lover! It can destroy like a typhoon wind!\nJust play it cool and don't be a fool!",
                "Don't let him bleed on my Meredith Baxter-Birney memorial towel\nI actually was with Meredith Baxter-Birney in this very car. And afterwards we used that towel to Wait a minute! Why am I telling you this?",
                "I hope you're ready for lunch children, because today I've got spooky spaghetti, and freaky french fries...\n...and haunted hash browns, and a creepy cookie...\n...and monstrous milk, and a terrifying napkin!",
                "Look Elton, you are a great singer, but a retarded monkey could write better lyrics.",
                "Well I'll be sodomized on Christmas!",
                "Get them while they're hot. My all new cookies, I Just Went And Fudged Your Momma.",
                "Okay. Everybody get in a line so I can whoop all your asses!",
                "Hello? What? Oh, hello, children! It's a what? A giant snake?! Killing everybody?! Growing bigger?! Children, you know I rarely say this, but, well... fudge ya. ",
                "Children, I heard about what happened at school today! Now none of you tooked that nasty marijuana, did you?",
                "Is she like, uh, Vanessa Williams beautiful or Toni Braxton beautiful? Or Pamela Anderson beautiful? Or is she Erin Grey in the second season of \"Buck Rogers\" beautiful?",
                "I'm gonna make love to ya woman!",
                "Suck on ma chocolate salty balls!",
                "An anal probe is when they stick a big metal hoob-a-joo up your butt.",
                "https://www.youtube.com/watch?v=b3npXX9vQ20",
            ];
            message.reply(chefquotes[Math.floor(Math.random() * chefquotes.length)]);
        }
    }),
    new Command({
        name: "butters",
        desc: "(no description)",
        type: "command",
        match: "butters",
        call: function (client, message, guild) {

            const buttersimg = [
                "https://pbs.twimg.com/profile_images/1379301839/butters_400x400.jpg",
                "https://boards.420chan.org/mtv/src/1513917412948.png",
                "http://3.bp.blogspot.com/_qBa_Bn_7yQE/TOvanIcFZwI/AAAAAAAAC5o/u-cioqeVS8w/s400/butters1.jpg",
                "http://78.media.tumblr.com/22b4e5baad2b8013168c0797b2ce0002/tumblr_inline_n6vsq2kR4y1qb9gvm.png",
                "https://vignette.wikia.nocookie.net/southpark/images/c/c2/Butters_%28Facebook%29.jpg/revision/latest/scale-to-width-down/150?cb=20101010032409",
                "https://78.media.tumblr.com/ae2b88cda4d3387c9834b62b6dd2d299/tumblr_ozlmevoHRO1waz4ico4_r1_1280.png",
                "https://pm1.narvii.com/6396/f76f6b5191670973a71e0ed7566eac328ae9ee18_hq.jpg",
                "https://78.media.tumblr.com/842ede331fcfd4a694135a391b75563f/tumblr_ozlmevoHRO1waz4ico3_1280.png",
                "https://78.media.tumblr.com/b2d3a659f77fd8b3d967c2ee395fa48f/tumblr_ozlmevoHRO1waz4ico6_r1_1280.png",
                "https://78.media.tumblr.com/c80169d8d7667a9479dd02987277cf91/tumblr_ozlmevoHRO1waz4ico1_500.png",
                "https://i.redd.it/firrbs9k9k401.png",
            ];
            message.reply("", {
                file: buttersimg[Math.floor(Math.random() * buttersimg.length)]
            });
        }
    }),
    new Command({
        name: "sticky role add",
        desc: "(no description)",
        type: "command",
        match: "stickadd",
        call: function (client, message, guild) {

            let args = message.content.split(" ");
            if (args[1] === undefined) {
                message.reply("you didn't finish the command. Weak. **Missing member ID!**");
                return;
            }

            if (args[2] === undefined) {
                message.reply("you didn't finish the command. Weak. **Missing role ID!**");
                return;
            }

            let found = false;

            let members = message.guild.members.array();

            for (let i = 0; i < members.length; i++) {
                if (members[i].id === args[1]) {
                    found = true;
                    break;
                }
            }
            if (found === false) {
                message.reply("you screwed up the command. Lame. **Wrong member ID!**");
                return;
            }

            found = false;

            let roles = message.guild.roles.array();

            for (let i = 0; i < roles.length; i++) {
                if (roles[i].id === args[2]) {
                    found = true;
                    break;
                }
            }
            if (found === false) {
                message.reply("you screwed up the command. Lame. **Wrong role ID!**");
                return;
            }

            let dbMember;

            for (let i = 0; i < guild.members.length; i++) {
                if (guild.members[i].id === args[1]) {
                    dbMember = guild.members[i];
                    break;
                }
            }
            if (dbMember === undefined){
                dbMember = {
                    id: args[1],
                    roles: []
                };
                dbMember.roles.push(args[2]);
                guild.members.push(dbMember);
            }
            dbMember.roles.push(args[2]);
            message.reply("sticky role addition successful. **Epic.**");
        }
    }),
    new Command({
        name: "sticky role remove",
        desc: "(no description)",
        type: "command",
        match: "stickremove",
        call: function (client, message, guild) {

            let args = message.content.split(" ");
            if (args[1] === undefined) {
                message.reply("you didn't finish the command. Weak. **Missing member ID!**");
                return;
            }

            if (args[2] === undefined) {
                message.reply("you didn't finish the command. Weak. **Missing role ID!**");
                return;
            }

            let found = false;

            let members = message.guild.members.array();

            for (let i = 0; i < members.length; i++) {
                if (members[i].id === args[1]) {
                    found = true;
                    break;
                }
            }
            if (found === false) {
                message.reply("you screwed up the command. Lame. **Wrong member ID!**");
                return;
            }

            found = false;

            let roles = message.guild.roles.array();

            for (let i = 0; i < roles.length; i++) {
                if (roles[i].id === args[2]) {
                    found = true;
                    break;
                }
            }
            if (found === false) {
                message.reply("you screwed up the command. Lame. **Wrong role ID!**");
                return;
            }

            let dbMember;

            for (let i = 0; i < guild.members.length; i++) {
                if (guild.members[i].id === args[1]) {
                    dbMember = guild.members[i];
                    break;
                }
            }
            if (dbMember === undefined){
                message.reply("this user does not have any sticky roles. Super lame.");
                return;            
            }
            for (let i = 0; i < dbMember.roles.length; i++){
                if(dbMember.roles[i].id === args[2]){
                    dbMember.roles.splice(i, 1);
                    message.reply("sticky role removal successful. **Epic.**");
                    return;
                }
            }
            message.reply("this user does not have this role. Critical failure. Bot shutting down.");
        }
    })
];

module.exports = commands;