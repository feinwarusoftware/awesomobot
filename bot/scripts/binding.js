"use strict"

const Command = require("../script");

const schemas = require("../../db");

const binding = new Command({
    
    name: "Script Bindings",
    description: "Quick and Dirty Commands\n-bind <name> <action> <args> // \nname: anything, action: text | file | embed, args: some text | file url | --embedProperty embedValue",
    thumbnail: "https://cdn.discordapp.com/attachments/394504208222650369/509099656270184459/bind.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "bind;unbind",

    featured: false,

    preload: false,

    cb: function(client, message, guild, user, script, match) {

        // action: text, file, embed
        
        // text:
        // bind text_binding text this is a text binding

        // file:
        // bind file_binding file https://cdn.discordapp.com/attachments/209040403918356481/487658989069402112/pjiicjez.png

        // embed:
        // bind embed_binding embed --description this is an embed binding

        const args = message.content.split(" ");

        const bind = args.shift();
        const name = args.shift();
        const action = args.shift();

        // bind name action args
        if (match === "bind") {

            if (name === undefined) {

                return message.reply("name was not set");
            }

            if (action === undefined) {

                return message.reply("action was not set");
            }

            if (args[0] === undefined) {

                return message.reply("args were not set");
            }

            const dataArgs = [];

            if (action === "text") {

                dataArgs.push({
                    field: "text",
                    value: args.join(" ")
                });                
            }

            if (action === "file") {

                dataArgs.push({
                    field: "url",
                    value: args[0]
                }); 
            }

            if (action ===  "embed") {

                // author
                // color
                // description
                // footer
                // image
                // thumbnail
                // timestamp
                // title
                // url

                // --description adfsd sdfgn df --author sdf sdf ff

                let embedArgs = args.join(" ").split("--");
                embedArgs.shift();
                embedArgs = embedArgs.map(s => s.trim())

                if (embedArgs.length % 2 !== 0) {

                    return message.reply("incorrect args were set");
                }

                for (let arg of embedArgs) {

                    const fieldArgs = arg.split(" ");

                    const field = fieldArgs.shift();
                    const value = fieldArgs.join(" ");

                    dataArgs.push({
                        field,
                        value
                    });
                }
            }

            if (dataArgs.length === 0) {

                return message.reply("incorrect action was set");
            }

            const script = new schemas.ScriptSchema({

                author_id: message.author.id,

                name,
                description: "auto generated using script bindings",
                thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/487658989069402112/pjiicjez.png",
                marketplace_enabled: false,

                type: "json",
                match_type: "command",
                match: name,

                code: null,
                data: {
                    action,
                    args: dataArgs
                },

                local: false,
                featured: false,
                verified: false,
                likes: 0,
                guild_count: 1,
                use_count: 0,

                created_with: "script_bindings"
            });

            script
                .save()
                .then(script => {

                    // get guild again to avoid conflicts
                    schemas.GuildSchema
                        .findOne({
                            discord_id: message.guild.id
                        })
                        .then(guild => {

                            const guildScript = new schemas.GuildScriptSchema({
                                object_id: script._id
                            });
        
                            guild.scripts.push(guildScript);
        
                            guild
                                .save()
                                .then(() => {

                                    message.reply(`successfully bound '${name}'`);
                                })
                                .catch(error => {
        
                                    message.reply(`error adding script to guild: ${error}`);
                                });
                        })
                        .catch(error => {

                            message.reply(`error finding guild: ${error}`);
                        });
                })
                .catch(error => {

                    message.reply(`error saving script: ${error}`);
                });
        }

        // unbind name
        if (match === "unbind") {

            schemas.ScriptSchema
                .find({
                    name,
                    created_with: "script_bindings"
                })
                .then(scripts => {
                    if (scripts.length === 0) {

                        return message.reply(`script '${name}' not found`);
                    }

                    scripts = scripts.filter(e => e.author_id === message.author.id);
                    if (scripts.length === 0) {

                        return message.reply(`script '${name}' does not belong to you`);
                    }

                    schemas.GuildSchema
                        .findOne({
                            discord_id: message.guild.id
                        })
                        .then(guild => {

                            let found = false;
                            for (let i = 0; i < scripts.length; i++) {

                                for (let j = 0; j < guild.scripts.length; j++) {
                                
                                    if (scripts[i]._id.equals(guild.scripts[j].object_id)) {

                                        found = true;
                                        guild.scripts.splice(i, 1);

                                        break;
                                    }
                                }
                            }

                            if (found === false) {

                                return message.reply(`script not found in current guild`);
                            }

                            guild
                                .save()
                                .then(() => {

                                    const promises = [];
                                    for (let i = 0; i < scripts.length; i++) {

                                        promises.push(scripts[i].remove());
                                    }

                                    Promise.all(promises).then(() => {

                                        message.reply(`successfully removed '${name}'`);
                                    }).catch(error => {

                                        message.reply(`error removing scripts: ${error}`);
                                    });
                                })
                                .catch(error => {

                                    message.reply(`error saving guild: ${error}`);
                                });
                        })
                        .catch(error => {

                            message.reply(`error finding guild: ${error}`);
                        });
                })
                .catch(error => {

                    message.reply(`error finding scripts: ${error}`);
                });
        }
    }
});

module.exports = binding;
