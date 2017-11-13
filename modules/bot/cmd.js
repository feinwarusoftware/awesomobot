"use strict"

const app = require("../../index");
const misc = require("../utils/misc");

function command(message, prefix, command, callback) {
    if (!message.content.startsWith(prefix) && prefix != "") {
        return;
    }

    var args = message.content.substring(prefix.length).toLowerCase().split(" ");

    if (command.toLowerCase() != args[0]) {
        return;
    }

    callback(args);
}

function groupCommand(group, message, prefix, command, callback) {
    if (!message.content.startsWith(prefix) && prefix != "") {
        return;
    }

    // Make helper for this.
    var auth = false;
    if (message.member.roles == null) {return;}
    const roles = message.member.roles.array();
    for (var i = 0; i < roles.length; i++) {
        if (group.includes(roles[i].name)) {
            auth = true;
        }
    }

    if (auth == false) {
        return;
    }

    var args = message.content.substring(prefix.length).toLowerCase().split(" ");

    if (command.toLowerCase() != args[0]) {
        return;
    }

    callback(args);
}

function trigger(message, blacklist, whitelist, callback) {
    if (misc.messageIncludes(message, blacklist, whitelist)) {
        callback();
    }
}

module.exports = {
    command,
    groupCommand,
    trigger,

};