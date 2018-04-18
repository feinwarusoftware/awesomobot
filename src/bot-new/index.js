"use strict";

const discord = require("discord.js");
const mongoose = require("mongoose");

const client = new discord.Client();

const GuildSchema = require("./database").schema.guild;
const commands = require("./commands");

const utils = require("./utils");
const logConstants = utils.logger;
const logger = utils.globLogger;

const config = utils.globConfig.data;

mongoose.connect(config.database, {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let guilds = [];

setInterval(() => {

    logger.log(logConstants.LOG_DEBUG, "db saveall, guild count: "+guilds.length);

    for (let i = 0; i < guilds.length; i++) {
        guilds[i].save(err => {
            if (err) {
                logger.log(logConstants.LOG_ERROR, "failed to save guild: "+guilds[i].id);
                return;
            }
        });
    }
}, 5000);

client.on("ready", message => {
    logger.log(logConstants.LOG_INFO, "Bot loaded successfully!");
});

client.on("message", message => {
    if (message.author.equals(client.user)) {
        logger.log(logConstants.LOG_DEBUG, "aborting - message came from the bot");
        return;
    }

    // TEMP.
    if (message.guild.id != "405129031445381120") {
        logger.log(logConstants.LOG_DEBUG, "aborting - guild is not the test server");
        return;
    }
    //
    
    logger.log(logConstants.LOG_DEBUG, "message created in guild: "+message.guild.id);

    let guild = guilds.find(e => {
        return e.id == message.guild.id;
    });

    if (!guild) {

        logger.log(logConstants.LOG_DEBUG, "guild not loaded - loading from db");

        GuildSchema.findOne({ id: message.guild.id }, (err, guildDoc) => {
            if (err) {
                return;
                logger.log(logConstants.LOG_ERROR, "could not load guild");
            }

            if (!err && !guildDoc) {

                logger.log(logConstants.LOG_DEBUG, "could not find guild in db, creating new one");

                guildDoc = new GuildSchema({
                    id: message.guild.id,
                    settings: {
                        teamRoles: [
                            {
                                id: "436178480582098954", // rust
                                alias: "rs"
                            },
                            {
                                id: "436178377397764097", // c++
                                alias: "cpp"
                            },
                            {
                                id: "436178242844491776", // javascript
                                alias: "js"
                            },
                            {
                                id: "436178315821318154", // python
                                alias: "py"
                            }
                        ]
                    },
                    groups: [
                        {
                            name: "def",
                            inherits: [],
                            channels: [],
                            roles: [],
                            members: []
                        },
                        {
                            name: "hax0r",
                            inherits: ["def"],
                            channels: [],
                            roles: [
                                {
                                    target: "*",
                                    allow: false
                                },
                                {
                                    target: "429989816181194762", // Awesomo Devs
                                    allow: true
                                }
                            ],
                            members: []
                        }
                    ],
                    commands: [
                        {
                            name: "join team",
                            group: "hax0r"
                        }
                    ]
                    /*
                    groups: [
                        {
                            name: "def",
                            inherits: [],
                            channels: [
                                {
                                    target: "*",
                                    allow: false,
                                },
                                {
                                    target: "411238521563643905",
                                    allow: true,
                                },
                            ],
                            roles: [
                                {
                                    target: "417703655236435979",
                                    allow: false,
                                },
                            ],
                            members: [],
                        },
                        {
                            name: "sf",
                            inherits: [],
                            channels: [],
                            roles: [
                                {
                                    target: "*",
                                    allow: false,
                                },
                                {
                                    target: "417704645599952906",
                                    allow: true,
                                },
                            ],
                            members: [],
                        },
                        {
                            name: "dup",
                            inherits: [],
                            channels: [],
                            roles: [
                                {
                                    target: "*",
                                    allow: false,
                                },
                                {
                                    target: "417704768660832258",
                                    allow: true,
                                },
                            ],
                            members: [],
                        },
                    ],
                    commands: [
                        {
                            name: "test",
                            group: "def",
                        },
                    ]
                    */
                });
            }

            guilds.push(guildDoc);

            logger.log(logConstants.LOG_DEBUG, "new guid created");

            for (let i = 0; i < commands.length; i++) {
                if (commands[i].check(client, message, guildDoc)) {
                    commands[i].call(client, message, guildDoc);
                    return;
                }
            }
        });
        return;
    }

    logger.log(logConstants.LOG_DEBUG, "guild found");

    for (let i = 0; i < commands.length; i++) {
        if (commands[i].check(client, message, guild)) {
            commands[i].call(client, message, guild);
            return;
        }
    }

    logger.log(logConstants.LOG_DEBUG, "message was not a command or command check failed");
});

client.on("messageDelete", message => {
    logger.log(logConstants.LOG_DEBUG, "message deleted in guild: "+message.guild.id);
});

client.login(config.token);
