"use strict"

const schemas = require("../../db");

const Command = require("../command");

const remscript = new Command("remscript", "removes a new script", "js", 0, "remscript", "command", 0, false, null, function (client, message, guildDoc) {

    const args = message.content.split(" ");
    const command = args[0];
    const name = args[1];

    if (name === undefined) {
        message.reply("what script you deleting, buddy?")
        return;
    }

    schemas.ScriptSchema.findOneAndRemove({
        name
    }).then(doc => {
        if (doc === null) {
            message.reply("no script with this name, chum.")
            return;
        }
        message.reply("you deleted a script. why.")
    }).catch(error => {
        message.reply("here's a nice error for you. database error.")
    })
});

module.exports = remscript;