"use strict";

const fs = require("fs");
const path = require("path");

const discord = require("discord.js");
const mongoose = require("mongoose");

//const sandbox = require("./sandbox");
const Logger = require("../logger");
const schemas = require("../db");
const Sandbox = require("./sandbox");

const config = require("../../config.json");

const botLogger = new Logger();
const botSandbox = new Sandbox({}, 2000);

const isFile = fp => fs.lstatSync(fp).isFile();
const getFilePathsInDir = fp => fs.readdirSync(fp).map(name => path.join(fp, name)).filter(isFile);

const loadCommands = () => {
    return new Promise(async (resolve, reject) => {

        const commands = [];

        // load
        let filePaths;
        try {

            filePaths = getFilePathsInDir(path.join(__dirname, "commands"));
        } catch (error) {

            // error
        }

        for (let filePath of filePaths) {

            let fileExtName = filePath.extname;
            if (fileExtName !== ".js") {

                // error
            }

            let command;
            try {

                command = require(filePath);
            } catch (error) {

                // error
            }

            commands.push(command);
        }

        // save to db if new
        const scripts = await schemas.ScriptSchema
            .find({
                local: true
            })
            .then(scripts => {

                return scripts;
            })
            .catch(error => {

                // error
            });

        const promises = [];
        const validCommands = [];

        for (let i = 0; i < commands.length; i++) {

            // dont save if the required info isnt there
            if (commands[i].name === undefined || commands[i].match === undefined) {

                continue;
            }

            let script = scripts.find(e => e.name === commands[i].name);
            if (script === undefined) {

                script = new schemas.ScriptSchema({

                    author_id: "feinwaru-devs",

                    name: commands[i].name,
                    description: commands[i].description,
                    thumbnail: commands[i].thumbnail,
                    marketplace_enabled: commands[i].marketplace_enabled,

                    type: commands[i].type,
                    match_type: commands[i].match_type,
                    match: commands[i].match,

                    code: null,
                    data: null,

                    local: true,
                    featured: commands[i].featured,
                    verified: true,
                    likes: 0,
                    guild_count: 0,
                    use_count: 0,

                    created_with: "vscode"
                });

                promises.push(script.save().then(script => {
                    commands[i]._id = script._id
                    validCommands.push(commands[i]);
                }));
            } else {

                commands[i]._id = script._id
                validCommands.push(commands[i]);
            }
        }

        Promise
            .all(promises)
            .then(() => {

                resolve(validCommands);
            })
            .catch(error => {

                // error
            });
    });
}

