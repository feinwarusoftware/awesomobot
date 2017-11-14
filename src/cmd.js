/**
 * cmd.js
 * Desc: Utility module for registering discord commands.
 * Deps: utils.js
 */

"use strict"

const utils = require("./utils");

function safe(message, prefix, command, callback) {
    if (!message.content.startsWith(prefix) && prefix != "") {
        return;
    }

    var args = message.content.substring(prefix.length).toLowerCase().split(" ");
    
    if (command.toLowerCase() != args[0]) {
        return;
    }

    callback(args/*, flags*/);
}

function unsafe(args, command, callback) {
    if (command.toLowerCase() != args[0]) {
        return;
    }

    callback(/*flags*/);
}

function gsafe(group, message, prefix, command, callback) {
    if (!message.content.startsWith(prefix) && prefix != "") {
        return;
    }

    var args = message.content.substring(prefix.length).toLowerCase().split(" ");

    if (command.toLowerCase() != args[0]) {
        return;
    }

    var auth = false;
    if (message.member.roles == null || message.member.roles === undefined) { return; }
    const roles = message.member.roles.array();
    for (var i = 0; i < roles.length; i++) {
        if (group.includes(roles[i].name)) {
            auth = true;
        }
    }

    if (auth == false) {
        return;
    }

    callback(args/*, flags*/);
}

function gunsafe(group, member, args, command, callback) {
    if (command.toLowerCase() != args[0]) {
        return;
    }

    var auth = false;
    if (member.roles == null || member.roles === undefined) { return; }
    const roles = member.roles.array();
    for (var i = 0; i < roles.length; i++) {
        if (group.includes(roles[i].name)) {
            auth = true;
        }
    }

    if (auth == false) {
        return;
    }

    callback(/*flags*/);
}

function trigger(message, include, callback) {
    if (!message.content.includes(include)) {
        return;
    }

    callback(/*flags*/);
}

function advtrigger(content, include, exclude, callback) {
    var indices = [];

    for (var i = 0; i < include.length; i++) {
        const occ = utils.allIndicesOf(content, include[i]);
        indices = indices.concat(occ);
    }

    var times = indices.length;
    if (indices.length > 0) {
        for (var i = 0; i < indices.length; i++) {
            for (var j = 0; j < exclude.length; j++) {
                if (content.substring(indices[i], content.length).startsWith(exclude[j])) {

                    times -= 1;
                }
            }
        }

        callback(times);
        return;
    }
}

/*
function validateUser(user, role = null) {

    return user;
}

function validateData(data, type = null, len = null) {

    return data;
}
*/

module.exports = {
    safe,
    unsafe,
    gsafe,
    gunsafe,
    trigger,
    advtrigger,

};