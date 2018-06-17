"use strict";

const discord = require("discord.js");
const moment = require("moment");
const momentTz = require("moment-timezone");
const path = require("path");
const fs = require("fs");
const jimp = require("jimp");
const ytdl = require("ytdl-core");

const utils = require("./utils");
const spnav = require("./api/spnav");
const lastfm = require("./api/lastfm");
const logConstants = utils.logger;
const logger = utils.globLogger;

const jimpAssets = require("./jimpload");

// EXPERIMENTAL
const vm = require("vm");
//

let cachedeplist;

let cardSending = false;

const timeout = ms => new Promise(res => setTimeout(res, ms));

const textWidth = (font, str) => {
                                                                        
    let width = 0;

    for (let i = 0; i < str.length; i++) {
        width += font.chars[str[i]].xoffset + font.chars[str[i]].xadvance;                                                                          
    }

    return width;
}

const printCenter = (src, font, x, y, str, wrap = src.bitmap.width) => {

    let words = str.split(" ");

    let width = 0;
    let numLines = 0;
    let lastWord = 0;

    for (let i = 0; i < words.length; i++) {
        if (width + textWidth(font, words[i]) > wrap) {
            
            let text = "";
            for (let j = lastWord; j < i; j++) {
                text += words[j] + " ";
            }

            src.print(font, (src.bitmap.width / 2 - width / 2) + x, y + (numLines * font.chars["$"].height) + 5, text);

            lastWord = i;
            numLines++;
            width = 0;
        }
                        
        width += textWidth(font, words[i]);
    }

    let text = "";
    for (let i = lastWord; i < words.length; i++) {
        text += words[i] + " ";
    }

    src.print(font, (src.bitmap.width / 2 - width / 2) + x, y + (numLines * font.chars["$"].height) + 5, text);
};

const printCenterCenter = (src, font, x, y, str, wrap = src.bitmap.width) => {

    let words = str.split(" ");

    let width = 0;
    let numLines = 0;

    for (let i = 0; i < words.length; i++) {
        if (width + textWidth(font, words[i]) > wrap) {

            numLines++;
            width = 0;
        }
                        
        width += textWidth(font, words[i]);
    }

    let yoffset = 0;
    if (numLines === 3) {
        yoffset = 5;
    }
    if (numLines === 4) {
        yoffset = 10;
    }

    printCenter(src, font, x, (src.bitmap.height / 2 - ((numLines * font.chars["$"].height) + (numLines - 1) * 5)) / 2 + y + yoffset, str, wrap);
};

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

let vg = [];

