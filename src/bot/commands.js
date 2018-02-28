"use strict";

const utils = require("./utils");
const logConstants = utils.logger;
const logger = utils.globLogger;

class Command {
    constructor(data) {
        this.data = data;
    }
    check(message, guild) {

        if (Array.isArray(this.data.match)) {
            for (let i = 0; i < this.data.match.length; i++) {
                if (!this._checkPrefix(message, guild, this.data.match[i])) {
                    logger.log(logConstants.LOG_DEBUG, "message did not match any command");
                    return false;
                }
            }
        } else {
            if (!this._checkPrefix(message, guild, this.data.match)) {
                logger.log(logConstants.LOG_DEBUG, "message did not match any command");
                return false;
            }
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
        name: "test",
        type: "command",
        match: "test",
        call: function(message, guild) {
            message.channel.send("testing...");
        }
    })
];

module.exports = commands;
