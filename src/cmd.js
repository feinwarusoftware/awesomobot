/**
 * cmd.js
 * Desc: Utility module for registering discord commands.
 * Deps: utils.js
 */

"use strict"

const discord = require("discord.js");

const config = require("./config/config-main");
const utils = require("./utils");

const success = 1;
const failure = 2;
const status = 4;
const debug = 8;

function advCommand(message, args, command, callback) {
    var info = [];
    var flags = 0;

    if (command.toLowerCase() != args[0]) {
        info.push("Expected: " + command + ", got: " + args[0]);

        flags |= failure;

        callback(failure);
        return; 
    }

    info.push("Command called with [ " + args.length + " ] args");

    if (hasFlag(message, args, "-d")) {
        info.push("Debug flag called");

        flags |= debug;
    }

    if (hasFlag(message, args, "-s")) {
        info.push("Status flag called");

        flags |= status;
    }

    flags |= success;

    callback(flags, info);
}

function advTrigger(message, args, include, exclude, callback) {
    var info = [];
    var flags = 0;

    info.push("Blacklist: " + include);
    info.push("Whitelist: " + exclude);

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

    if (times <= 0) {
        info.push("Found no instances of include in message");

        flags |= failure;
        
        callback(failure);
        return; 
    }

    info.push("Found [ " + times + " ] instances");

    if (hasFlag(message, args, "-d")) {
        info.push("Debug flag called");

        flags |= debug;
    }

    if (hasFlag(message, args, "-s")) {
        info.push("Status flag called");

        flags |= status;
    }

    flags |= success;

    callback(flags, info, times);
}

function advGroupCommand(message, args, group, command, callback) {
    var info = [];
    var flags = 0;

    if (command.toLowerCase() != args[0]) {
        info.push("Expected: " + command + ", got: " + args[0]);

        flags |= failure;

        callback(failure);
        return; 
    }

    info.push("Command called with [ " + args.length + " ] args");

    if (member.roles == null || member.roles === undefined) { 
        info.push("Something was undefined, blame the discord.js api");
        
        flags |= failure;
        
        callback(failure);
        return; 
    }

    var auth = false;
    const roles = member.roles.array();
    for (var i = 0; i < roles.length; i++) {
        if (group.includes(roles[i].name)) {
            auth = true;
        }
    }

    if (auth == false) {
        info.push("Command auth failed");
        
        flags |= failure;
        
        callback(failure);
        return; 
    }

    if (hasFlag(message, args, "-d")) {
        info.push("Debug flag called");

        flags |= debug;
    }

    if (hasFlag(message, args, "-s")) {
        info.push("Status flag called");

        flags |= status;
    }

    flags |= success;

    callback(flags, info);
}

function hasFlag(message, args, flag) {
    for (var i = 0; i < args.length; i++) {
        if (args[i] == flag) {

            return true;
        }
    }

    return false;
}

// Deprecated, will be removed soon.
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

// Deprecated, will be removed soon.
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

// Deprecated, will be removed soon.
function command(message, args, command, callback) {
    if (command.toLowerCase() != args[0]) {
        return;
    }

    callback();
}

// Deprecated, will be removed soon.
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
    advCommand,
    advTrigger,
    advGroupCommand,
    hasFlag,
    parseArgs,
    success,
    failure,
    status,
    debug,

    command,
    groupCommand,
    trigger,
    flag,

};