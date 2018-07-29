const Command = require("../command");

const avatar = new Command("avatar", "get users avatars", "js", 0, "avatar", "command", 0, false, null, function (client, message, guildDoc) {

    let scaledSize = 512;

    let subMessage = message.content.substring(message.content.split(" ")[0].length + 1);

    let search = message.guild.members.array()

    if (subMessage !== undefined) {
        for (let i = 0; i < search.length; i++) {
            if (search[i].displayName === subMessage) {
                let currentSize = parseInt(search[i].user.avatarURL.substring(search[i].user.avatarURL.indexOf("size=") + 5), 10);
                if (currentSize === undefined) {
                    message.reply("so... the bot shit itself, blame dragon");
                }
                if (currentSize < scaledSize) {
                    scaledSize = currentSize;
                }

                message.reply(search[i].user.avatarURL.substring(0, search[i].user.avatarURL.indexOf("size=") + 5) + scaledSize);
                return;
            }

        }
    }
    if (subMessage === undefined) {
        let currentSize = parseInt(message.author.avatarURL.substring(message.author.avatarURL.indexOf("size=") + 5), 10);
        if (currentSize === undefined) {
            message.reply("so... the bot shit itself, blame dragon");
        }
        if (currentSize < scaledSize) {
            scaledSize = currentSize;
        }

        message.reply(message.author.avatarURL.substring(0, message.author.avatarURL.indexOf("size=") + 5) + scaledSize);
        return;
    }
});
module.exports = avatar;