const commands = [
    new Command({
        name: "one test boii",
        desc: "a test command for testing lol",
        type: "command",
        order: "any", // order: "any, first, last", - def = any
        continue: false, // continue: false, true, - def = false
        match: "test",
        call: function (client, message, guild) {

            message.channel.send("<:mattthink:451843404721029120>");
        }
    }),
    new Command({
        name: "vote ground",
        desc: "a command which lets regulars vote ground if were not here",
        type: "command",
        match: ["voteground", "vground", "voteg", "vg"],
        call: function (client, message, guild) {

            // Remove this and actually use permissions lol.
            let nkRole = message.member.roles.find(e => {
                return e.id === "451511710516510721";
            });
            if (nkRole === undefined || nkRole === null) {
                message.reply("you need to be a regular to use this command");
                return;
            }
            //

            let similarityThreshold = 0.6;
            let members = message.guild.members.array();

            let target = message.content.substring(message.content.split(" ")[0].length + 1);

            let current;

            for (let i = 0; i < members.length; i++) {

                let similarity = utils.similarity(target, members[i].displayName);

                if (similarity > similarityThreshold) {
                    if (current === undefined || current.similarity < similarity) {
                        current = {
                            index: i,
                            similarity: similarity
                        }
                    }
                }
            }

            if (current === undefined) {
                message.reply("member not found!");
                return;
            }

            let targetMember = members[current.index];

            let targetGrounded = targetMember.roles.find(e => {
                return e.id === guild.settings.groundedRole;
            });
            if (targetGrounded !== undefined && targetGrounded !== null) {
                message.reply("target is already grounded!");
                return;
            }
            
            // Duplication checking.
            for (let i = 0; i < vg.length; i++) {
                if (vg[i].target.user.id !== targetMember.user.id) {
                    continue;
                }

                if (vg[i].member.user.id === message.author.id) {
                    message.reply("you've already added your vote!");
                    return;
                }
            }

            let numVotes = 4;
            let currentVotes = 0;
            for (let i = 0; i < vg.length; i++) {
                if (vg[i].target.user.id === targetMember.user.id) {
                    currentVotes++;
                }
            }

            if (currentVotes === numVotes - 1) {

                let groundedRole = message.guild.roles.find(e => {
                    return e.id === guild.settings.groundedRole;
                });
                if (groundedRole === undefined || groundedRole === null) {
                    message.reply("error grounding target!");
                    return;
                }

                targetMember.addRole(groundedRole);

                while (true) {

                    let found = false;
                    for (let i = 0; i < vg.length; i++) {
                        if (vg[i].target.user.id === targetMember.user.id) {
                            vg.splice(i, 1);
                            found = true;
                            break;
                        }
                    }

                    if (found === false) {
                        break;
                    }
                }

                message.channel.send(new discord.RichEmbed()
                    .setAuthor("AWESOM-O // Vote Ground", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846")
                    .setDescription("**User has been grounded!**"));

                return;
            }

            if (currentVotes === 0) {

                //message.channel.send(`<@${"*mods (temp)*"}>, <@${message.author.id}> has started a vote to ground <@${targetMember.displayName}>!\n**${numVotes - 1}** more votes are needed to ground the target.\nUse: '${guild.settings.prefix}vg ${targetMember.displayName}' to add your vote.\nThis vote will expire in 10 minutes.\n**Abuse of this command may result in a ban!**`);
                message.channel.send(new discord.RichEmbed()
                    .setAuthor("AWESOM-O // Vote Ground", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846")
                    .setDescription(`<@${message.author.id}> has started a vote to ground <@${targetMember.user.id}>.\n\nTo add your vote, please use the command: ${"```"}${guild.settings.prefix}vg ${targetMember.displayName}${"```"}\n**${numVotes - 1}** more votes are needed to ground the target user.\n\nThis vote will expire in **10 minutes**!\n\n**Abuse of this command will result in removal of your Regular role.**`)).then((message) => {
                        message.channel.send("<@&449652228991746048>");
                    });

                setTimeout(() => {

                    while (true) {

                        let found = false;
                        for (let i = 0; i < vg.length; i++) {
                            if (vg[i].target.user.id === targetMember.user.id) {
                                vg.splice(i, 1);
                                found = true;
                                break;
                            }
                        }

                        if (found === false) {
                            break;
                        }
                    }

                }, 600000);
            } else {

                //message.channel.send(`<@${message.author.id}>, your vote has been added to ground ${targetMember.displayName}\n**${currentVotes + 1}/${numVotes}** votes are needed to ground the target.`);
                message.channel.send(new discord.RichEmbed()
                    .setAuthor("AWESOM-O // Vote Ground", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846")
                    .setDescription(`<@${message.author.id}>, your vote has been added to ground <@${targetMember.user.id}>.\n\n**${numVotes - (currentVotes + 1)}** more ${numVotes - (currentVotes + 1) === 1 ? "vote is" : "votes are"} needed to ground the target user.\n\n**Abuse of this command will result in removal of your Regular role.**`));   
            }
                    
            vg.push({
                target: targetMember,
                member: message.member
            });
        }
    }),
    new Command({
        name: "discord object info",
        desc: "a command for getting info various discord objects",
        type: "command",
        match: ["i", "id"],
        call: function (client, message, guild) {

            // role - rolename
            // emoji - emojiname
            // channel - channelname
            // user - username
            // *guild - guildname
            // *message - content snippet

            let similarityThreshold = 0.5;

            let search = message.content.substring(guild.settings.prefix.length + this.match.length + 1);

            let detailFlag = false;
            if (search.indexOf("-d") !== -1) {

                search = search.replace("-d", "");

                detailFlag = true;
            }

            search = search.replace(/  +/, " ");
            search = search.trim();

            if (search === undefined || search.length === 0) {
                message.reply("you need to enter the thing to search for");
                return;
            }

            let roles = message.guild.roles.array();
            let emojis = message.guild.emojis.array();
            let channels = message.guild.channels.array();
            let members = message.guild.members.array();

            // Avoid names breaking this by attempting to match ids first.
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].id === search) {

                    // role found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Role Info`);

                    embed.addField("Id:", "```" + roles[i].id + "```");
                    embed.addField("Name:", "```" + roles[i].name + "```");
                    embed.addField("Color:", "```" + roles[i].hexColor + "```");

                    if (detailFlag === true) {

                        embed.addField("Position:", "```" + roles[i].position + "```");
                        embed.addField("Mentionable:", "```" + roles[i].mentionable + "```");
                        embed.addField("Hoist:", "```" + roles[i].hoist + "```");
                        embed.addField("Editable:", "```" + roles[i].editable + "```");
                        embed.addField("Managed:", "```" + roles[i].managed + "```");
                        embed.addField("CreatedBy:", "```" + roles[i].client.user.username + "```");
                        embed.addField("CreatedAt:", "```" + roles[i].createdAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }
            for (let i = 0; i < emojis.length; i++) {
                if (emojis[i].id === search) {

                    // emoji found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Emoji Info`);

                    embed.addField("Id:", "```" + emojis[i].id + "```");
                    embed.addField("Name:", "```" + emojis[i].name + "```");
                    embed.addField("Animated:", "```" + emojis[i].animated + "```");

                    if (detailFlag === true) {

                        embed.addField("Url:", "```" + emojis[i].url + "```");
                        embed.addField("Identifier:", "```" + emojis[i].identifier + "```");
                        embed.addField("RequiresColons:", "```" + emojis[i].requiresColons + "```");
                        embed.addField("Managed:", "```" + emojis[i].managed + "```");
                        embed.addField("CreatedBy:", "```" + emojis[i].client.user.username + "```");
                        embed.addField("CreatedAt:", "```" + emojis[i].createdAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }
            for (let i = 0; i < channels.length; i++) {
                if (channels[i].id === search) {

                    // channel found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Channel Info`);

                    embed.addField("Id:", "```" + channels[i].id + "```");
                    embed.addField("Name:", "```" + channels[i].name + "```");
                    embed.addField("Type:", "```" + channels[i].type + "```");

                    if (detailFlag === true) {

                        embed.addField("Position:", "```" + channels[i].position + "```");
                        embed.addField("Deletable:", "```" + channels[i].deletable + "```");

                        switch (channels[i].type) {
                            case "text":
                                embed.addField("Nsfw:", "```" + channels[i].nsfw + "```");
                                embed.addField("Topic:", "```" + (channels[i].topic.length > 50 ? channels[i].topic.substring(0, 50) + "..." : channels[i].topic) + "```");
                                break;
                            case "voice":
                                embed.addField("UserLimit:", "```" + channels[i].userLimit + "```");
                                embed.addField("Bitrate:", "```" + channels[i].bitrate + "```");
                                break;
                        }

                        embed.addField("Parent:", "```" + channels[i].parent + "```");
                        embed.addField("ParentId:", "```" + channels[i].parentID + "```");

                        embed.addField("CreatedBy:", "```" + channels[i].client.user.username + "```");
                        embed.addField("CreatedAt:", "```" + channels[i].createdAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }
            for (let i = 0; i < members.length; i++) {
                if (members[i].id === search) {

                    // user found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Member Info`);

                    embed.addField("Id:", "```" + members[i].user.id + "```");
                    embed.addField("Name:", "```" + members[i].user.username + "```");
                    embed.addField("Nick:", "```" + (members[i].nickname === undefined ? "null" : members[i].nickname) + "```");

                    if (detailFlag === true) {

                        embed.addField("Kickable:", "```" + members[i].kickable + "```");
                        embed.addField("Bannable:", "```" + members[i].bannable + "```");
                        embed.addField("Color:", "```" + members[i].displayHexColor + "```");
                        embed.addField("HighestRole:", "```" + (members[i].highestRole === undefined ? "null" : members[i].highestRole.name) + "```");
                        embed.addField("HoistRole:", "```" + (members[i].hoistRole === null ? "null" : members[i].hoistRole.name) + "```");
                        embed.addField("LastMessage:", "```" + (members[i].lastMessage === null ? "null" : members[i].lastMessage.content > 50 ? members[i].lastMessage.content.substring(0, 50) + "..." : members[i].lastMessage.content) + "```");
                        embed.addField("LastMessageID:", "```" + members[i].lastMessageID + "```");
                        embed.addField("JoinedAt:", "```" + members[i].joinedAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }

            // Try to match names if the user didn't enter a matching id.
            for (let i = 0; i < roles.length; i++) {

                let similarity = utils.similarity(search, roles[i].name);
                if (similarity > similarityThreshold) {

                    let percentage = (similarity * 100).toString();

                    // role found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Role Info - ${percentage.indexOf(".") === -1 ? percentage : percentage.substring(0, percentage.indexOf("."))}%`);

                    embed.addField("Id:", "```" + roles[i].id + "```");
                    embed.addField("Name:", "```" + roles[i].name + "```");
                    embed.addField("Color:", "```" + roles[i].hexColor + "```");

                    if (detailFlag === true) {

                        embed.addField("Position:", "```" + roles[i].position + "```");
                        embed.addField("Mentionable:", "```" + roles[i].mentionable + "```");
                        embed.addField("Hoist:", "```" + roles[i].hoist + "```");
                        embed.addField("Editable:", "```" + roles[i].editable + "```");
                        embed.addField("Managed:", "```" + roles[i].managed + "```");
                        embed.addField("CreatedBy:", "```" + roles[i].client.user.username + "```");
                        embed.addField("CreatedAt:", "```" + roles[i].createdAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }
            for (let i = 0; i < emojis.length; i++) {

                let similarity = utils.similarity(search, emojis[i].name);
                if (similarity > similarityThreshold) {

                    let percentage = (similarity * 100).toString();

                    // emoji found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Emoji Info - ${percentage.indexOf(".") === -1 ? percentage : percentage.substring(0, percentage.indexOf("."))}%`);

                    embed.addField("Id:", "```" + emojis[i].id + "```");
                    embed.addField("Name:", "```" + emojis[i].name + "```");
                    embed.addField("Animated:", "```" + emojis[i].animated + "```");

                    if (detailFlag === true) {

                        embed.addField("Url:", "```" + emojis[i].url + "```");
                        embed.addField("Identifier:", "```" + emojis[i].identifier + "```");
                        embed.addField("RequiresColons:", "```" + emojis[i].requiresColons + "```");
                        embed.addField("Managed:", "```" + emojis[i].managed + "```");
                        embed.addField("CreatedBy:", "```" + emojis[i].client.user.username + "```");
                        embed.addField("CreatedAt:", "```" + emojis[i].createdAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }
            for (let i = 0; i < channels.length; i++) {

                let similarity = utils.similarity(search, channels[i].name);
                if (similarity > similarityThreshold) {

                    let percentage = (similarity * 100).toString();

                    // channel found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Channel Info - ${percentage.indexOf(".") === -1 ? percentage : percentage.substring(0, percentage.indexOf("."))}%`);

                    embed.addField("Id:", "```" + channels[i].id + "```");
                    embed.addField("Name:", "```" + channels[i].name + "```");
                    embed.addField("Type:", "```" + channels[i].type + "```");

                    if (detailFlag === true) {

                        embed.addField("Position:", "```" + channels[i].position + "```");
                        embed.addField("Deletable:", "```" + channels[i].deletable + "```");

                        switch (channels[i].type) {
                            case "text":
                                embed.addField("Nsfw:", "```" + channels[i].nsfw + "```");
                                embed.addField("Topic:", "```" + (channels[i].topic.length > 50 ? channels[i].topic.substring(0, 50) + "..." : channels[i].topic) + "```");
                                break;
                            case "voice":
                                embed.addField("UserLimit:", "```" + channels[i].userLimit + "```");
                                embed.addField("Bitrate:", "```" + channels[i].bitrate + "```");
                                break;
                        }

                        embed.addField("Parent:", "```" + channels[i].parent + "```");
                        embed.addField("ParentId:", "```" + channels[i].parentID + "```");

                        embed.addField("CreatedBy:", "```" + channels[i].client.user.username + "```");
                        embed.addField("CreatedAt:", "```" + channels[i].createdAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }
            for (let i = 0; i < members.length; i++) {

                let similarity = utils.similarity(search, members[i].user.username);
                if (similarity > similarityThreshold) {

                    let percentage = (similarity * 100).toString();

                    // user found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Member Info - ${percentage.indexOf(".") === -1 ? percentage : percentage.substring(0, percentage.indexOf("."))}%`);

                    embed.addField("Id:", "```" + members[i].user.id + "```");
                    embed.addField("Name:", "```" + members[i].user.username + "```");
                    embed.addField("Nick:", "```" + (members[i].nickname === undefined ? "null" : members[i].nickname) + "```");

                    if (detailFlag === true) {

                        embed.addField("Kickable:", "```" + members[i].kickable + "```");
                        embed.addField("Bannable:", "```" + members[i].bannable + "```");
                        embed.addField("Color:", "```" + members[i].displayHexColor + "```");
                        embed.addField("HighestRole:", "```" + (members[i].highestRole === undefined ? "null" : members[i].highestRole.name) + "```");
                        embed.addField("HoistRole:", "```" + (members[i].hoistRole === null ? "null" : members[i].hoistRole.name) + "```");
                        embed.addField("LastMessage:", "```" + (members[i].lastMessage === null ? "null" : members[i].lastMessage.content > 50 ? members[i].lastMessage.content.substring(0, 50) + "..." : members[i].lastMessage.content) + "```");
                        embed.addField("LastMessageID:", "```" + members[i].lastMessageID + "```");
                        embed.addField("JoinedAt:", "```" + members[i].joinedAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }
            for (let i = 0; i < members.length; i++) {

                if (members[i].nickname === null) {
                    continue;
                }

                let similarity = utils.similarity(search, members[i].nickname);
                if (similarity > similarityThreshold) {

                    let percentage = (similarity * 100).toString();

                    // member found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Member Info - ${percentage.indexOf(".") === -1 ? percentage : percentage.substring(0, percentage.indexOf("."))}%`);

                    embed.addField("Id:", "```" + members[i].user.id + "```");
                    embed.addField("Name:", "```" + members[i].user.username + "```");
                    embed.addField("Nick:", "```" + (members[i].nickname === undefined ? "null" : members[i].nickname) + "```");

                    if (detailFlag === true) {

                        embed.addField("Kickable:", "```" + members[i].kickable + "```");
                        embed.addField("Bannable:", "```" + members[i].bannable + "```");
                        embed.addField("Color:", "```" + members[i].displayHexColor + "```");
                        embed.addField("HighestRole:", "```" + (members[i].highestRole === undefined ? "null" : members[i].highestRole.name) + "```");
                        embed.addField("HoistRole:", "```" + (members[i].hoistRole === null ? "null" : members[i].hoistRole.name) + "```");
                        embed.addField("LastMessage:", "```" + (members[i].lastMessage === null ? "null" : members[i].lastMessage.content > 50 ? members[i].lastMessage.content.substring(0, 50) + "..." : members[i].lastMessage.content) + "```");
                        embed.addField("LastMessageID:", "```" + members[i].lastMessageID + "```");
                        embed.addField("JoinedAt:", "```" + members[i].joinedAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }

            message.reply("your query did not match anything");
        }
    }),
    new Command({
        name: "discord role info",
        desc: "a command for getting info for discord roles",
        type: "command",
        match: ["r", "ri", "ir", "rid"],
        call: function (client, message, guild) {

            let similarityThreshold = 0.5;

            let search = message.content.substring(message.content.split(" ")[0].length + 1);

            let detailFlag = false;
            if (search.indexOf("-d") !== -1) {

                search = search.replace("-d", "");

                detailFlag = true;
            }

            search = search.replace(/  +/, " ");
            search = search.trim();

            if (search === undefined || search.length === 0) {
                message.reply("you need to enter the thing to search for");
                return;
            }

            let roles = message.guild.roles.array();

            // Avoid names breaking this by attempting to match ids first.
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].id === search) {

                    // role found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Role Info`);

                    embed.addField("Id:", "```" + roles[i].id + "```");
                    embed.addField("Name:", "```" + roles[i].name + "```");
                    embed.addField("Color:", "```" + roles[i].hexColor + "```");

                    if (detailFlag === true) {

                        embed.addField("Position:", "```" + roles[i].position + "```");
                        embed.addField("Mentionable:", "```" + roles[i].mentionable + "```");
                        embed.addField("Hoist:", "```" + roles[i].hoist + "```");
                        embed.addField("Editable:", "```" + roles[i].editable + "```");
                        embed.addField("Managed:", "```" + roles[i].managed + "```");
                        embed.addField("CreatedBy:", "```" + roles[i].client.user.username + "```");
                        embed.addField("CreatedAt:", "```" + roles[i].createdAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }

            // Try to match names if the user didn't enter a matching id.
            for (let i = 0; i < roles.length; i++) {

                let similarity = utils.similarity(search, roles[i].name);
                if (similarity > similarityThreshold) {

                    let percentage = (similarity * 100).toString();

                    // role found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Role Info - ${percentage.indexOf(".") === -1 ? percentage : percentage.substring(0, percentage.indexOf("."))}%`);

                    embed.addField("Id:", "```" + roles[i].id + "```");
                    embed.addField("Name:", "```" + roles[i].name + "```");
                    embed.addField("Color:", "```" + roles[i].hexColor + "```");

                    if (detailFlag === true) {

                        embed.addField("Position:", "```" + roles[i].position + "```");
                        embed.addField("Mentionable:", "```" + roles[i].mentionable + "```");
                        embed.addField("Hoist:", "```" + roles[i].hoist + "```");
                        embed.addField("Editable:", "```" + roles[i].editable + "```");
                        embed.addField("Managed:", "```" + roles[i].managed + "```");
                        embed.addField("CreatedBy:", "```" + roles[i].client.user.username + "```");
                        embed.addField("CreatedAt:", "```" + roles[i].createdAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }

            message.reply("your query did not match any roles");
        }
    }),
    new Command({
        name: "discord emoji info",
        desc: "a command for getting info for discord emojis",
        type: "command",
        match: ["e", "ei", "ie", "eid"],
        call: function (client, message, guild) {

            let similarityThreshold = 0.5;

            let search = message.content.substring(message.content.split(" ")[0].length + 1);

            let detailFlag = false;
            if (search.indexOf("-d") !== -1) {

                search = search.replace("-d", "");

                detailFlag = true;
            }

            search = search.replace(/  +/, " ");
            search = search.trim();

            if (search === undefined || search.length === 0) {
                message.reply("you need to enter the thing to search for");
                return;
            }

            let emojis = message.guild.emojis.array();

            // Avoid names breaking this by attempting to match ids first.
            for (let i = 0; i < emojis.length; i++) {
                if (emojis[i].id === search) {

                    // emoji found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Emoji Info`);

                    embed.addField("Id:", "```" + emojis[i].id + "```");
                    embed.addField("Name:", "```" + emojis[i].name + "```");
                    embed.addField("Animated:", "```" + emojis[i].animated + "```");

                    if (detailFlag === true) {

                        embed.addField("Url:", "```" + emojis[i].url + "```");
                        embed.addField("Identifier:", "```" + emojis[i].identifier + "```");
                        embed.addField("RequiresColons:", "```" + emojis[i].requiresColons + "```");
                        embed.addField("Managed:", "```" + emojis[i].managed + "```");
                        embed.addField("CreatedBy:", "```" + emojis[i].client.user.username + "```");
                        embed.addField("CreatedAt:", "```" + emojis[i].createdAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }

            // Try to match names if the user didn't enter a matching id.
            for (let i = 0; i < emojis.length; i++) {

                let similarity = utils.similarity(search, emojis[i].name);
                if (similarity > similarityThreshold) {

                    let percentage = (similarity * 100).toString();

                    // emoji found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Emoji Info - ${percentage.indexOf(".") === -1 ? percentage : percentage.substring(0, percentage.indexOf("."))}%`);

                    embed.addField("Id:", "```" + emojis[i].id + "```");
                    embed.addField("Name:", "```" + emojis[i].name + "```");
                    embed.addField("Animated:", "```" + emojis[i].animated + "```");

                    if (detailFlag === true) {

                        embed.addField("Url:", "```" + emojis[i].url + "```");
                        embed.addField("Identifier:", "```" + emojis[i].identifier + "```");
                        embed.addField("RequiresColons:", "```" + emojis[i].requiresColons + "```");
                        embed.addField("Managed:", "```" + emojis[i].managed + "```");
                        embed.addField("CreatedBy:", "```" + emojis[i].client.user.username + "```");
                        embed.addField("CreatedAt:", "```" + emojis[i].createdAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }

            message.reply("your query did not match any emojis");
        }
    }),
    new Command({
        name: "discord channel info",
        desc: "a command for getting info for discord channels",
        type: "command",
        match: ["c", "ci", "ic", "cid"],
        call: function (client, message, guild) {

            let similarityThreshold = 0.5;

            let search = message.content.substring(message.content.split(" ")[0].length + 1);

            let detailFlag = false;
            if (search.indexOf("-d") !== -1) {

                search = search.replace("-d", "");

                detailFlag = true;
            }

            search = search.replace(/  +/, " ");
            search = search.trim();

            if (search === undefined || search.length === 0) {
                message.reply("you need to enter the thing to search for");
                return;
            }

            let channels = message.guild.channels.array();

            // Avoid names breaking this by attempting to match ids first.
            for (let i = 0; i < channels.length; i++) {
                if (channels[i].id === search) {

                    // channel found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Channel Info`);

                    embed.addField("Id:", "```" + channels[i].id + "```");
                    embed.addField("Name:", "```" + channels[i].name + "```");
                    embed.addField("Type:", "```" + channels[i].type + "```");

                    if (detailFlag === true) {

                        embed.addField("Position:", "```" + channels[i].position + "```");
                        embed.addField("Deletable:", "```" + channels[i].deletable + "```");

                        switch (channels[i].type) {
                            case "text":
                                embed.addField("Nsfw:", "```" + channels[i].nsfw + "```");
                                embed.addField("Topic:", "```" + (channels[i].topic.length > 50 ? channels[i].topic.substring(0, 50) + "..." : channels[i].topic) + "```");
                                break;
                            case "voice":
                                embed.addField("UserLimit:", "```" + channels[i].userLimit + "```");
                                embed.addField("Bitrate:", "```" + channels[i].bitrate + "```");
                                break;
                        }

                        embed.addField("Parent:", "```" + channels[i].parent + "```");
                        embed.addField("ParentId:", "```" + channels[i].parentID + "```");

                        embed.addField("CreatedBy:", "```" + channels[i].client.user.username + "```");
                        embed.addField("CreatedAt:", "```" + channels[i].createdAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }

            // Try to match names if the user didn't enter a matching id.
            for (let i = 0; i < channels.length; i++) {

                let similarity = utils.similarity(search, channels[i].name);
                if (similarity > similarityThreshold) {

                    let percentage = (similarity * 100).toString();

                    // channel found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Channel Info - ${percentage.indexOf(".") === -1 ? percentage : percentage.substring(0, percentage.indexOf("."))}%`);

                    embed.addField("Id:", "```" + channels[i].id + "```");
                    embed.addField("Name:", "```" + channels[i].name + "```");
                    embed.addField("Type:", "```" + channels[i].type + "```");

                    if (detailFlag === true) {

                        embed.addField("Position:", "```" + channels[i].position + "```");
                        embed.addField("Deletable:", "```" + channels[i].deletable + "```");

                        switch (channels[i].type) {
                            case "text":
                                embed.addField("Nsfw:", "```" + channels[i].nsfw + "```");
                                embed.addField("Topic:", "```" + (channels[i].topic.length > 50 ? channels[i].topic.substring(0, 50) + "..." : channels[i].topic) + "```");
                                break;
                            case "voice":
                                embed.addField("UserLimit:", "```" + channels[i].userLimit + "```");
                                embed.addField("Bitrate:", "```" + channels[i].bitrate + "```");
                                break;
                        }

                        embed.addField("Parent:", "```" + channels[i].parent + "```");
                        embed.addField("ParentId:", "```" + channels[i].parentID + "```");

                        embed.addField("CreatedBy:", "```" + channels[i].client.user.username + "```");
                        embed.addField("CreatedAt:", "```" + channels[i].createdAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }

            message.reply("your query did not match any channels");
        }
    }),
    new Command({
        name: "discord member info",
        desc: "a command for getting info for discord members",
        type: "command",
        match: ["m", "mi", "im", "mid", "u", "ui", "iu", "uid"],
        call: function (client, message, guild) {

            let similarityThreshold = 0.5;

            let search = message.content.substring(message.content.split(" ")[0].length + 1);

            let detailFlag = false;
            if (search.indexOf("-d") !== -1) {

                search = search.replace("-d", "");

                detailFlag = true;
            }

            search = search.replace(/  +/, " ");
            search = search.trim();

            if (search === undefined || search.length === 0) {
                message.reply("you need to enter the thing to search for");
                return;
            }

            let members = message.guild.members.array();

            // Avoid names breaking this by attempting to match ids first.
            for (let i = 0; i < members.length; i++) {
                if (members[i].id === search) {

                    // user found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Member Info`);

                    embed.addField("Id:", "```" + members[i].user.id + "```");
                    embed.addField("Name:", "```" + members[i].user.username + "```");
                    embed.addField("Nick:", "```" + (members[i].nickname === undefined ? "null" : members[i].nickname) + "```");

                    if (detailFlag === true) {

                        embed.addField("Kickable:", "```" + members[i].kickable + "```");
                        embed.addField("Bannable:", "```" + members[i].bannable + "```");
                        embed.addField("Color:", "```" + members[i].displayHexColor + "```");
                        embed.addField("HighestRole:", "```" + (members[i].highestRole === undefined ? "null" : members[i].highestRole.name) + "```");
                        embed.addField("HoistRole:", "```" + (members[i].hoistRole === null ? "null" : members[i].hoistRole.name) + "```");
                        embed.addField("LastMessage:", "```" + (members[i].lastMessage === null ? "null" : members[i].lastMessage.content > 50 ? members[i].lastMessage.content.substring(0, 50) + "..." : members[i].lastMessage.content) + "```");
                        embed.addField("LastMessageID:", "```" + members[i].lastMessageID + "```");
                        embed.addField("JoinedAt:", "```" + members[i].joinedAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }

            // Try to match names if the user didn't enter a matching id.
            for (let i = 0; i < members.length; i++) {

                let similarity = utils.similarity(search, members[i].user.username);
                if (similarity > similarityThreshold) {

                    let percentage = (similarity * 100).toString();

                    // user found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Member Info - ${percentage.indexOf(".") === -1 ? percentage : percentage.substring(0, percentage.indexOf("."))}%`);

                    embed.addField("Id:", "```" + members[i].user.id + "```");
                    embed.addField("Name:", "```" + members[i].user.username + "```");
                    embed.addField("Nick:", "```" + (members[i].nickname === undefined ? "null" : members[i].nickname) + "```");

                    if (detailFlag === true) {

                        embed.addField("Kickable:", "```" + members[i].kickable + "```");
                        embed.addField("Bannable:", "```" + members[i].bannable + "```");
                        embed.addField("Color:", "```" + members[i].displayHexColor + "```");
                        embed.addField("HighestRole:", "```" + (members[i].highestRole === undefined ? "null" : members[i].highestRole.name) + "```");
                        embed.addField("HoistRole:", "```" + (members[i].hoistRole === null ? "null" : members[i].hoistRole.name) + "```");
                        embed.addField("LastMessage:", "```" + (members[i].lastMessage === null ? "null" : members[i].lastMessage.content > 50 ? members[i].lastMessage.content.substring(0, 50) + "..." : members[i].lastMessage.content) + "```");
                        embed.addField("LastMessageID:", "```" + members[i].lastMessageID + "```");
                        embed.addField("JoinedAt:", "```" + members[i].joinedAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }
            for (let i = 0; i < members.length; i++) {

                if (members[i].nickname === null) {
                    continue;
                }

                let similarity = utils.similarity(search, members[i].nickname);
                if (similarity > similarityThreshold) {

                    let percentage = (similarity * 100).toString();

                    // member found
                    let embed = new discord.RichEmbed()
                        .setColor(0xF0433A)
                        .setAuthor(`AWESOM-O // Member Info - ${percentage.indexOf(".") === -1 ? percentage : percentage.substring(0, percentage.indexOf("."))}%`);

                    embed.addField("Id:", "```" + members[i].user.id + "```");
                    embed.addField("Name:", "```" + members[i].user.username + "```");
                    embed.addField("Nick:", "```" + (members[i].nickname === undefined ? "null" : members[i].nickname) + "```");

                    if (detailFlag === true) {

                        embed.addField("Kickable:", "```" + members[i].kickable + "```");
                        embed.addField("Bannable:", "```" + members[i].bannable + "```");
                        embed.addField("Color:", "```" + members[i].displayHexColor + "```");
                        embed.addField("HighestRole:", "```" + (members[i].highestRole === undefined ? "null" : members[i].highestRole.name) + "```");
                        embed.addField("HoistRole:", "```" + (members[i].hoistRole === null ? "null" : members[i].hoistRole.name) + "```");
                        embed.addField("LastMessage:", "```" + (members[i].lastMessage === null ? "null" : members[i].lastMessage.content > 50 ? members[i].lastMessage.content.substring(0, 50) + "..." : members[i].lastMessage.content) + "```");
                        embed.addField("LastMessageID:", "```" + members[i].lastMessageID + "```");
                        embed.addField("JoinedAt:", "```" + members[i].joinedAt + "```");
                    }

                    message.channel.send(embed);

                    return;
                }
            }

            message.reply("your query did not match any members");
        }
    }),
    new Command({
        name: "purge messages",
        desc: "mass delete messages",
        type: "command",
        match: "purge",
        call: function (client, message, guild) {

            let deleteCount;

            let args = message.content.split(" ");
            if (args[1] === undefined) {
                deleteCount = 20;
            } else {

                let parsed = parseInt(args[1], 10);

                if (parsed === NaN) {
                    deleteCount = 20;
                } else {

                    deleteCount = args[1] > 50 ? 50 : parsed;
                }
            }

            message.channel.bulkDelete(deleteCount, true);
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
    //
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
                file: "https://cdn.discordapp.com/attachments/430447280932388865/452883193431982082/Welcome.png"
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
                .addField("MST", momentTz().tz("America/Creston").format("Do MMMM YYYY, h:mm:ss a"))
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
    /*
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
                if (targetTeam.exclusive === false) {
                    break;
                }
                if (teams[i].id === targetTeam.id) {
                    continue;
                }
                if (teams[i].exclusive === false) {
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
    */
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
        name: "pie",
        desc: "(no description)",
        type: "command",
        match: "pie",
        call: function (client, message, guild) {

            if (message.member.voiceChannel !== undefined && message.member.voiceChannel !== null) {

                let conn = client.voiceConnections.find(e => {
                    return e.channel.id;
                }, message.member.voiceChannel.id);

                if (conn !== undefined && conn !== null) {
                    let disp = conn.playFile("pie.mp3");
                    disp.on("end", () => {
                        conn.disconnect();
                    });
                } else {
                    message.member.voiceChannel.join().then(conn => {
                        let disp = conn.playFile("pie.mp3");
                        disp.on("end", () => {
                            conn.disconnect();
                        });
                    });
                }

            } else {
                message.reply("you need to be in a voice channel to use this command");
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
                "https://cdn.discordapp.com/attachments/394504208222650369/447785248931971082/Butters17.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785256129527809/Butters3.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785260034555915/Butters5.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785265121984534/Butters8.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785273179504640/Butters9.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785279529680910/Butters10.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785288178335764/Butters12.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785295220441128/Butters13.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785304359960576/Butters14.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785316481499136/Butters15.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785340237774848/Butters30.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785353148104705/Butters18_.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785365017985024/Butters19.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785370374111243/Butters20.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785380041850880/Butters22.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785388103303188/Butters24.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785397091827724/Butters26.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785406474354699/Butters27.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785413533499392/Butters28.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785421838221322/Butters29.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785438271242240/Butters55.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785447020691456/Butters31.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785455161704448/Butters32.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785462606725131/Butters34.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785471439929346/Butters35.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785483557404673/Butters40.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785487650783237/Butters44.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785497117458459/Butters48.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785504331530242/Butters51.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785510325190677/Butters54.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785525802303503/Butters75.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785532165193738/Butters66.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785540696408074/Butters67.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785546761240577/Butters68.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785552977068032/Butters69.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785559658856479/Butters70.gif",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785566667407380/Butters71.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785574196051968/Butters72.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785586003017728/Butters73.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785587508903976/Butters74.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785602973433857/Butters81.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785614373552181/Butters77.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785615115812874/Butters76.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785621675573258/Butters78.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785633826734081/Butters80.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785636376870943/Butters79.png"
            ];

            message.channel.send(new discord.RichEmbed().setImage(buttersimg[Math.floor(Math.random() * buttersimg.length)]));
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
            if (dbMember === undefined) {
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
            if (dbMember === undefined) {
                message.reply("this user does not have any sticky roles. **Super lame.**");
                return;
            }
            for (let i = 0; i < dbMember.roles.length; i++) {
                if (dbMember.roles[i] === args[2]) {
                    dbMember.roles.splice(i, 1);
                    message.reply("sticky role removal successful. **Epic.**");
                    return;
                }
            }
            message.reply("this user does not have this role. **Critical failure. Bot shutting down.**");
        }
    }),
    new Command({
        name: "card",
        desc: "Phone Destroyer!",
        type: "command",
        match: ["card", "dcard"],
        call: async function (client, message, guild) {

            let cardName = message.content.substring(message.content.split(" ")[0].length + 1);

            let cardLevel = parseInt(message.content[message.content.length - 1]);
            if (isNaN(cardLevel) || cardLevel < 1 || cardLevel > 7) {
                cardLevel = 1;
            } else {
                cardName = cardName.substring(0, cardName.length - 2);
            }

            let test = jimpAssets;

            let jsonContent = fs.readFileSync(path.join(__dirname, "assets", "cards.json"));

            let cardObject;
            try {
                cardObject = JSON.parse(jsonContent);
            } catch (error) {
                message.reply(error);
                return;
            }

            const threshold = 0.0;

            let index;
            let current = threshold;

            for (let i = 0; i < cardObject.length; i++) {

                let similarity;

                if (cardObject[i].name.constructor === Array) {

                    for (let j = 0; j < cardObject[i].name.length; j++) {

                        similarity = utils.similarity(cardObject[i].name[j].toLowerCase(), cardName.toLowerCase());

                        if (similarity > current) {

                            current = similarity;
                            index = i;
                        }
                    }

                } else {

                    similarity = utils.similarity(cardObject[i].name.toLowerCase(), cardName.toLowerCase());
                }

                //let similarity = utils.similarity(cardObject[i].name.toLowerCase(), cardName.toLowerCase());

                if (similarity > current) {

                    current = similarity;
                    index = i;
                }
            }
            if (index === undefined) {
                message.reply("card not found");
                return;
            }

            let card = cardObject[index];

            // Get the frame outline.
            const frameWidth = 305;
            const frameHeight = 418;

            let x, y, z, w;

            switch (card.rarity) {
                case "Common":
                    y = 0;
                    switch (card.theme) {
                        case "Adventure":
                            x = frameWidth;
                            break;
                        case "Sci-Fi":
                            x = frameWidth * 2;
                            break;
                        case "Mystical":
                            x = frameWidth * 3;
                            break;
                        case "Fantasy":
                            x = frameWidth * 4;
                            break;
                        case "Neutral":
                            x = 0;
                            break;
                        default:
                            message.reply("theme not found");
                            return;
                            break;
                    }
                    break;
                default:
                    y = frameHeight;
                    switch (card.theme) {
                        case "Adventure":
                            x = frameWidth;
                            break;
                        case "Sci-Fi":
                            x = frameWidth * 2;
                            break;
                        case "Mystical":
                            x = frameWidth * 3;
                            break;
                        case "Fantasy":
                            x = frameWidth * 4;
                            break;
                        case "Neutral":
                            x = 0;
                            break;
                        default:
                            message.reply("theme not found");
                            return;
                            break;
                    }
                    break;
            }

            z = frameWidth;
            w = frameHeight;

            // Get the frame top.
            const topWidth = 338;
            const topHeight = 107;

            let fx, fy, fz, fw;

            fx = 0;

            switch (card.rarity) {
                case "Common":
                    fy = undefined;
                    break;
                case "Rare":
                    fy = 0;
                    break;
                case "Epic":
                    fy = topHeight;
                    break;
                case "Legendary":
                    fy = topHeight * 2;
                    break;
                default:
                    message.reply("rarity not found");
                    return;
                    break;
            }

            fz = topWidth;
            fw = topHeight;

            // Get the icon.
            const iconWidth = 116;
            const iconHeight = 106;

            let ix, iy, iz, iw;

            switch(card.class) {
                case "Tank":
                    iy = 0;
                    break;
                case "Spell":
                    iy = iconHeight * 2;
                    break;
                case "Assassin":
                    iy = iconHeight * 4;
                    break;
                case "Ranged":
                    iy = iconHeight * 6;
                    break;
                case "Fighter":
                    iy = iconHeight * 8;
                    break;
                case "Totem":
                    iy = iconHeight * 10;
                    break;
            }

            switch(card.rarity) {
                case "Common":
                    switch(card.theme) {
                        case "Neutral":
                            ix = 0;
                            break;
                        case "Adventure":
                            ix = iconWidth;
                            break;
                        case "Sci-Fi":
                            ix = iconWidth * 2;
                            break;
                        case "Mystical":
                            ix = iconWidth * 3;
                            break;
                        case "Fantasy":
                            ix = iconWidth * 4;
                            break;
                    }
                    break;
                case "Rare":
                    iy += iconHeight;
                    ix = 0;
                    break;
                case "Epic":
                    iy += iconHeight;
                    ix = iconWidth;
                    break;
                case "Legendary":
                    iy += iconHeight;
                    ix = iconWidth * 2;
                    break;
            }

            iz = iconWidth;
            iw = iconHeight;

            // Get the overlay.
            const overlayWidth = 305;
            const overlayHeight = 418;

            let ox, oy, oz, ow;

            oy = 0;

            switch(card.class) {
                case "Spell":
                    ox = overlayWidth;
                    break;
                default:
                    ox = 0;
                    break;
            }

            oz = overlayWidth;
            ow = overlayHeight;

            // Card theme icons.
            const themeIconSheet = {
                x: 0,
                y: 0,
                width: 180,
                height: 24
            };

            const themeIconWidth = 36;
            const themeIconHeight = 24;

            let tx, ty, tz, tw;

            ty = 0;

            switch(card.theme) {
                case "Neutral":
                    tx = 0;
                    break;
                case "Adventure":
                    tx = themeIconWidth;
                    break;
                case "Sci-Fi":
                    tx = themeIconWidth * 2;
                    break;
                case "Mystical":
                    tx = themeIconWidth * 3;
                    break;
                case "Fantasy":
                    tx = themeIconWidth * 4;
                    break;
                default:
                    message.reply("theme not found");
                    return;
                    break;
            }

            tz = themeIconWidth;
            tw = themeIconHeight;

            // Crystal things.
            const crystalSheet = {
                x: 0,
                y: 24,
                width: 180,
                height: 76 // 36 + 4 + 36
            };

            const crystalWidth = 36;
            const crystalHeight = 36;

            let cx, cy, cz, cw;

            cy = crystalSheet.y;

            switch(card.rarity) {
                case "Common":
                    switch(card.theme) {
                        case "Neutral":
                            cx = 0;
                            break;
                        case "Adventure":
                            cx = crystalWidth;
                            break;
                        case "Sci-Fi":
                            cx = crystalWidth * 2;
                            break;
                        case "Mystical":
                            cx = crystalWidth * 3;
                            break;
                        case "Fantasy":
                            cx = crystalWidth * 4;
                            break;
                        default:
                            message.reply("theme not found");
                            return;
                            break;
                    }
                    break;
                case "Rare":
                    cy += crystalHeight + 4;
                    cx = 17;
                    break;
                case "Epic":
                    cy += crystalHeight + 4;
                    cx = 34 + crystalWidth;
                    break;
                case "Legendary":
                    cy += crystalHeight + 4;
                    cx = 34 + crystalWidth * 2;
                    break;
                default:
                    message.reply("rarity not found");
                    return;
                    break;
            }

            cz = crystalWidth;
            cw = crystalHeight;

            if (card.rarity === "Legendary") {
                cz += 17;
            }

            // Make the image.
            const bgWidth = 455;
            const bgHeight = 630;

            // image overlaying stuff.
            let bg = await new jimp(800, 1200);
            let cardArt = await jimp.read(path.join(__dirname, "assets", "art", "cards", card.art));
            let frameOverlay = jimpAssets.frameOverlays.clone().crop(ox, oy, oz, ow).resize(bgWidth, bgHeight);
            let frameOutline = jimpAssets.frameOutlines.clone().crop(x, y, z, w).resize(bgWidth, bgHeight);
            let typeIcon = jimpAssets.typeIcons.clone().crop(ix, iy, iz, iw).scale(1.5);
            let themeIcon = jimpAssets.miscIcons.clone().crop(tx, ty, tz, tw).scale(1.5);
            let crystal = jimpAssets.miscIcons.clone().crop(cx, cy, cz, cw).scale(1.5);

            let frameTop;
            if (fy !== undefined) {
                frameTop = jimpAssets.frameTops.clone().crop(fx, fy, fz, fw).resize(bgWidth + 49, 200);
            }

            bg.composite(cardArt, bg.bitmap.width / 2 - cardArt.bitmap.width / 2, bg.bitmap.height / 2 - cardArt.bitmap.height / 2);
            bg.composite(frameOverlay, bg.bitmap.width / 2 - frameOverlay.bitmap.width / 2, bg.bitmap.height / 2 - frameOverlay.bitmap.height / 2);
            bg.composite(frameOutline, bg.bitmap.width / 2 - frameOutline.bitmap.width / 2, bg.bitmap.height / 2 - frameOutline.bitmap.height / 2);

            if (fy !== undefined) {
                bg.composite(frameTop, (bg.bitmap.width / 2 - frameTop.bitmap.width / 2) - 8, 240);
            }

            bg.composite(typeIcon, 130, 182);
            bg.composite(themeIcon, (bg.bitmap.width / 2 - themeIcon.bitmap.width / 2) - 168, 843);

            let xoffset = 0;
            if (card.rarity === "Legendary") {
                xoffset = 25;
            }

            bg.composite(crystal, (bg.bitmap.width / 2 - themeIcon.bitmap.width / 2) - 168 - xoffset, 745);

            if (card.name instanceof Array) {
                printCenter(bg, jimpAssets.sp25Font, 20, 315, card.name[0]);
            } else {
                printCenter(bg, jimpAssets.sp25Font, 20, 315, card.name);
            }

            printCenter(bg, jimpAssets.sp60Font, -168, 350, card.energy.toString());

            if (ox === 0) {
                printCenter(bg, jimpAssets.sp27Font, -168, 515, card.levels[cardLevel - 1].upgrades[0].health.toString());
                printCenter(bg, jimpAssets.sp27Font, -168, 640, card.levels[cardLevel - 1].upgrades[0].attack.toString());
            }

            printCenter(bg, jimpAssets.sp16Font, 17, 358, `lvl ${card.levels[cardLevel - 1].level}`);

            let levelIndex = 0;
            for (let i = cardLevel; i > 0; i--) {
                if (card.levels[i - 1] === undefined) {
                    continue;
                }
                if (card.levels[i - 1].upgrades[0].ability_info === null) {
                    continue;
                }
                if (card.levels[i - 1].upgrades[0].ability_info.description === null) {
                    continue;
                }

                levelIndex = i - 1;
                break;
            }
            printCenterCenter(bg, jimpAssets.sp18Font, 20, 510, card.levels[levelIndex].upgrades[0].ability_info.description, 325);

            bg.autocrop(0.0002, false);

            while (cardSending === true) {
                await timeout(200);
            }

            cardSending = true;

            bg.write(path.join(__dirname, "assets", `temp.png`), async function() {

                await message.channel.send("", {
                    file: path.join(__dirname, "assets", `temp.png`)
                });

                const embed = new discord.RichEmbed();

                if (card.name instanceof Array) {
                    embed.setAuthor(card.name[0]);
                } else {
                    embed.setAuthor(card.name);
                }
                embed.setDescription("");

                // Card info.
                /*
                    Attack Info:
                    Attack Range:
                    Attack Speed:
                    Pre Attack Delay:
                    Time Between Attacks:

                    Ability Info:
                    Charge Time:
                    Ability Power:
                    Ability Range:
                    Ability Duration: 

                    Speed:
                    Max Speed:
                */

                // Spells
                // just ability power

                // Anything other than spells
                // everything, but ability info only sometimes (only if ability === true)

                //embed.setDescription(`some text... ${"variable goes here without the quotations"}\n for new line`);
                //embed.description += `may be useful if you need to add conditional sttuff, in an if statement`;

            
                //card.attack_info.pre_attack_delay

                const removeNull = (str, check) => {
                    if (check === undefined || check === null) {
                        return "";
                    }
                    return str + check + "\n";
                }

                if (card.class !== "Spell" && card.levels[levelIndex].upgrades[0].ability_info.ability === true) {                
                    let tempDesc = "";

                    tempDesc += removeNull("Attack Range: ", card.attack_info.attack_range);
                    tempDesc += removeNull("Attack Speed: ", card.attack_info.attack_speed);
                    tempDesc += removeNull("Pre Attack Delay: ", card.attack_info.pre_attack_delay);
                    tempDesc += removeNull("Time Between Attacks: ", card.attack_info.time_between_delay);

                    if (tempDesc !== "") {
                        embed.description += `**Attack Info:**\n${tempDesc}`;
                        tempDesc = "";
                    }

                    tempDesc += removeNull("Charge Time: ", card.levels[levelIndex].upgrades[0].ability_info.charge_time);
                    tempDesc += removeNull("Ability Power: ", card.levels[levelIndex].upgrades[0].ability_info.ability_power);
                    tempDesc += removeNull("Ability Range: ", card.levels[levelIndex].upgrades[0].ability_info.ability_range);
                    tempDesc += removeNull("Ability Duration: ", card.levels[levelIndex].upgrades[0].ability_info.ability_duration);

                    if (tempDesc !== "") {
                        embed.description += `\n**Ability Info:**\n${tempDesc}`;
                        tempDesc = "";
                    }

                    tempDesc += removeNull("Max Speed: ", card.speed_info.max_speed);

                    if (tempDesc !== "") {
                        embed.description += `\n**Speed Info:**\n${tempDesc}`;
                        tempDesc = "";
                    }
                }
                if (card.class !== "Spell" && card.levels[levelIndex].upgrades[0].ability_info.ability === false) {                
                    let tempDesc = "";

                    tempDesc += removeNull("Attack Range: ", card.attack_info.attack_range);
                    tempDesc += removeNull("Attack Speed: ", card.attack_info.attack_speed);
                    tempDesc += removeNull("Pre Attack Delay: ", card.attack_info.pre_attack_delay);
                    tempDesc += removeNull("Time Between Attacks: ", card.attack_info.time_between_delay);

                    if (tempDesc !== "") {
                        embed.description += `**Attack Info:**\n${tempDesc}`;
                        tempDesc = "";
                    }

                    tempDesc += removeNull("Max Speed: ", card.speed_info.max_speed);

                    if (tempDesc !== "") {
                        embed.description += `\n**Speed Info:**\n${tempDesc}`;
                        tempDesc = "";
                    }
                }
                if (card.class === "Spell") {
                    let tempDesc = "";

                    tempDesc += removeNull("Ability Power: ", null);
                    tempDesc += removeNull("Ability Range: ", null);
                    tempDesc += removeNull("Ability Duration: ", null);

                    if (tempDesc !== "") {
                        embed.description += `**Ability Info:**\n${tempDesc}`;
                        tempDesc = "";
                    }
                }

                // Debug info and disclaimer.
                if (card.name === "Redlynx Disclaimer") {
                    embed.description += "This content is in no way approved, endorsed, sponsored, or connected to South Park Digital Studios, Ubisoft, RedLynx, or associated/affiliated entities, nor are these entities responsible for this content. This content is subject to all terms and conditions outlined by the South Park: Phone Destroyer Fan Content guidelines.";
                }

                if (message.content.split(" ")[0].substring(guild.settings.prefix.length) === "dcard") {
                    embed.description += `\n**Debug info:**\ndebug-similarity: ${current}\n`;
                }

                embed.description += `\n[Redlynx Disclaimer](https://awesomobot.com/disclaimer) • [Card Data](https://southparkphone.gg/)`;

                switch(card.theme) {
                    case "Neutral":
                        embed.setColor(0x857468);
                        break;
                    case "Adventure":
                        embed.setColor(0x4f80ba);
                        break;
                    case "Sci-Fi":
                        embed.setColor(0xdb571d);
                        break;
                    case "Mystical":
                        embed.setColor(0x4b9b38);
                        break;
                    case "Fantasy":
                        embed.setColor(0xd34f5f);
                        break;
                    default:
                        message.reply("theme not found");
                        return;
                        break;
                }

                await message.channel.send(embed);

                cardSending = false;
            });
        }
    }),
    new Command({
        name: "mod-orgy-all",
        desc: "",
        type: "command",
        match: "mod-orgy-all",
        call: function (client, message, guild) {
            //894F75
            //99212F
            //34295C
            //F26D7D
            message.channel.send("", {
                file: "https://cdn.discordapp.com/attachments/430447280932388865/435893712090824705/matt_x_jackie.png"
            }).then(() => {
                message.channel.send(new discord.RichEmbed().setColor("894F75").setAuthor("Matt x Jackie").setDescription("To be honest, the receiver and giver should be flipped as Matt usually takes it up the ass from Jackie. However, it's not very often as Matt tends to not respond to her prayers. This can also be applied to the kitchen, not in the sexist way, but in the way that Matt can’t cook for shit and relies on microwaveable ready meals from Tesco and Domino’s Pizza since apparently using pots and pans is a concept that is far beyond the grasp of his mental abilities. One thing that does bring Jackie and Matt together is their love for metal, and especially since Jackie is of the German persuasion, they can be listening to Rammstein while Rammsteining each other. The original mods wrote an elaborate setup to how Matt is a drunken mess. But when you know yourself better than anyone else, you can just say that he is an alcoholic destined to be lying in a puddle of his own vomit in an alleyway in Belfast.\n\nThe fact that Matt had to write this instead of the other mods tells you how good he is at writing pure bullshit (and talking in the third person about himself like a narcissist).")).then(() => {
                    message.channel.send("", {
                        file: "https://cdn.discordapp.com/attachments/430447280932388865/435893752461262849/tweek_x_nadia.png"
                    }).then(() => {
                        message.channel.send(new discord.RichEmbed().setColor("99212F").setAuthor("Tweek x Nadia").setDescription("Deep in the heart of anime land, two weeaboos are prepared to ”duel”. The first, known as Tweek Tweak, is a fierce and fast osu! extraordinaire. With his super fast fingering technique he gained from hours of perfecting weeb shit in osu!, he plans to slay his opponent in more ways than one. The second, known as Pariston, gained all her knowledge from her mentor, Tweek Tweak. Even since Pariston picked up osu!, she dreamed about Tweek Tweaks inhuman fingering speeds. Now, she wants to show Tweek Tweak exactly what she's learned after months of studying every single aspect of Tweek Tweak. And I mean... Every aspect... She plans to use her ultimate attack named the Silent Treatment™, which cuts any communication, attempting to cause a feeling accustomed to guilt. However, this attack usually doesn't work.")).then(() => {
                            message.channel.send("", {
                                file: "https://cdn.discordapp.com/attachments/430447280932388865/435893779740753931/fenny_x_towel.png"
                            }).then(() => {
                                message.channel.send(new discord.RichEmbed().setColor("34295C").setAuthor("Fenny x Towel").setDescription("*Note: Like he does with most things, Towel will probably take offense to this…*\n\nWhenever Towel found out about this special occasion, he used every opportunity to reuse his original name that he has tried so desperately to rebrand to TowelRoyale, (which is *totally* a better name might I add) since he can finally use it to the fullest extent with his new bum buddy. [From a recent kink test](https://cdn.discordapp.com/attachments/422906027088805908/430493711869280260/1.PNG), we found out that he loves size difference since he’s a short chubby boii. This session with Fenny will be his first, but that’s no problem, since he also noted he liked too. Whenever Towel isn’t getting his hole resized, he likes having a chuckle and a good ol’ rub at some good ol’ memes like the Globglogabgalab, making the pairing even more perfect due to the visual similarities of Fenny and the aforementioned. Here is the obligatory part where I’m supposed to make fun of Fenny but I can’t because she’s dead on, unlike Towel. But you know what they say, opposites attract.")).then(() => {
                                    message.channel.send("", {
                                        file: "https://cdn.discordapp.com/attachments/430447280932388865/435893814067200003/nodejs_x_dragon.png"
                                    }).then(() => {
                                        message.channel.send(new discord.RichEmbed().setColor("F26D7D").setAuthor("Node.js x Dragon").setDescription("Somewhere under the grey skies of the south, amongst the life-in-debt housing in Dublin town, A young gypo-weeb boy prepares his adventure into a new project funded by the money he has been laundering from Patreon. The gypo boots up Visual Studio and prepares to write his project in C++. However, in the distance, he hears a faint whisper calling out “npm init”. Little did he know, JavaScript was ready to fuck him straight in the ass, no lube. The gypo boy cries out for salvation, he installs more node modules to cut the total amount of work, but he complains about the functionality of these modules like how he complains about everything. Patrons start realising how little work is being done, but the gypo cries out in pain because he just rewrote the backend for the nth time hoping for it to be different. He realises, he just needs to accept that JavaScript will always be there, to love and to sodomise the young gypo. “npm install --save anal”\n\nNode.js is love, Node.js is life"));
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    }),
    new Command ({
        name: "resistance",
        desc: "",
        type: "command",
        match: "resistance",
        call: function (client, message, guild) {
            message.channel.send(new discord.RichEmbed().setColor(0xff594f).setImage("https://cdn.discordapp.com/attachments/394504208222650369/451833476929552384/Flag.png")).then(() => {
                message.channel.send(new discord.RichEmbed().setColor(0xff594f).setDescription("Welcome to the first **Feinwaru Software** update. Here, we will be discussing why this server exists and what happened to **/r/SouthPark.**\n\nTo put it simply, this server exists because a certain reddit moderator was acting extremely stubborn for an unacceptable amount of time, and we were fed up with it. **We will no longer be active on that server,** let alone moderate it under such a dictatorship. This wasn't the best possible outcome, but it's the outcome we have and must make work.\n\nThat being said, we hope this server is as enjoyable as the **/r/SouthPark** server, if not more enjoyable. Nothing is going to change and we will still be hosting events as if nothing had changed.\n\nThanks for understanding our circumstances and joining us on this new journey. **Viva la Resistance!**"));
            });
        }                        
    }),
    new Command({
        name: "welcome-all",
        desc: "",
        type: "command",
        match: "welcome-all",
        call: function (client, message, guild) {
            message.channel.send(new discord.RichEmbed().setColor(0xff594f).setImage("https://cdn.discordapp.com/attachments/394504208222650369/451822849041235998/feinwaru-welcome.png")).then(() => {
                message.channel.send(new discord.RichEmbed().setColor(0xff594f).setDescription("**Before you start jumping into different rooms and such;**\nMake sure you have read and understand our rules as well as the discord community guidelines: https://discordapp.com/guidelines\n\nNow go jump into <#449651727856304153> and let others know you're here!")).then(() => {
                    message.channel.send(new discord.RichEmbed().setColor(0xff594f).setImage("https://cdn.discordapp.com/attachments/394504208222650369/451830420170997770/feinwaru-rules-small.png")).then(() => {
                        message.channel.send(new discord.RichEmbed().setColor(0xff594f).setDescription("**1.** Don't be racist, sexist, homophobic or transphobic.\n**2.** Keep spamming restricted to <#451494933002453013> and <#451492401626873857>.\n**3.** Repeated trolling will result in a kick followed by a ban.\n**4.** Harassment of other members is not allowed.\n**5.** No NSFW images are permitted in this Christian server.\n**6.** Don't be a dick. You don't want to be like Scott or 2th.")).then(() => {
                            message.channel.send(new discord.RichEmbed().setColor(0xff594f).setImage("https://cdn.discordapp.com/attachments/394504208222650369/451830502135955457/feinwaru-about-small.png")).then(() => {
                                message.channel.send(new discord.RichEmbed().setColor(0xff594f).setDescription("**Feinwaru Software** is a group of programmers who work on Discord related things, such as the **AWESOM-O** bot. We created **AWESOM-O** from the ground up to be a interactive and fun South Park discord bot, and have been consistently adding new features on a regular basis.\n\nWe created this server as we were former moderators on the official **/r/SouthPark** discord server, but after many complications with a certain member of the reddit team and being unable to produce the environment we wanted for our long time regulars, we decided to create this server to promote our brand and get a fresh start.")).then(() => {
                                    message.channel.send(new discord.RichEmbed().setColor(0xff594f).setImage("https://cdn.discordapp.com/attachments/394504208222650369/451830526077042688/feinwaru-channels-small.png")).then(() => {
                                        message.channel.send(new discord.RichEmbed().setColor(0xff594f).setDescription("For **updates and server news,** check out <#449651727856304153>. All our staff members have written a short introduction in <#449651675334967306>, just in case you want to get to know us better.\n\nPlease use the appropriate channels for your conversations, such as South Park talk being restricted to the South Park category. When in doubt, use <#449656364097208352>.\n\nIf you love [**AWESOM-O**](https://awesomobot.com/) and want to support the server, consider donating on our [**Patreon**](https://www.patreon.com/awesomo/overview) to gain exclusive channel access, custom comamnds and many other perks!\n\nSince this server was for the Feinwaru brand, South Park is no longer the main focus. However, we haven't left those of you who care about South Park out. As such, we have an entire section dedicated to South Park discussion named **South Park,** so be sure to discuss the show there!\n\nCan't talk in VC but still want to take part in the conversation? Just use <#451816813450231809>!")).then(() => {
                                            message.channel.send(new discord.RichEmbed().setColor(0xff594f).setImage("https://cdn.discordapp.com/attachments/394504208222650369/451830543009710080/feinwaru-roles-small.png")).then(() => {
                                               message.channel.send(new discord.RichEmbed().setColor(0xff594f).setDescription("Our staff team ensures that everything runs smoothly and organises events for the community. If you have any issues, dont be afraid to tag <@&438701780482785282> or <@&449652228991746048>. **They're always happy to help!**\n\nOur regulars are given <@&451511710516510721>, which allows them to join any of the four other groups; <@&451496801263026187>, <@&451496691552747520>, <@&449653147460436018> or <@&451496529673584640>. If you're active and nice in chat, you'll be given the role by one of our mods.\n\n<@&451818736718970881> are the special people who create and post their art in our server. You don't need to be the best out there to get this role, just share some of your art with us!")).then(() => {
                                                   message.channel.send(new discord.RichEmbed().setColor(0xff594f).setImage("https://cdn.discordapp.com/attachments/394504208222650369/451831750113361920/feinwaru-patreon-small.png")).then(() => {
                                                       message.channel.send(new discord.RichEmbed().setColor(0xff594f).setDescription("While what we do is free and we will never directly ask for money, we do take Patreon donations from users. 100% of the donations we collect will go towards the future of AWESOM-O, such as paying for server slots and domain payments. **We will never use this money for anything else other than that.** By becoming a patron, you help us evolve AWESOM-O and our future projects, while also gaining some cool server perks.\n\nWe appreciate every member in this server, regardless of donations or not. **You simply being here keeps the server alive, and we can't thank you enough for that.**"));
                                                   });
                                               });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    }),
    new Command({
        name: "meet-the-mods-all",
        desc: "",
        type: "command",
        match: "meet-the-mods-all",
        call: function (client, message, guild) {
            message.channel.send("", {
                "file": "https://cdn.discordapp.com/attachments/379432139856412682/418870934657695755/dragontest.png",
            }).then(() => {
                message.channel.send(new discord.RichEmbed().setColor(0x83CD29).setAuthor("About Dragon1320").setDescription("**Age:** 19 soon™\n**Birthday:** Some time in October, so not THAT soon\n**Country:** Just Ireland\n**Height:** 1.80m or something (Screw you and your non SI units)\n**Handedness:** Right\n**Favourite South Park character(s):** Kyle/Kenny\n**Typing speed:** 5WPM (While coding)\n\nI'm just that top kek programmer guy. Yes, that one in the corner over there! I have well over 10k hours on ~~League of legends~~ visual studio and stack overflow. I'm currently in a love-hate relationshit with golang and node.js. After a rough break-up with c++, ~~insert gender pronoun~~ threw a bunch of compiler errors at me, so we are definitely over.\n\nTotally not a weeb tho, *goes back to watching anime*. My [weeb cert](https://puu.sh/zhF9k/2682322f3b.png) has recently expired, but i assure you, with my waifu body pillow and [this](http://learnjapanese.com/) website i will one day become a true Japanese boii.\n\nIt just so happens that I'm also a filthy casual gamer, addicted to osu, which I'm shit at. DDLC is also among my favourite games. Yes the dokis are real and Natsuki is the one true waifu, and please don't try to convince me otherwise. I'm mostly into indie games if you couldn't tell already.\n\nAs for discord, I've been here for over 2 years, and don't plan on leaving anytime soon, so it looks like you're gonna be stuck with me for a while. I wanna continue working on improving this server in a way that allows you to have fun and enjoy yourselves!")).then(() => {
                    message.channel.send("", {
                        "file": "https://cdn.discordapp.com/attachments/379432139856412682/418869505951924224/test2.png",
                    }).then(() => {
                        message.channel.send(new discord.RichEmbed().setColor(0xEFA902).setAuthor("About Mattheous (English: mɑˈθeɪɒs)").setDescription("**Age:** 19 ½\n**Birthday:** 14th August\n**Country:** Northern Ireland (yes it’s a separate country, use the google plz)\n**Height:** 5’11” (i’m one inch away from being a big boii)\n**Handedness:** Right\n**Favourite South Park Character:** Everyone knows it’s Butters!\n**Typing Speed:** ~90WPM\n**Timezone:** UTC+0\n\nI like to think I can program, but my skills are limited to changing the class tag in bootstrap and copy pasting from mdb-bootstrap. My real “talents” are in music. I am a multi-instrumentalist (woah long words) and I am a huge fanboy of anything progressive metal/rock. \n\nI can speak some Spanish and French so don’t be afraid to talk to me in those languages. I can also say “I like big dick” in Japanese so I’m basically fluent. I also have an unhealthy addiction to Cadbury dairy milk and custard creams. \n\nBesides being an elite class hackerman™, I’m also an elite gamer girl™, playing all of the absolutely mad lad games like overwatch and guitar hero. Tesco Vodka and a 2 litre bepis is my idea of an absolute banger of an evening. Just down that vodka and you’ll be [putting freezer drawers on your head in no time!](https://cdn.discordapp.com/attachments/379432139856412682/418884884098973698/unknown.png).")).then(() => {
                            message.channel.send("", {
                                "file": "https://cdn.discordapp.com/attachments/394504208222650369/431954081184219136/mod_temlate_shittified_by_me.png",
                            }).then(() => {
                                message.channel.send(new discord.RichEmbed().setColor(0x1F3250).setAuthor("About TowelRoyale").setDescription("**Age:** 17 \n**Birthday:** 11th November\n**Country:** England\n**Height:** 5’2” / 159cm \n**Handedness:** Right \n**Favorite South Park Character:** Kyle / Towelie\n**Typing speed:** ~45wpm\n**Timezone:** UTC+0\n\nHi. My name is Jaike, and I'm a Towelie enthusiast. I especially enjoy graphic design and things ICT related. My first episode of South Park was 'Cat Orgy,' and ever since then, my love for this show has grown immensely, especially with the most recent games like Stick of Truth and Fractured but Whole. I also enjoy gaming. My favourite gaming company is Nintendo as they favour gameplay over graphics. My favourite quote is 'If it's not fun, why bother?' from Reggie Fils-Amié, President and COO of Nintendo. I will play games from other companies if I like them though! My favourite movies include Space Jam, Help! I’m a Fish and, of course, Bigger, Longer and Uncut!\n\nIf you ever need me, feel free to @ me or DM me. I'll respond instantly most times.\n\n**Don't forget to bring a towel!**")).then(() => {
                                    message.channel.send("", {
                                        "file": "https://cdn.discordapp.com/attachments/430447280932388865/456523101379756043/duckyduckyboiquackquacklmao_ifyouseethis_knowthatmattisbestadmin.png",
                                    }).then(() => {
                                        message.channel.send(new discord.RichEmbed().setColor(0xab1b2d).setAuthor("About Duck").setDescription("**Age:** 15\n**Birthday:** 18th December \n**Country:** Kazakhstan \n**Height:** 1.59m\n**Handedness:** Right\n**Favourite South Park Character:** Dogpoo / Craig\n**Typing Speed:** 30 wpm\n\nHey, it's me, duck! I'm an animator, I make parodies and I use toon boom to make them! I also make thousands of animation rigs, but I use only 1/4 of them.\n\nIn the future, I would like to be a 2D asset artist, 2D animator for games, or possibly anything that involves 2D art! I also have a piano, but I rarely play it that much since I work on other projects. My favourite type of music is chillwave and pop. \n\nArt and animation asides, I love games like Fallout, Serious Sam and Crash Bandicoot. I have many favourites, but these are my top picks! My favourite TV shows are South Park, Dexters Lab, and The Office! \n\nI'm often active on Discord so if you need help with something, I could help! Just @ me!")).then(() => {
                                            message.channel.send("", {
                                                "file": "https://cdn.discordapp.com/attachments/394504208222650369/427536446363009024/fenny.png",
                                            }).then(() => {
                                                message.channel.send(new discord.RichEmbed().setColor(0x5D1773).setAuthor("About Fenny").setDescription("**Age:** 23\n**Birthday:** 3rd of January\n**Country:** USA\n**Height:** 5’1”\n**Handedness:** Right\n**Favorite South Park Character:** Clyde\n**Typing speed:** 61 wpm\n**Timezone:** UTC-6\n\nIt’s the one, the only, Fenny! I’m currently working on my Associates for Game Dev. (specifically the art and animation side) then later down the road, I’ll be headin’ for a higher degree in the same field. I hope to one day lead an Indie Dev team, but who knows what the future holds. I love drawing with a passion, and always work time in to get at least one piece done a day. This means I am and will continue to be very active in the Electronic-Arts channel. Feel free to mention me there for some tips and pointers if any of you feel stuck!\n\nAside from art, my second biggest hobby is games! I don’t play them as much as I used to because of school, but I always take time to at least get some walkthroughs in. I’m very up to date on what’s hip and happenin’ in the game world. I gotta to be, it’ll be my job one day! I’m always up for game talk and expect me to go on spiels sometimes. There’s nothing that gets me more emotional than a game with love and thought put into it.\n\nAs of now, I’m pretty active in the chats, and I’ll see you all there! C”)_/)")).then(() => {
                                                    message.channel.send("", {
                                                        "file": "https://cdn.discordapp.com/attachments/379432139856412682/418873800168308761/tweek_tweak.png",
                                                    }).then(() => {
                                                        message.channel.send(new discord.RichEmbed().setColor(0x00264C).setAuthor("About Tweek Tweak").setDescription("**Age:** 20 \n**Birthday:** 10th January \n**Country:** Singapore \n**Height:** 5’5” (166cm) (yes I’m short af)\n**Handedness:** Right \n**Favourite South Park Character:** Tweek, Kenny\n**Typing speed:** ~105wpm \n**Time zone:** UTC+8\n\nI fell in love with South Park after learning that you can fart in The Fractured but Whole. My first episode is S15E01 HumanCENTIPAD. (Yep that is a good start) I enjoy cycling, drawing and editing videos as well. I have been trying to learn to sing without shattering glass pane in a kilometre radius but I am failing badly. I am fluent in Chinese and English and I speak a fair bit of Malay. I don’t have any plan to learn any new languages since I don’t have much free time now. I have a Tweek-like addiction for Tea and I can drink 8 cups of tea in a single day, and ironically, I hate coffee. I consider myself as a gamer. I love rhythm and simulation games especially, and I’ve spent countless hour on games like Cities Skylines and Osu! I don’t usually mind if anyone pings me if the ping is not spam. I did end up failing my English exams because I suck but I ended up going to my dream school because of my maths and science carrying my ass.")).then(() => {
                                                            message.channel.send("", {
                                                                "file": "https://cdn.discordapp.com/attachments/430447280932388865/456521485067091968/waifu_jackie.png",
                                                            }).then(() => {
                                                                message.channel.send(new discord.RichEmbed().setColor(0x591FBA).setAuthor("About Kamui").setDescription("**Age:** 19\n**Birthday:** 1st August\n**Country:** Germany\n**Height:** 1.80m (5’11” for you fancy 'muricans)\n**Handedness:** Right\n**Favourite South Park Character:** Tweek, obviously\n**Typing Speed:** ~70 WPM in English, ~80 WPM in German\n**Timezone:** UTC+1\n \nI'm Jackie, a coffee-addicted, 50% gay (but 200% fabulous), mute but cute IT student who is under stress for a living <3\n \nI'm fluent in English and German, and I learned French and Spanish at school. Currently learning japanese, because I'm also kind of a weeb. My music taste is, unfittingly to my adorable and cute personality + appearance, the very finest of Metal. Mostly alternative and nu metal like Marilyn Manson, Slipknot and Babymetal, but also some other stuff such as Infant Annihilator and Rammstein. Same goes for my interests besides gaming, I absolutely love motorcycles, guns and driving fast cars. If you ever see me not being online, I'm either at work, in a lecture, on the road or at the shooting range. :D\nYou'll notice I don't have a lot of time for Discord activities, but I'm still up for a casual game of CAH every once in a while, just don't expect me to talk to you in voice chats since god decided to hit the irl mute button on me - which is also why I'm a very shy person irl, since I can't really approach many people :D\n \nOther than that, I have a strong dislike for people taking the internet too serious and causing drama, you'll have to expect a zero-tolerance policy from me regarding that. I also hate unreasonable, simple-minded people who can't be objective when they have to, and idiots in general. As a German, I'm precise and don't give any fricks about people like that. I do have a slight sense of humor though, contrary to popular belief :P. So if you're not an idiot and if you're nice to people, hit me up for a chat and I guarantee you you'll love me <3"));
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    }),
    new Command({
        name: "meet-the-stoners-all",
        desc: "",
        type: "command",
        match: "meet-the-stoners-all",
        call: function (client, message, guild) {
            message.channel.send("", {
                "file": "https://cdn.discordapp.com/attachments/379432139856412682/436679612219523082/stoner_dragon.png",
            }).then(() => {
                message.channel.send(new discord.RichEmbed().setColor("83CD29").setAuthor("About Dragon1320").setDescription("**Age:** 19 soon™\n**Birthday:** Some time in October, so not THAT soon\n**Country:** Just Ireland\n**Height:** 1.80m or something (Screw you and your non SI units)\n**Handedness:** Right\n**Favourite South Park character(s):** Kyle/Kenny\n**Typing speed:** 5WPM (While coding)\n\nI'm just that top kek programmer guy. Yes, that one in the corner over there! I have well over 10k hours on ~~League of legends~~ visual studio and stack overflow. I'm currently in a love-hate relationshit with golang and node.js. After a rough break-up with c++, ~~insert gender pronoun~~ threw a bunch of compiler errors at me, so we are definitely over.\n\nTotally not a weeb tho, *goes back to watching anime*. My [weeb cert](https://puu.sh/zhF9k/2682322f3b.png) has recently expired, but i assure you, with my waifu body pillow and [this](http://learnjapanese.com/) website i will one day become a true Japanese boii.\n\nIt just so happens that I'm also a filthy casual gamer, addicted to osu, which I'm shit at. DDLC is also among my favourite games. Yes the dokis are real and Natsuki is the one true waifu, and please don't try to convince me otherwise. I'm mostly into indie games if you couldn't tell already.\n\nAs for discord, I've been here for over 2 years, and don't plan on leaving anytime soon, so it looks like you're gonna be stuck with me for a while. I wanna continue working on improving this server in a way that allows you to have fun and enjoy yourselves!")).then(() => {
                    message.channel.send("", {
                        "file": "https://cdn.discordapp.com/attachments/379432139856412682/436679615478628352/stoner_matt.png",
                    }).then(() => {
                        message.channel.send(new discord.RichEmbed().setColor("EFA902").setAuthor("About Mattheous (English: mɑˈθeɪɒs)").setDescription("**Age:** 19 ½\n**Birthday:** 14th August\n**Country:** Northern Ireland (yes it’s a separate country, use the google plz)\n**Height:** 5’11” (i’m one inch away from being a big boii)\n**Handedness:** Right\n**Favourite South Park Character:** Everyone knows it’s Butters!\n**Typing Speed:** ~90WPM\n**Timezone:** UTC+0\n\nI like to think I can program, but my skills are limited to changing the class tag in bootstrap and copy pasting from stack overflow. My real “talents” are in music. I am a multi-instrumentalist (woah long words) and I am a huge fanboy of anything progressive metal/rock. \n\nI can speak some Spanish and French so don’t be afraid to talk to me in those languages. I can also say “I like big dick” in Japanese so I’m basically fluent. I also have an unhealthy addiction to Cadbury dairy milk and custard creams. \n\nBesides being an elite class hackerman™, I’m also an elite gamer girl™, playing all of the absolutely mad lad games like sonic 2 and guitar hero. Tesco Vodka and a 2 litre bepis is my idea of an absolute banger of an evening. Just down that vodka and you’ll be [putting freezer drawers on your head in no time!](https://cdn.discordapp.com/attachments/379432139856412682/418884884098973698/unknown.png) I also have a habit of saying “I also” because I can’t form proper sentences, hence why I nearly failed GCSE English lol.")).then(() => {
                            message.channel.send("", {
                                "file": "https://cdn.discordapp.com/attachments/379432139856412682/436679620566450177/stoner_towel.png",
                            }).then(() => {
                                message.channel.send(new discord.RichEmbed().setColor("1F3250").setAuthor("About TowelRoyale").setDescription("**Age:** 17 \n**Birthday:** 11th November\n**Country:** England\n**Height:** 5’2” / 159cm (I'm not tiny, i'm compact)\n**Handedness:** Right \n**Favorite South Park Character:** Kyle / Towelie\n**Typing speed:** ~45wpm\n**Timezone:** UTC+0\n\nHi. My name is Jaike, and I'm a Towelie enthusiast. I especially enjoy graphic design and things ICT related. My first episode of South Park was 'Cat Orgy,' and ever since then, my love for this show has grown immensely, especially with the most recent games like Stick of Truth, Fractured but Whole and Phone Destroyer. I also enjoy gaming. My favourite gaming company is Nintendo, though I will play games from other companies if I like them! My favourite movies include Space Jam, Help! I’m a Fish and, of course, Bigger, Longer and Uncut!\n\nIf you ever need me, feel free to @ me or DM me. I'll respond instantly most times.")).then(() => {
                                    message.channel.send("", {
                                        "file": "https://cdn.discordapp.com/attachments/379432139856412682/436679612819308545/stoner_fenny.png",
                                    }).then(() => {
                                        message.channel.send(new discord.RichEmbed().setColor("5D1773").setAuthor("About Fenny").setDescription("**Age:** 23\n**Birthday:** 3rd of January\n**Country:** USA\n**Height:** 5’1”\n**Handedness:** Right\n**Favorite South Park Character:** Clyde\n**Typing speed:** 61 wpm\n**Timezone:** CST\n\nIt’s the one, the only, Fenny! I’m currently working on my Associates for Game Dev. (specifically the art and animation side) then later down the road, I’ll be headin’ for a higher degree in the same field. I hope to one day lead an Indie Dev team, but who knows what the future holds. I love drawing with a passion, and always work time in to get at least one piece done a day. This means I am and will continue to be very active in the Electronic-Arts channel. Feel free to mention me there for some tips and pointers if any of you feel stuck!\n\nAside from art, my second biggest hobby is games! I don’t play them as much as I used to because of school, but I always take time to at least get some walkthroughs in. I’m very up to date on what’s hip and happenin’ in the game world. I gotta to be, it’ll be my job one day! I’m always up for game talk and expect me to go on spiels sometimes. There’s nothing that gets me more emotional than a game with love and thought put into it.\n\nAs of now, I’m pretty active in the chats, and I’ll see you all there! C”)_/)")).then(() => {
                                            message.channel.send("", {
                                                "file": "https://cdn.discordapp.com/attachments/379432139856412682/436679617114538000/stoner_nadia.png",
                                            }).then(() => {
                                                message.channel.send(new discord.RichEmbed().setColor("E51E20").setAuthor("About Pariston Hill").setDescription("**Age:** 23\n**Birthday:** 3rd June\n**Country:** Italy\n**Height:** 1.53m\n**Handedness:** Right\n**Favourite South Park Character:** Kenny, Gregory, Tweek and many others\n**Typing speed:** ~1 WPM\n**Time zone:** GMT+1\n\nHi I’m Nadia. I fell in love with South Park years ago, when I was a teen. \nThe first episode I watched was “Bloody Mary”. I started with that one because at the time it was one of the three episodes that had been censored in my country (it was impossible to find it on tv so I watched it directly online) and I was really curious to see why it had caused so much “scandal” here. After watching it, I immediately fell in love with this series and I continued watching it until I have seen all the seasons. I’ve always been keen on satire and parody and South Park has never disappointed me once. \nI like anime, video games (I can easily get addicted to online games, even the silly ones xP) and tv series(I’ve lost track of how many series i’ve watched in my entire life). \n\nI’m also interested in history,philosophy,and psychology and I love to learn new languages. I’m currently studying English and French, but in the past I’ve also studied Japanese, Latin and Ancient Greek. I’d like to learn German and Portuguese in the future as well. \nOne of my passions is also baking cakes and preparing anything sweet :P.\n\nFeel free to contact me anytime to talk about whatever you’d like, me and the others are always here for you all  <3")).then(() => {
                                                    message.channel.send("", {
                                                        "file": "https://cdn.discordapp.com/attachments/379432139856412682/436679621090607126/stoner_tweek.png",
                                                    }).then(() => {
                                                        message.channel.send(new discord.RichEmbed().setColor("00264C").setAuthor("About Tweek Tweak").setDescription("**Age:** 20 \n**Birthday:** 10th January \n**Country:** Singapore \n**Height:** 5’5” (166cm) (yes I’m short af)\n**Handedness:** Right \n**Favourite South Park Character:** Tweek, Kenny\n**Typing speed:** ~105wpm \n**Time zone:** UTC+8\n\nI fell in love with South Park after learning that you can fart in The Fractured but Whole. My first episode is S15E01 HumanCENTIPAD. (Yep that is a good start) I enjoy cycling, drawing and editing videos as well. I have been trying to learn to sing without shattering glass pane in a kilometre radius but I am failing badly. I am fluent in Chinese and English and I speak a fair bit of Malay. I don’t have any plan to learn any new languages since I don’t have much free time now. I have a Tweek-like addiction for Tea and I can drink 8 cups of tea in a single day, and ironically, I hate coffee. I consider myself as a gamer. I love rhythm and simulation games especially, and I’ve spent countless hour on games like Cities Skylines and Osu! I don’t usually mind if anyone pings me if the ping is not spam. I did end up failing my English exams because I suck but I ended up going to my dream school because of my maths and science carrying my ass.")).then(() => {
                                                            message.channel.send("", {
                                                                "file": "https://cdn.discordapp.com/attachments/379432139856412682/436679614333583403/stoner_jackie.png",
                                                            }).then(() => {
                                                                message.channel.send(new discord.RichEmbed().setColor("591FBA").setAuthor("About Kamui").setDescription("**Age:** 19\n**Birthday:** 1st August\n**Country:** Germany\n**Height:** 1.80m (5’11” for you fancy 'muricans)\n**Handedness:** Right\n**Favourite South Park Character:** Tweek, obviously\n**Typing Speed:** ~70 WPM in English, ~80 WPM in German\n**Timezone:** UTC+1\n \nI'm Jackie, a coffee-addicted, 50% gay (but 200% fabulous), mute but cute IT student who is under stress for a living <3\n \nI'm fluent in English and German, and I learned French and Spanish at school. Currently learning japanese, because I'm also kind of a weeb. My music taste is, unfittingly to my adorable and cute personality + appearance, the very finest of Metal. Mostly alternative and nu metal like Marilyn Manson, Slipknot and Babymetal, but also some other stuff such as Infant Annihilator and Rammstein. Same goes for my interests besides gaming, I absolutely love motorcycles, guns and driving fast cars. If you ever see me not being online, I'm either at work, in a lecture, on the road or at the shooting range. :D\nYou'll notice I don't have a lot of time for Discord activities, but I'm still up for a casual game of CAH every once in a while, just don't expect me to talk to you in voice chats since god decided to hit the irl mute button on me - which is also why I'm a very shy person irl, since I can't really approach many people :D\n \nOther than that, I have a strong dislike for people taking the internet too serious and causing drama, you'll have to expect a zero-tolerance policy from me regarding that. I also hate unreasonable, simple-minded people who can't be objective when they have to, and idiots in general. As a German, I'm precise and don't give any fricks about people like that. I do have a slight sense of humor though, contrary to popular belief :P. So if you're not an idiot and if you're nice to people, hit me up for a chat and I guarantee you you'll love me <3"));
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
    }),
    /*
    new Command({
        name: "play",
        desc: "*should* stream a youtube video",
        type: "command",
        match: "play",
        call: async function (client, message, guild) {

            if (message.member.voiceChannel === null) {
                message.reply("member not in voice channel");
                return;
            }

            const args = message.content.split(" ");
            if (args[1] === undefined) {
                message.reply("url undefined");
                return;
            }

            let conn = client.voiceConnections.find(e => {
                return e.channel.id === message.member.voiceChannel.id;
            });
            if (conn === null) {
                conn = await message.member.voiceChannel.join();
            }

            const streamOptions = { seek: 0, volume: 1};
            const stream = ytdl(args[1], { filter: "audioonly" });

            let disp = conn.playStream(stream, streamOptions);
            disp.on("end", () => {
                conn.disconnect();
            });
        }
    }),
    */
    new Command({
        name: "advice",
        desc: "Awesom-e advice!",
        type: "command",
        match: "advice",
        call: function(client, message, guild) {
            let advice = [
                "Stop being so lame. It's not kewl.",
                "Kill all jews... and gingers...",
                "Respect Eric Cartman. He is totally cool and not at all lame.",
                "Kid picking on you? Turn their parents into chili and feed it to them.",
                "Not invited to a party? Trick the most gullible kid.",
                "Need a superhero? Call on the Coon! He is the saviour this town needs!",
                "Have no idea what to do? Think: What would Brian Boitano do?"
            ];
            let advicerandom = advice[Math.floor(Math.random() * advice.length)];
            message.reply("**Here's some advice:** " + advicerandom);
        }
    }),
    new Command({
        name: "kickbaby",
        desc: "Awesom-e advice!",
        type: "startswith",
        match: "kick the baby",
        call: function(client, message, guild) {

            message.reply("Don't kick the goddamn baby!");

        }
    })
];

module.exports = commands;