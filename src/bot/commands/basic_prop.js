"use strict";

const Command = require("../command");

const basic_prop = new Command("basic_prop", "basic command property access example for the new awesomo backend", "js" /* currently unused */, 0 /* currently unused */, "basic_prop", "command", null, (client, message, guildDoc) => {

    message.reply(this.description);
});

module.exports = basic_prop;