const commands = loadCommands().then(commands => commands).catch(error => botLogger.fatalError(`Error loading local scripts: ${error}`));

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

    if (client.user.id === message.author.id) {

        return;
    }

    schemas.GuildSchema
        .findOne({
            discord_id: message.guild.id
        })
        .then(guild => {
            if (guild === null) {

                // bot not enabled on server
            }

            const scriptIds = guild.scripts.map(script => script.object_id);
            schemas.ScriptSchema
                .find({
                    _id: {
                        $in: scriptIds
                    }
                })
                .then(async scripts => {

                    for (let script of scripts) {

                        const guildScript = guild.scripts.find(e => e.object_id.equals(script._id));

                        const match_type = guildScript.match_type_override === null ? script.match_type : guildScript.match_type_override;
                        const match = guildScript.match_override === null ? script.match : guildScript.match_override;

                        let matched = false;
                        switch (match_type) {
                            case "command":
                                matched = message.content.split(" ")[0].toLowerCase() === (guild.prefix + match.toLowerCase());
                                break;
                            case "startswith":
                                matched = message.content.toLowerCase().startsWith(match.toLowerCase());
                                break;
                            case "contains":
                                matched = message.content.toLowerCase().indexOf(match.toLowerCase()) !== -1;
                                break;
                            case "exactmatch":
                                matched = message.content === match;
                                break;
                            default:
                                botLogger.error(`incorrect script match type: name - ${script.name}, match_type - ${match_type}`);
                                break;
                        }

                        if (matched === false) {
                            continue;
                        }

                        // perms
                        let passed = true;

                        if (guildScript.permissions === undefined) {

                            guildScript.permissions = {
                                members: {
                                    allow_list: false,
                                    list: []
                                },
                                channels: {
                                    allow_list: false,
                                    list: []
                                },
                                roles: {
                                    allow_list: false,
                                    list: []
                                }
                            };
                        }

                        // member perms
                        if (guildScript.permissions.members.allow_list === false) {

                            for (let memberId of guildScript.permissions.members.list) {

                                if (message.author.id === memberId) {

                                    passed = false;
                                    message.reply("debug: you dont have perms to run this command - you can't run this command while blacklisted");
                                    break;
                                }
                            }
                        } else {

                            let found = false;
                            for (let memberId of guildScript.permissions.members.list) {

                                if (message.author.id === memberId) {

                                    found = true;
                                    break;
                                }
                            }
                            if (found === false) {

                                passed = false;
                                message.reply("debug: you dont have perms to run this command - you can't run this command as you aren't whitelisted");
                                //break;
                            }
                        }

                        if (passed === false) {
                            break;
                        }

                        // channel perms
                        if (guildScript.permissions.channels.allow_list === false) {

                            for (let channelId of guildScript.permissions.channels.list) {

                                if (message.channel.id === channelId) {

                                    passed = false;
                                    message.reply("debug: you dont have perms to run this command - this command is not allowed in this channel");
                                    break;
                                }
                            }
                        } else {

                            let found = false;
                            for (let channelId of guildScript.permissions.channels.list) {

                                if (message.channel.id === channelId) {

                                    found = true;
                                    break;
                                }
                            }
                            if (found === false) {

                                passed = false;
                                message.reply("debug: you dont have perms to run this command - youre not in a channel where this command is allowed");
                                //break;
                            }
                        }

                        if (passed === false) {
                            break;
                        }

                        // rule perms
                        if (guildScript.permissions.roles.allow_list === false) {

                            for (let roleId of guildScript.permissions.roles.list) {

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

                            for (let roleId of guildScript.permissions.roles.list) {

                                for (let role of message.member.roles.array()) {

                                    if (roleId === role.id) {

                                        found++;
                                        break;
                                    }
                                }
                            }
                            if (found !== guildScript.permissions.roles.list.length) {

                                passed = false;
                                message.reply("debug: you dont have perms to run this command - you dont have all the required roles");
                            }
                        }

                        if (passed === false) {
                            break;
                        }

                        if (script.local === true) {

                            const localCommand = (await commands).find(e => e.name === script.name);
                            if (localCommand === undefined) {

                                message.channel.send(`error executing local script '${script.name}', code not found`);
                            } else {

                                localCommand.run(client, message, guild);
                            }
                        } else {

                            try {

                                botSandbox.exec(script.code, {
                                    message,
                                    RichEmbed: discord.RichEmbed
                                });
                            } catch (error) {

                                message.channel.send(`error executing '${script.name}' script: ${error}`);
                            }
                        }
                    }
                })
                .catch(error => {

                    // error
                });
        })
        .catch(error => {

            // error
        });

    //special

    // load guild
    // load scripts
    // run command checks
    // run perms checks
    // fetch code (local vs db)
    // run code appropriately

    /*
    if (client.user.id === message.author.id) {
        return;
    }

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

    const commands = config.env === "dev" ? await loadCommands() : await loadedCommands;

    scripts.sort((a, b) => {

        let na, nb;

        if (a.local === false) {

            na = Number.MAX_SAFE_INTEGER;
        } else {

            const match = commands.find(e => {
                return e.name === a.name;
            });

            if (match !== undefined) {
                if (match.order === undefined) {
                    match.order = 0;
                }

                na = match.order;
            } else {

                na = Number.MAX_SAFE_INTEGER;
            }
        }

        if (b.local === false) {

            nb = Number.MAX_SAFE_INTEGER;
        } else {

            const match = commands.find(e => {
                return e.name === b.name;
            });

            if (match !== undefined) {
                if (match.order === undefined) {
                    match.order = 0;
                }

                nb = match.order;
            } else {

                nb = Number.MAX_SAFE_INTEGER;
            }
        }

        return na - nb;
    });

    sloop: for (let i = 0; i < scripts.length; i++) {

        // Keep array order.
        const script = scripts[i];

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

    /*
        // matching - big boii issue
        let matched = false;
        switch(guildOverrides.match_type_override == null ? script.match_type : guildOverrides.match_type_override) {
            case "command":
                matched = message.content.split(" ")[0].toLowerCase() === guildDoc.prefix + (guildOverrides.match_override === null ? script.match.toLowerCase() : guildOverrides.match_override.toLowerCase());
                break;
            case "startswith":
                matched = message.content.toLowerCase().startsWith(guildOverrides.match_override == null ? script.match.toLowerCase() : guildOverrides.match_override.toLowerCase());
                break;
            case "contains":
                matched = message.content.toLowerCase().indexOf(guildOverrides.match_override == null ? script.match.toLowerCase() : guildOverrides.match_override.toLowerCase()) !== -1;
                break;
            case "exactmatch":
                matched = message.content === (guildOverrides.match_override == null ? script.match : guildOverrides.match_override);
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

            // find matching local command.
            // Normal for loop used as for of does not preserve the array order.
            for (let command of commands) {

                if (script.name === command.name) {

                    try {

                        command.run(client, message, guildDoc);
                    } catch(err) {

                        botLogger.error(`error running local command '${command.name}': ${err}`);
                    }

                    if (command.passthrough === false) {
                        break sloop;
                    }
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

    // hardcoded activity, yay fuck me!
    // ...also hardcoded shits, even fucking better!
    schemas.UserSchema.findOne({ discord_id: message.author.id }).then(doc => {
        if (doc === null) {

            const newUser = new schemas.UserSchema({
                discord_id: message.author.id
            });

            newUser.save().then(doc => {
                if (doc === null) {

                    botLogger.error("error saving new user doc at activity");
                }
            }).catch(error => {

                botLogger.error(error);
            });
            
        } else {

            if (message.content.indexOf("shit") !== -1) {

                doc.shits++;
            }

            doc.activity++;

            doc.save().then(doc => {
                if (doc === null) {

                    botLogger.error("error updating user doc at activity");
                }
            }).catch(error => {

                botLogger.error(error);
            });
        }
    }).catch(error => {

        botLogger.error(error);
    });
    */
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

client.login(config.discord_token).then(() => {

    botLogger.log("stdout", "logged into discord");
});