"use strict"

const Command = require("../command");

const purge = new Command("purge", "for the next 50 messages, all deletes are legal", "js", 0, "purge", "command", 0, false, null, function (client, message, guildDoc) {
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
});

module.exports = purge;