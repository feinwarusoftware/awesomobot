"use strict"

const Command = require("../command");

const addscript = new Command("addscript", "adds a new script", "js", 0, "addscript", "command", 0, false, null, function(client, message, guildDoc){
    
    let scriptSplit = message.content.substring(message.content.split(" ").length + 1);
    let scriptName = scriptSplit[1]

    message.reply(scriptName)

    //-addscript name code
    //["-addscript", "name", "code"...]

    // strip {prefix}addscript
    // get name
    // get code
    // strip ```js or ```
});

module.exports = addscript;
