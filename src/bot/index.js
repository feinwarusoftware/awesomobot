"use strict";

const fs = require("fs");
const path = require("path");

const discord = require("discord.js");
const mongoose = require("mongoose");

//const sandbox = require("./sandbox");
const Logger = require("../logger");
const schemas = require("../db");

const botLogger = new Logger();

// init db
// init logger
// init sandbox
// load local commands
// make sure theyre in db

const isFile = fp => fs.lstatSync(fp).isFile();
const getFiles = fp => fs.readdirSync(fp).map(name => path.join(fp, name)).filter(isFile);

const loadCommands = async () => {

    let commands = [];

    let files;
    try {

        files = getFiles(path.join(__dirname, "commands"))
    } catch (err) {

        botLogger.fatalError(`error loading commands: ${err}`);
    }

    botLogger.log("stdout", `detected command files: ${JSON.stringify(files)}`);

    for (let file of files) {

        let extname = path.extname(file);
        if (extname !== ".js") {

            botLogger.fatalError(`error loading commands: found file with '${extname}', but only '.js' files are supported`);
        }

        let command;
        try {

            command = require(file);
        } catch (err) {

            botLogger.fatalError(`error loading commands: ${err}`);
        }

        commands.push(command);
    }

    botLogger.log("stdout", `loaded command files: ${JSON.stringify(commands)}`);

    await schemas.ScriptSchema.find({ local: true }).then(async docs => {

        for (let doc of docs) {
            let found = false

            for (let command of commands) {
                if (doc.name === command.name) {
                    found = true;

                    let change = false;

                    if (doc.author !== null) {
                        doc.author = null;
                        change = true;
                    }
                    if (doc.description !== command.description) {
                        doc.description = command.description;
                        change = true;
                    }
                    if (doc.type !== command.type) {
                        doc.type = command.type;
                        change = true;
                    }
                    if (doc.permissions !== command.permissions) {
                        doc.permissions = command.permissions;
                        change = true;
                    }
                    if (doc.code !== null) {
                        doc.code = null;
                        change = true;
                    }
            
                    if (change === true) {
            
                        await doc.save().catch(err => {
            
                            botLogger.fatalError(`error updaing '${command.name}' command in db: ${err}`);
                        });
                    }

                    break;
                }
            }

            if (found === true) {
                continue;
            }

            await doc.remove().catch(err => {

                botLogger.fatalError(`error removing '${doc.name}' command from db: ${err}`);
            });
        }

        for (let command of commands) {
            let found = false;

            for (let doc of docs) {
                if (command.name === doc.name) {
                    found = true;
                    break;
                }
            }

            if (found === true) {
                continue;
            }

            const script = new schemas.ScriptSchema({
                local: true,
                name: command.name,
                author: null,
                description: command.description,
                type: command.type,
                permissions: command.permissions,
                code : null
            });

            await script.save().catch(err => {

                botLogger.fatalError(`error saving '${command.name}' command to db: ${err}`);
            });
        }
    }).catch(err => {

        botLogger.fatalError(`error fetching current commands from db: ${err}`);
    });

    return commands;
}

const commands = loadCommands();

const client = new discord.Client();
client.on("channelCreate", channel => {

});
client.on("channelDelete", channel => {

});
client.on("channelPinsUpdate", (channel, time) => {

});
client.on("channelUpdate", (oldChannel, newChannel) => {

});
client.on("clientUserGuildSettingsUpdate", clientUserGuildSettings => {

});
client.on("clientUserSettingsUpdate", clientUserSettings => {
    //client
});
client.on("debug", info => {
    //client
});
client.on("disconnect", event => {
    //client
});
client.on("emojiCreate", emoji => {

});
client.on("emojiDelete", emoji => {

});
client.on("emojiUpdate", (oldEmoji, newEmoji) => {

});
client.on("error", error => {
    //client
});
client.on("guildBanAdd", (guild, user) => {

});
client.on("guildBanRemove", (guild, user) => {

});
client.on("guildCreate", guild => {

});
client.on("guildDelete", guild => {

});
client.on("guildMemberAdd", member => {

});
client.on("guildMemberAvailable", member => {

});
client.on("guildMemberRemove", member => {

});
client.on("guildMembersChunk", (members, guild) => {

});
client.on("guildMemberSpeaking", (member, speaking) => {

});
client.on("guildMemberUpdate", (oldMember, newMember) => {

});
client.on("guildUnavailable", guild => {

});
client.on("guildUpdate", (oldGuild, newGuild) => {

});
client.on("message", message => {
    //special

    // load guild
    // load scripts
    // run command checks
    // run perms checks
    // fetch code (local vs db)
    // run code appropriately
});
client.on("messageDelete", message => {

});
client.on("messageDeleteBulk", messages => {

});
client.on("messageReactionAdd", (messageReaction, user) => {

});
client.on("messageReactionRemove", (messageReaction, user) => {

});
client.on("messageReactionRemoveAll", message => {

});
client.on("messageUpdate", (oldMessage, newMessage) => {

});
client.on("presenceUpdate", (oldMember, newMember) => {

});
client.on("ready", () => {
    //client
});
client.on("reconnecting", () => {
    //client
});
client.on("resume", replayed => {
    //client
});
client.on("roleCreate", role => {

});
client.on("roleDelete", role => {

});
client.on("roleUpdate", (oldRole, newRole) => {

});
client.on("typingStart", (channel, user) => {

});
client.on("typingStop", (channel, user) => {

});
client.on("userNoteUpdate", (user, oldNote, newNote) => {
    //client
});
client.on("userUpdate", (oldUser, newUser) => {
    //client
});
client.on("voiceStateUpdate", (oldMember, newMember) => {

});
client.on("warn", info => {
    //client
});

client.login("");
