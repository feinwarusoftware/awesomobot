/**
 * cmd.js
 * Desc: Utility module for registering discord commands.
 * Deps: utils.js
 */

"use strict"

const discord = require("discord.js");

const config = require("./config/config-main");
const utils = require("./utils");

function command(message, args, command, callback) {
    if (command.toLowerCase() != args[0]) {
        return;
    }

    callback();
}

function groupCommand(message, group, member, args, command, callback) {
    if (command.toLowerCase() != args[0]) {
        return;
    }

    var sent = false;

    var auth = false;
    if (member.roles == null || member.roles === undefined) { 
        flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
            .setColor(0x617)
            .setAuthor(config.name + " // DEBUG INFO [ <default> " + config.prefix + args[0] + " ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
            .addField("Required", group)
            .addField("Current", "null || undefined")
            .addField("Auth", false)
    
            message.channel.send(debugEmbed);
            sent = true;
        });

        return;
    }

    const roles = member.roles.array();
    for (var i = 0; i < roles.length; i++) {
        if (group.includes(roles[i].name)) {
            auth = true;
        }
    }

    flag(args, "-d", function() {
        const debugEmbed = new discord.RichEmbed()
        .setColor(0x617)
        .setAuthor(config.name + " // DEBUG INFO [ <default> " + config.prefix + args[0] + " ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
        .addField("Required", group)
        .addField("Current", roles)
        .addField("Auth", auth)

        message.channel.send(debugEmbed);
        sent = true;
    });

    if (auth == false) {
        return;
    }

    if (!sent) {
        callback();
    }
}

function trigger(message, include, exclude, callback) {
    var indices = [];
    
    for (var i = 0; i < include.length; i++) {
        const occ = utils.allIndicesOf(message.content.toLowerCase(), include[i]);
        indices = indices.concat(occ);
    }

    var times = indices.length;
    if (indices.length > 0) {
        for (var i = 0; i < indices.length; i++) {
            for (var j = 0; j < exclude.length; j++) {
                if (message.content.substring(indices[i], message.content.length).toLowerCase().startsWith(exclude[j].toLowerCase())) {

                    times -= 1;
                }
            }
        }
    }

    if (times > 0) {

        callback(times);
    }
}

function flag(args, flag, callback) {
    for (var i = 0; i < args.length; i++) {
        if (args[i].toLowerCase() == flag) {

            callback();
        }  
    }
}

function parseArgs(message) {
    return message.content.startsWith(config.prefix)
                ? message.content.substring(config.prefix.length).toLowerCase().split(" ")
                : message.content.toLowerCase().split(" ");
}

module.exports = {
    command,
    groupCommand,
    trigger,
    flag,
    parseArgs,

};

/*
function safe(message, prefix, command, callback) {
    if (!message.content.startsWith(prefix) && prefix != "") {
        return;
    }

    var args = message.content.substring(prefix.length).toLowerCase().split(" ");
    
    if (command.toLowerCase() != args[0]) {
        return;
    }

    callback(args);
}

function unsafe(args, command, callback) {
    if (command.toLowerCase() != args[0]) {
        return;
    }

    callback();
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

    callback(args);
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

    callback();
}

function trigger(message, include, callback) {
    if (!message.content.includes(include)) {
        return;
    }

    callback();
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
*/

/*
function validateUser(user, role = null) {

    return user;
}

function validateData(data, type = null, len = null) {

    return data;
}
*/