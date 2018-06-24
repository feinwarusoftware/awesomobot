"use strict";

const fs = require("fs");
const path = require("path");

const discord = require("discord.js");
const mongoose = require("mongoose");

//const sandbox = require("./sandbox");
const Logger = require("../logger");
const schemas = require("../db");
const Sandbox = require("./sandbox");

const botLogger = new Logger();
const botSandbox = new Sandbox({}, 2000);

let config;
try {

    config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "config.json")));
} catch(err) {

    botLogger.fatalError(`error loading config: ${err}`);
}

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

            delete require.cache[require.resolve(file)];
            command = require(file);
        } catch (err) {

            botLogger.fatalError(`error loading command file: ${file}, with error: ${err}`);
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
                    if (doc.match !== command.match) {
                        doc.match = command.match;
                        change = true;
                    }
                    if (doc.match_type !== command.match_type) {
                        doc.match_type = command.match_type;
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
                match: command.match,
                match_type: command.match_type,
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

let commands = config.env === "dev" ? null : loadCommands();

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
client.on("message", async message => {
    //special

    // load guild
    // load scripts
    // run command checks
    // run perms checks
    // fetch code (local vs db)
    // run code appropriately

    const guildDoc = await schemas.GuildSchema.findOne({ discord_id: message.guild.id }).then(async doc => {

        if (doc === null) {

            const guild = new schemas.GuildSchema({
                discord_id: message.guild.id,
                prefix: "<<",
                log_channel_id: null,
                log_events: [],
                scripts: [{ object_id: mongoose.Types.ObjectId("5b2ffb6734835a4e98be4c69") }]
            });

            await guild.save().catch(err => {

                botLogger.error(`error saving new guild on message event: ${err}`);
            });

            return guild;
        }

        return doc;
    }).catch(err => {

        botLogger.error(`error fetching guild on 'message' event: ${err}`);
    });

    const scriptIds = [];
    for (let script of guildDoc.scripts) {
        scriptIds.push(script.object_id);
    }

    let scripts = await schemas.ScriptSchema.find({ _id: { $in: scriptIds } }).catch(err => {

        botLogger.error(`error loading guild scripts on message event: ${err}`);
    });

    if (config.env === "dev") {

        const devScripts = await schemas.ScriptSchema.find({ local: true }).catch(err => {

            botLogger.error(`error loading guild dev scripts on message event: ${err}`);
        });

        for (let devScript of devScripts) {

            guildDoc.scripts.push({ object_id: devScript._id });
        }

        scripts = [...scripts, ...devScripts];
    }

    for (let script of scripts) {

        const guildOverrides = guildDoc.scripts.find(e => {
            return e.object_id.equals(script._id);
        });
        if (guildOverrides === undefined) {
            botLogger.error(`could not find guild overrides for script`);
            return;
        }

        /*
            BIG BOII ISSUES
            *- ability to set a command match and match type per guild to prevent clashes
            *- if the match checks pass but not the perm checks, stop script iteration
        */

        // match each of them
        // run perm checks
        // identify if local

        // if local - call normally
        // if not, error for now

        // matching - big boii issue
        let matched = false;
        switch(guildOverrides.match_type_override === null ? script.match_type : guildOverrides.match_type_override) {
            case "command":
                matched = message.content.split(" ")[0].toLowerCase() === guildDoc.prefix + (guildOverrides.match_override === null ? script.match.toLowerCase() : guildOverrides.match_override.toLowerCase());
                break;
            case "startswith":
                matched = message.content.toLowerCase().startsWith(guildOverrides.match_override === null ? script.match.toLowerCase() : guildOverrides.match_override.toLowerCase());
                break;
            case "contains":
                matched = message.content.toLowerCase().indexOf(guildOverrides.match_override === null ? script.match.toLowerCase() : guildOverrides.match_override.toLowerCase()) !== -1;
                break;
            case "exactmatch":
                matched = message.content === (guildOverrides.match_override === null ? script.match : guildOverrides.match_override);
                break;
            default:
                botLogger.error(`incorrect script match type: name - ${script.name}, match_type - ${script.match_type}`);
                break;
        }

        if (matched === false) {
            continue;
        }

        // perms checks
        let passed = true;

        if (guildOverrides.perms.enabled === false) {
            passed = false;
            message.reply("debug: you dont have perms to run this command - the command is disabled");
        }

        if (passed === false) {
            break;
        }

        // member perms
        if (guildOverrides.perms.members.allow_list === false) {
            
            for (let memberId of guildOverrides.perms.members.list) {

                if (message.author.id === memberId) {

                    passed = false;
                    message.reply("debug: you dont have perms to run this command - you can't run this command while blacklisted");
                    break;
                }
            }
        } else {
            
            let found = false;
            for (let memberId of guildOverrides.perms.members.list) {

                if (message.author.id === memberId) {

                    found = true;
                    break;
                }
            }
            if (found === false) {

                passed = false;
                message.reply("debug: you dont have perms to run this command - you can't run this command as you aren't whitelisted");
                break;
            }
        }

        if (passed === false) {
            break;
        }

        // channel perms
        if (guildOverrides.perms.channels.allow_list === false) {

            for (let channelId of guildOverrides.perms.channels.list) {

                if (message.channel.id === channelId) {

                    passed = false;
                    message.reply("debug: you dont have perms to run this command - this command is not allowed in this channel");
                    break;
                }
            }
        } else {
            
            let found = false;
            for (let channelId of guildOverrides.perms.channels.list) {

                if (message.channel.id === channelId) {

                    found = true;
                    break;
                }
            }
            if (found === false) {

                passed = false;
                message.reply("debug: you dont have perms to run this command - youre not in a channel where this command is allowed");
                break;
            }
        }

        if (passed === false) {
            break;
        }

        // rule perms
        if (guildOverrides.perms.roles.allow_list === false) {

            for (let roleId of guildOverrides.perms.roles.list) {

                for (let role of message.member.roles.array()) {

                    if (roleId === role.id) {

                        passed = false;
                        message.reply("debug: you dont have perms to run this command - one of your roles is blacklisted");
                        break;
                    }
                }
                if (passed === false) {
                    break;
                }
            }

        } else {
            
            let found = 0;

            for (let roleId of guildOverrides.perms.roles.list) {

                for (let role of message.member.roles.array()) {

                    if (roleId === role.id) {

                        found++;
                        break;
                    }
                }
            }
            if (found !== guildOverrides.perms.roles.list.length) {

                passed = false;
                message.reply("debug: you dont have perms to run this command - you dont have all the required roles");
            }
        }

        if (passed === false) {
            break;
        }

        // local? - fixpls
        if (script.local === true) {

            // find matching local command
            for (let command of (config.env === "dev" ? await loadCommands() : await commands)) {

                if (script.name === command.name) {

                    try {

                        command.run(client, message, guildDoc);
                    } catch(err) {

                        botLogger.error(`error running local command '${command.name}': ${err}`);
                    }
                    break;
                }
            }
        } else {

            try {

                botSandbox.exec(script.code, { message });
            } catch(err) {

                message.reply(`error running script: ${err}`);
            }

            break;
        }
    }
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

client.login(config.token);
