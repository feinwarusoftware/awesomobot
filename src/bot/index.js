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

            console.log(error);
        }

        for (let filePath of filePaths) {

            let fileExtName = filePath.slice(filePath.lastIndexOf("."));

            if (fileExtName !== ".js") {

                console.log("non script file found in local script dir");
                return reject("non script file found in local script dir");
            }

            let command;
            try {

                command = require(filePath);
            } catch (error) {

                console.log(error);
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

                console.log(error);
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

                    author_id: commands[i].author_id === undefined || commands[i].author_id === null ? "feinwaru-devs" : commands[i].author_id,

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

                console.log(error);
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
                return;
            }

            schemas.UserSchema
                .findOne({
                    discord_id: message.author.id
                })
                .then(user => {
                    if (user === null) {

                        user = new schemas.UserSchema({
                            discord_id: message.author.id
                        });
                    }

                    // shits
                    if (message.content.includes("shit") === true) {

                        user.shits++;
                    }

                    // xp
                    let xp;

                    if (message.content.length <= 15) {

                        xp = 1;
                    } else {

                        xp = Math.round(message.content.length / 10);
                    }

                    user.xp += xp;

                    user
                        .save()
                        .catch(error => {

                            console.log(error);
                        });

                    // call scripts
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
                                const match = guildScript.match_override === null ? script.match.split(";") : guildScript.match_override.split(";");
        
                                let passedMatch = null;
                                let matched = false;
                                switch (match_type) {
                                    case "command":
                                        for (let m of match) {

                                            matched = message.content.split(" ")[0].toLowerCase() === (guild.prefix + m.toLowerCase());

                                            if (matched === true) {

                                                passedMatch = m;
                                                break;
                                            }
                                        }
                                        break;
                                    case "startswith":
                                        for (let m of match) {

                                            matched = message.content.toLowerCase().startsWith(m.toLowerCase());

                                            if (matched === true) {

                                                passedMatch = m;
                                                break;
                                            }
                                        }
                                        break;
                                    case "contains":
                                        for (let m of match) {

                                            matched = message.content.toLowerCase().indexOf(m.toLowerCase()) !== -1;

                                            if (matched === true) {

                                                passedMatch = m;
                                                break;
                                            }
                                        }
                                        break;
                                    case "exactmatch":
                                        for (let m of match) {

                                            matched = message.content === m;

                                            if (matched === true) {

                                                passedMatch = m;
                                                break;
                                            }
                                        }
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

                                    if (script.type === "json") {

                                        return message.reply("json type not allowed in local scripts");
                                    }
        
                                    const localCommand = (await commands).find(e => e.name === script.name);
                                    if (localCommand === undefined) {
        
                                        message.channel.send(`error executing local script '${script.name}', code not found`);
                                    } else {
        
                                        localCommand.run(client, message, guild, user, script, passedMatch);
                                    }
                                } else {
        
                                    if (script.type === "js") {

                                        try {
        
                                            botSandbox.exec(script.code, {
                                                message,
                                                RichEmbed: discord.RichEmbed
                                            });
                                        } catch (error) {
            
                                            message.channel.send(`error executing '${script.name}' script: ${error}`);
                                            break;
                                        }
                                    } else {

                                        // json script handling

                                        if (script.data.action === "text") {

                                            return message.channel.send(script.data.args[0].value);
                                        }

                                        if (script.data.action === "file") {

                                            return message.channel.send("", {
                                                file: script.data.args[0].value
                                            });
                                        }

                                        if (script.data.action === "embed") {

                                            // author
                                            // color
                                            // description
                                            // footer
                                            // image
                                            // thumbnail
                                            // timestamp
                                            // title
                                            // url

                                            const embed = new discord.RichEmbed();

                                            for (let arg of script.data.args) {

                                                // cos discord embeds have the BIG gay
                                                switch(arg.field) {
                                                    case "author":
                                                        embed.setAuthor(arg.value);
                                                        break;
                                                    case "color":
                                                        embed.setColor(arg.value);
                                                        break;
                                                    case "description":
                                                        embed.setDescription(arg.value);
                                                        break;
                                                    case "footer":
                                                        embed.setFooter(arg.value);
                                                        break;
                                                    case "image":
                                                        embed.setImage(arg.value);
                                                        break;
                                                    case "thumbnail":
                                                        embed.setThumbnail(arg.value);
                                                        break;
                                                    case "timestamp":
                                                        embed.setTimestamp(arg.value);
                                                        break;
                                                    case "title":
                                                        embed.setTitle(arg.value);
                                                        break;
                                                    case "url":
                                                        embed.setURL(arg.value);
                                                        break;
                                                    default:
                                                        return message.channel.send("invalid embed argument");
                                                }
                                            }

                                            return message.channel.send(embed);
                                        }
                                    }
                                }
        
                                script.use_count++;
                                script
                                    .save()
                                    .catch(error => {
        
                                        console.log(error);
                                    });
                            }
                        })
                        .catch(error => {
        
                            console.log(error);
                        });
                })
                .catch(error => {

                    console.log(error);
                });
        })
        .catch(error => {

            console.log(error);
        });
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
}).catch(error => {

    console.error(error);
});