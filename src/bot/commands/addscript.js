"use strict"

const schemas = require("../../db");

const Command = require("../command");

const addscript = new Command("addscript", "adds a new script", "js", 0, "addscript", "command", 0, false, null, function (client, message, guildDoc) {

    const args = message.content.split(" ");
    const command = args[0];
    const name = args[1];
    let code = message.content.substring(command.length + name.length + 2);

    if (name === undefined) {
        message.reply("name your command please.");
        return;
    }
    if (code === "") {
        message.reply("write some code please.");
        return;
    }

    if (code.startsWith("```js")) {
        code = code.substring(5);
    }
    if (code.startsWith("```")) {
        code = code.substring(3);
    }
    if (code.endsWith("```")) {
        code = code.substring(0, code.length - 3);
    }

    schemas.ScriptSchema.findOne({
        match: name
    }).then(doc => {

        if (doc === null) {
            const newScript = new schemas.ScriptSchema({
                local: false,
                name: name,
                type: "js",
                permissions: 0,
                match: name
            });

            newScript.save().then(doc => {
                if (doc === null) {
                    message.reply("oof. doc fucked.")
                } else {
                    message.reply("script successfully saved!")
                }

            }).catch(error => {
                message.reply("oof. error on saving.")
            });
            return;
        }
        message.reply("this script name already exists, fucko.")
    }).catch(error => {
        message.reply("oof. error on match.")
    });
});

//module.exports = addscript;