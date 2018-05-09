"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");

const express = require("express");
const ejs = require("ejs");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const discord = require("discord.js");
const mongoose = require("mongoose");

const client = new discord.Client();

const GuildSchema = require("./database").schema.guild;
const commands = require("./commands");

const utils = require("./utils");
const logConstants = utils.logger;
const logger = utils.globLogger;

const config = utils.globConfig.data;

// EXPERIMENTAL
const vm = require("vm");
//

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
                logger.log(logConstants.LOG_ERROR, "failed to save guild: "+guilds[i].id+" - "+err);
                return;
            }
        });
    }
}, 5000);

client.on("ready", message => {

    // Workaround for reactions cos discord.js sucks dick.
    let channel = client.channels.find(e => {
        return e.id === "443033827925819402";
    });
    if (channel === undefined) {
        logger.log(logConstants.LOG_ERROR, "could not find reaction channel, reactions will be disabled");
        return;
    }

    channel.fetchMessages({ limit: 10 }).then(specialMessageSnowflakes => {

        let deletionPromises = [];

        let messages = specialMessageSnowflakes.array();

        for (let i = 0; i < messages.length; i++) {
            
            deletionPromises.push(messages[i].delete());
        }

        Promise.all(deletionPromises).then(() => {

            channel.send("placeholder").then(message => {

                message.react(message.guild.emojis.get("443037236888338432")).then(() => {
                    message.react(message.guild.emojis.get("443037201488674816")).then(() => {
                        message.react(message.guild.emojis.get("443037222082576384")).then(() => {
                            message.react(message.guild.emojis.get("443037229145653258")).then(() => {
                                message.react(message.guild.emojis.get("443042071146790915")).then(() => {

                                    reactionMessageId = message.id;
                      
                                    client.user.setGame(`v2.2 | awesomobeta`);
                                    logger.log(logConstants.LOG_INFO, "Bot loaded successfully!");
                                });
                            });
                        });
                    });
                });

            }).catch(error => {
                logger.log(logConstants.LOG_ERROR, error);
            });
        });
    }).catch(error => {
        logger.log(logConstants.LOG_ERROR, error);
    });
});

client.on("message", message => {
    if (message.author.equals(client.user)) {
        logger.log(logConstants.LOG_DEBUG, "aborting - message came from the bot");
        return;
    }

    // TEMP.
    /*
    if (message.guild.id != "405129031445381120") {
        logger.log(logConstants.LOG_DEBUG, "aborting - guild is not the test server");
        return;
    }
    */
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
                                id: "377185900431540234",
                                alias: "fp"
                            },
                            {
                                id: "377181687458824197",
                                alias: "cf"
                            },
                            {
                                id: "402834156238929920",
                                alias: "cm"
                            },
                            {
                                id: "405321120250855425",
                                alias: "gk"
                            }
                        ]
                    },
                    groups: [
                        {
                            name: "def",
                            inherits: [],
                            channels: [],
                            roles: [],
                            members: [],
                            badges: []
                        },
                        {
                            name: "nk",
                            inherits: ["mod", "dev"],
                            channels: [],
                            roles: [
                                {
                                    target: "*",
                                    allow: false
                                },
                                {
                                    target: "375413987338223616",
                                    allow: true
                                }
                            ],
                            members: [],
                            badges: []
                        },
                        {
                            name: "mod",
                            inherits: ["dev"],
                            channels: [],
                            roles: [
                                {
                                    target: "*",
                                    allow: false
                                },
                                {
                                    target: "372409853894983690",
                                    allow: true
                                }
                            ],
                            members: [],
                            badges: []
                        },
                        {
                            name: "dev",
                            inherits: [],
                            channels: [],
                            roles: [
                                {
                                    target: "*",
                                    allow: false
                                },
                                {
                                    target: "378287077806309386",
                                    allow: true
                                }
                            ],
                            members: [],
                            badges: []
                        }
                    ],
                    commands: [
                        {
                            name: "join team",
                            group: "nk"
                        }
                    ],
                    bindings: []
                });
            }

            guilds.push(guildDoc);

            logger.log(logConstants.LOG_DEBUG, "new guid created");

            let first = [];
            let any = [];
            let last = [];
            for (let i = 0; i < commands.length; i++) {
                if (commands[i].data.order === undefined) {
                    any.push(commands[i]);
                    continue;
                }
        
                switch(commands[i].data.order) {
                    case "first":
                        first.push(commands[i]);
                        break;
                    case "any":
                        any.push(commands[i]);
                        break;
                    case "last":
                        last.push(commands[i]);
                        break;
                }
            }
        
            for (let i = 0; i < first.length; i++) {
                if (first[i].check(client, message, guildDoc)) {
                    first[i].call(client, message, guildDoc);
                    if (first[i].data.continue === undefined) {
                        return;
                    }
                    if (first[i].data.continue === false) {
                        return;
                    }
                }
            }
        
            for (let i = 0; i < any.length; i++) {
                if (any[i].check(client, message, guildDoc)) {
                    any[i].call(client, message, guildDoc);
                    if (any[i].data.continue === undefined) {
                        return;
                    }
                    if (any[i].data.continue === false) {
                        return;
                    }
                }
            }
        
            for (let i = 0; i < last.length; i++) {
                if (last[i].check(client, message, guildDoc)) {
                    last[i].call(client, message, guildDoc);
                    if (last[i].data.continue === undefined) {
                        return;
                    }
                    if (last[i].data.continue === false) {
                        return;
                    }
                }
            }

            for (let i = 0; i < guildDoc.bindings.length; i++) {

                if (message.content.split(" ")[0].toLowerCase() === guildDoc.settings.prefix + guildDoc.bindings[i].name) {
                
                    let binding = guildDoc.bindings[i].value;
                    let prefixIndex = binding.indexOf("{prefix}");
                    if (prefixIndex !== -1) {
                        binding = guildDoc.settings.prefix + binding.substring(prefixIndex + 8);
                    }

                    message.content = binding;

                    for (let i = 0; i < any.length; i++) {
                        if (any[i].check(client, message, guildDoc)) {
                            any[i].call(client, message, guildDoc);
                            if (any[i].data.continue === undefined) {
                                return;
                            }
                            if (any[i].data.continue === false) {
                                return;
                            }
                        }
                    }
        
                    return;
                }
            }
        });
        return;
    }

    logger.log(logConstants.LOG_DEBUG, "guild found");

    let first = [];
    let any = [];
    let last = [];
    for (let i = 0; i < commands.length; i++) {
        if (commands[i].data.order === undefined) {
            any.push(commands[i]);
            continue;
        }

        switch(commands[i].data.order) {
            case "first":
                first.push(commands[i]);
                break;
            case "any":
                any.push(commands[i]);
                break;
            case "last":
                last.push(commands[i]);
                break;
        }
    }

    for (let i = 0; i < first.length; i++) {
        if (first[i].check(client, message, guild)) {
            first[i].call(client, message, guild);
            if (first[i].data.continue === undefined) {
                return;
            }
            if (first[i].data.continue === false) {
                return;
            }
        }
    }

    for (let i = 0; i < any.length; i++) {
        if (any[i].check(client, message, guild)) {
            any[i].call(client, message, guild);
            if (any[i].data.continue === undefined) {
                return;
            }
            if (any[i].data.continue === false) {
                return;
            }
        }
    }

    for (let i = 0; i < last.length; i++) {
        if (last[i].check(client, message, guild)) {
            last[i].call(client, message, guild);
            if (last[i].data.continue === undefined) {
                return;
            }
            if (last[i].data.continue === false) {
                return;
            }
        }
    }

    for (let i = 0; i < guild.bindings.length; i++) {

        if (message.content.split(" ")[0].toLowerCase() === guild.settings.prefix + guild.bindings[i].name) {
        
            let binding = guild.bindings[i].value;
            let prefixIndex = binding.indexOf("{prefix}");
            if (prefixIndex !== -1) {
                binding = guild.settings.prefix + binding.substring(prefixIndex + 8);
            }

            message.content = binding;

            for (let i = 0; i < any.length; i++) {
                if (any[i].check(client, message, guild)) {
                    any[i].call(client, message, guild);
                    if (any[i].data.continue === undefined) {
                        return;
                    }
                    if (any[i].data.continue === false) {
                        return;
                    }
                }
            }

            return;
        }
    }

    /*
    for (let i = 0; i < commands.length; i++) {
        if (commands[i].check(client, message, guild)) {
            commands[i].call(client, message, guild);
            return;
        }
    }
    */

    //logger.log(logConstants.LOG_DEBUG, "message was not a command or command check failed");
});

client.on("messageDelete", function (message) {
    logger.log(logConstants.LOG_DEBUG, "message deleted in guild: "+message.guild.id);
});

// Workaround cos discord.js sucks dick.
let reactionMessageId;

client.on("messageReactionAdd", function (messageReaction, user) {

    if (client.user.id === user.id) {
        return;
    }

    if (reactionMessageId === undefined) {
        return;
    }

    if (messageReaction.message.id !== reactionMessageId) {
        return;
    }

    let roles = [
        {
            type: "group",
            name: "cm",
            reactionId: "443037236888338432",
            id: "402834156238929920"
        },
        {
            type: "group",
            name: "cf",
            reactionId: "443037201488674816",
            id: "377181687458824197"
        },
        {
            type: "group",
            name: "fp",
            reactionId: "443037222082576384",
            id: "377185900431540234"
        },
        {
            type: "group",
            name: "gk",
            reactionId: "443037229145653258",
            id: "405321120250855425"
        },
        {
            type: "misc",
            name: "st",
            reactionId: "443042071146790915",
            id: "382384769880555520"
        }
    ];

    for (let i = 0; i < roles.length; i++) {
        if (roles[i].reactionId === messageReaction.emoji.id) {

            let role = messageReaction.message.guild.roles.find(e => {
                return e.id === roles[i].id;
            });
            if (role === undefined || role === null) {
                logger.log(logConstants.LOG_ERROR, `${roles[i].name} role not found`);
                return;
            }

            let member = messageReaction.message.guild.members.find(e => {
                return e.id === user.id;
            });
            if (member === undefined || member === null) {
                logger.log(logConstants.LOG_ERROR, "member not found in guild but reacted to a message... lolwat");
                return;
            }

            let memberRole = member.roles.find(e => {
                return e.id === roles[i].id;
            });
            if (memberRole !== undefined && memberRole !== null) {
                messageReaction.remove(user);
                return;
            }

            if (roles[i].type === "misc") {
                member.addRole(role);
                return;
            }

            for (let j = 0; j < roles.length; j++) {
                if (roles[j].type === "misc") {
                    continue;
                }

                // remove role
                let memberRole = member.roles.find(e => {
                    return e.id === roles[j].id;
                });
                if (memberRole === undefined || memberRole === null) {
                    continue;
                }

                member.removeRole(memberRole);

                // remove reaction
                let memberReaction = messageReaction.message.reactions.find(e => {
                    return e.id === roles[j].reactionId;
                });
                if (memberReaction === undefined || memberReaction === null) {
                    logger.log(logConstants.LOG_ERROR, `message doesn't have the ${roles[j].name} reaction`);
                    continue;
                }

                let reactionUser = memberReaction.users.find(e => {
                    return e.id === user.id;
                });
                if (reactionUser === undefined || reactionUser === null) {
                    continue;
                }

                memberReaction.remove(reactionUser);
            }

            member.addRole(role);

            break;
        }
    }
});

client.on("messageReactionRemove", (messageReaction, user) => {
    

});

client.on("guildMemberAdd", member => {
    
    findGuild(member.guild.id).then(guild => {
        
        let dbMember;

        for (let i = 0; i < guild.members.length; i++){
            if (guild.members[i].id === member.user.id){
                dbMember = guild.members[i];
                break;
            }
        }
        if (dbMember === undefined){
            return;
        }

        let roles = member.guild.roles.array();

        for (let i = 0; i < dbMember.roles.length; i++){
            for (let j = 0; j < roles.length; j++){
                if (dbMember.roles[i] === roles[j].id){
                    member.addRole(roles[j]);
                    break;
                }
            }
        }

    }).catch(error =>{
        condole.log(error);
    });
});

client.login(config.token);

// API.

const app = express();
const port = "3002";
const server = http.createServer(app);

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.set("env", "development");
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.set("views", path.join(__dirname, "templates"));
app.use(express.static(path.join(__dirname, "static")));

const guildRouter = express.Router();

function findGuild(id) {
    return new Promise((resolve, reject) => {
        const guild = guilds.find(e => {
            return e.id === id;
        });
        if (guild === undefined) {
            GuildSchema.findOne({ id: id }, (error, guildDoc) => {
                if (error !== null) {
                    return reject(error);
                }
                if (guildDoc === null) {
                    return reject("guild not found");
                }
                guilds.push(guildDoc);
                return resolve(guildDoc);
            });
        } else {
            return resolve(guild);
        }
    });
}

app.route("/guilds").get((req, res) => {

    return res.json({ error: "api route under construction!" });

}).post((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.body.id).then(guild => {
        return res.json({ error: "guild already exists" });
    }).catch(error => {
        if (req.body.id === undefined) {
            return res.json({ error: "id undefined" });
        }

        const guild = new GuildSchema({
            id: req.body.id,
            premium: req.body.premium === undefined ? false : req.body.premium,
            settings: req.body.settings === undefined ? {} : req.body.settings,
            members: req.body.members === undefined ? [] : req.body.members,
            groups: req.body.groups === undefined ? [] : req.body.groups,
            commands: req.body.commands === undefined ? [] : req.body.commands,
            bindings: req.body.bindings === undefined ? [] : req.body.bindings
        });
        guilds.push(guild);
        guild.save(error => {
            if (error !== null) {
                return res.json({error});
            }
            return res.json({ success: "guild created" });
        });
    });
    
});

app.route("/guilds/:guild_id").get((req, res) => {

    findGuild(req.params.guild_id).then(guild => {
        return res.json(guild);
    }).catch(error => {
        return res.json({error});
    });
    
}).put((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {
        guild.premium = req.body.premium === undefined ? false : req.body.premium;
        guild.settings = req.body.settings === undefined ? {} : req.body.settings;
        guild.members = req.body.members === undefined ? [] : req.body.members;
        guild.groups = req.body.groups === undefined ? [] : req.body.groups;
        guild.commands = req.body.commands === undefined ? [] : req.body.commands;
        guild.bindings = req.body.bindings === undefined ? [] : req.body.bindings;
        guild.save(error => {
            if (error !== null) {
                return res.json({error});
            }
            return res.json({ success: "guild updated" });
        });
    }).catch(error => {
        return res.json({error});
    });

}).patch((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {
        if (req.body.premium !== undefined) {
            guild.premium = req.body.premium;
        }
        if (req.body.settings !== undefined) {
            guild.settings = req.body.settings;
        }
        if (req.body.members !== undefined) {
            guild.members = req.body.members;
        }
        if (req.body.groups !== undefined) {
            guild.groups = req.body.groups;
        }
        if (req.body.commands !== undefined) {
            guild.commands = req.body.commands;
        }
        if (req.body.bindings !== undefined) {
            guild.bindings = req.body.bindings;
        }
        guild.save(error => {
            if (error !== null) {
                return res.json({error});
            }
            return res.json({ success: "guild patched" });
        });
    }).catch(error => {
        return res.json({error});
    });

}).delete((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {
        let found = false;
        for (let i = 0; i < guilds.length; i++) {
            if (guilds[i].id === req.params.guild_id) {
                guilds.splice(i, 1);
                GuildSchema.remove({ id: req.params.guild_id }, (err, guildDoc) => {
                    if (error !== null) {
                        return res.json({error});
                    }
                    return res.json({ success: "guild removed successfully" });
                });
                found = true;
                break;
            }
        }
        if (found === false) {
            return res.json({ error: "could not find guild" });
        }
    }).catch(error => {
        return res.json({error});
    });

});

//
app.route("/guilds/:guild_id/settings").get((req, res) => {

    findGuild(req.params.guild_id).then(guild => {
        return res.json(guild.settings);
    }).catch(error => {
        return res.json({error});
    });

}).put((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {
        guild.settings.prefix = req.body.prefix === undefined ? "<<" : req.body.prefix;
        guild.settings.fandom = req.body.fandom === undefined ? "southpark" : req.body.fandom;
        guild.settings.logChannel = req.body.logChannel === undefined ? "rawrxd" : req.body.logChannel;
        guild.settings.groundedRole = req.body.groundedRole === undefined ? "lolok" : req.body.groundedRole;
        guild.settings.teamRoles = req.body.teamRoles === undefined ? [] : req.body.teamRoles;
        guild.save(error => {
            if (error !== null) {
                return res.json({error});
            }
            return res.json({ success: "guild settings updated" });
        });
    }).catch(error => {
        return res.json({error});
    });

}).patch((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {
        if (req.body.prefix !== undefined) {
            guild.settings.prefix = req.body.prefix;
        }
        if (req.body.fandom !== undefined) {
            guild.settings.fandom = req.body.fandom;
        }
        if (req.body.logChannel !== undefined) {
            guild.settings.logChannel = req.body.logChannel;
        }
        if (req.body.groundedRole !== undefined) {
            guild.settings.groundedRole = req.body.groundedRole;
        }
        if (req.body.teamRoles !== undefined) {
            guild.settings.teamRoles = req.body.teamRoles;
        }
        guild.save(error => {
            if (error !== null) {
                return res.json({error});
            }
            return res.json({ success: "guild settings patched" });
        });
    }).catch(error => {
        return res.json({error});
    });

}).delete((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {
        guild.settings = {
            prefix: "<<",
            fandom: "southpark"
        };
        guild.save(error => {
            if (error !== null) {
                return res.json({error});
            }
            return res.json({ success: "guild settings reset" });
        });
    }).catch(error => {
        return res.json({error});
    });
});
//

//
app.route("/guilds/:guild_id/members").get((req, res) => {

    findGuild(req.params.guild_id).then(guild => {
        return res.json(guild.members);
    }).catch(error => {
        return res.json({error});
    });

}).post((req, res) => {

    return res.json({ error: "api route under construction!" });

});
app.route("/guilds/:guild_id/members/:member_id").get((req, res) => {

    findGuild(req.params.guild_id).then(guild => {
        
        let member = guild.members.find(e => {
            return e.id === req.params.member_id;
        });
        if (member === undefined) {
            return res.json({ error: "member not found" });
        }
        return res.json(member);

    }).catch(error => {
        return res.json({error});
    });

}).put((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {

        let member = guild.members.find(e => {
            return e.id === req.params.member_id;
        });
        if (member === undefined) {
            return res.json({ error: "member not found" });
        }
        
        member.stats = req.body.stats === undefined ? [] : req.body.stats;
        member.badges = req.body.badges === undefined ? [] : req.body.badges;

        guild.save(error => {
            if (error !== null) {
                return res.json({error});
            }
            return res.json({ success: "guild member updated" });
        });
    }).catch(error => {
        return res.json({error});
    });

}).patch((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {

        let member = guild.members.find(e => {
            return e.id === req.params.member_id;
        });
        if (member === undefined) {
            return res.json({ error: "member not found" });
        }

        if (req.body.stats !== undefined) {
            member.stats = req.body.stats;
        }
        if (req.body.badges !== undefined) {
            member.badges = req.body.badges;
        }

        guild.save(error => {
            if (error !== null) {
                return res.json({error});
            }
            return res.json({ success: "guild member patched" });
        });
    }).catch(error => {
        return res.json({error});
    });

}).delete((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {
        let found = false;
        for (let i = 0; i < guild.members.length; i++) {
            if (guild.members[i].id === req.params.member_id) {
                guild.members.splice(i, 1);
                guild.save(error => {
                    if (error !== null) {
                        return res.json({error});
                    }
                    return res.json({ success: "guild member removed" });
                });
                found = true;
                break;
            }
        }
        if (found === false) {
            return res.json({ error: "could not find guild" });
        }
    }).catch(error => {
        return res.json({error});
    });
});
//

//
app.route("/guilds/:guild_id/groups").get((req, res) => {

    findGuild(req.params.guild_id).then(guild => {
        return res.json(guild.groups);
    }).catch(error => {
        return res.json({error});
    });

}).post((req, res) => {
    
    return res.json({ error: "api route under construction!" });

});
app.route("/guilds/:guild_id/groups/:group_name").get((req, res) => {

    findGuild(req.params.guild_id).then(guild => {
        
        let group = guild.groups.find(e => {
            return e.name === req.params.group_name;
        });
        if (group === undefined) {
            return res.json({ error: "group not found" });
        }
        return res.json(group);

    }).catch(error => {
        return res.json({error});
    });

}).put((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {

        let group = guild.groups.find(e => {
            return e.name === req.params.group_name;
        });
        if (group === undefined) {
            return res.json({ error: "group not found" });
        }

        if (req.body.name === undefined) {
            return res.json({ error: "name undefined" });
        }
        
        group.name = req.body.name;
        group.inherits = req.body.inherits === undefined ? [] : req.body.inherits;
        group.channels = req.body.channels === undefined ? [] : req.body.channels;
        group.roles = req.body.roles === undefined ? [] : req.body.roles;
        group.members = req.body.members === undefined ? [] : req.body.members;
        group.badges = req.body.badges === undefined ? [] : req.body.badges;

        guild.save(error => {
            if (error !== null) {
                return res.json({error});
            }
            return res.json({ success: "guild group updated" });
        });
    }).catch(error => {
        return res.json({error});
    });

}).patch((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {

        let group = guild.groups.find(e => {
            return e.name === req.params.group_name;
        });
        if (group === undefined) {
            return res.json({ error: "group not found" });
        }

        if (req.body.name !== undefined) {
            group.name = req,body.name;
        }
        if (req.body.inherits !== undefined) {
            group.inherits = req,body.inherits;
        }
        if (req.body.channels !== undefined) {
            group.channels = req,body.channels;
        }
        if (req.body.roles !== undefined) {
            group.roles = req,body.roles;
        }
        if (req.body.members !== undefined) {
            group.members = req,body.members;
        }
        if (req.body.badges !== undefined) {
            group.badges = req,body.badges;
        }

        guild.save(error => {
            if (error !== null) {
                return res.json({error});
            }
            return res.json({ success: "guild group patched" });
        });
    }).catch(error => {
        return res.json({error});
    });

}).delete((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {
        let found = false;
        for (let i = 0; i < guild.groups.length; i++) {
            if (guild.groups[i].name === req.params.group_name) {
                guild.groups.splice(i, 1);
                guild.save(error => {
                    if (error !== null) {
                        return res.json({error});
                    }
                    return res.json({ success: "guild group removed" });
                });
                found = true;
                break;
            }
        }
        if (found === false) {
            return res.json({ error: "could not find guild" });
        }
    }).catch(error => {
        return res.json({error});
    });
});
//

//
app.route("/guilds/:guild_id/commands").get((req, res) => {

    findGuild(req.params.guild_id).then(guild => {
        return res.json(guild.commands);
    }).catch(error => {
        return res.json({error});
    });

}).post((req, res) => {
    
    return res.json({ error: "api route under construction!" });

});
app.route("/guilds/:guild_id/commands/:command_name").get((req, res) => {

    findGuild(req.params.guild_id).then(guild => {
        
        let command = guild.commands.find(e => {
            return e.name === req.params.command_name;
        });
        if (command === undefined) {
            return res.json({ error: "command not found" });
        }
        return res.json(command);

    }).catch(error => {
        return res.json({error});
    });

}).put((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {

        let command = guild.commands.find(e => {
            return e.name === req.params.command_name;
        });
        if (command === undefined) {
            return res.json({ error: "command not found" });
        }

        if (req.body.name === undefined) {
            return res.json({ error: "name undefined" });
        }
        
        command.name = req.body.name;
        command.group = req.body.group === undefined ? "def" : req.body.group;

        guild.save(error => {
            if (error !== null) {
                return res.json({error});
            }
            return res.json({ success: "guild command updated" });
        });
    }).catch(error => {
        return res.json({error});
    });

}).patch((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {

        let command = guild.commands.find(e => {
            return e.name === req.params.command_name;
        });
        if (command === undefined) {
            return res.json({ error: "command not found" });
        }

        if (req.body.name !== undefined) {
            command.name = req.body.name;
        }
        if (req.body.group !== undefined) {
            command.group = req.body.group;
        }

        guild.save(error => {
            if (error !== null) {
                return res.json({error});
            }
            return res.json({ success: "guild command patched" });
        });
    }).catch(error => {
        return res.json({error});
    });

}).delete((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {
        let found = false;
        for (let i = 0; i < guild.commands.length; i++) {
            if (guild.commands[i].name === req.params.command_name) {
                guild.commands.splice(i, 1);
                guild.save(error => {
                    if (error !== null) {
                        return res.json({error});
                    }
                    return res.json({ success: "guild command removed" });
                });
                found = true;
                break;
            }
        }
        if (found === false) {
            return res.json({ error: "could not find guild" });
        }
    }).catch(error => {
        return res.json({error});
    });
});
//

//
app.route("/guilds/:guild_id/bindings").get((req, res) => {

    findGuild(req.params.guild_id).then(guild => {
        return res.json(guild.bindings);
    }).catch(error => {
        return res.json({error});
    });

}).post((req, res) => {
    
    return res.json({ error: "api route under construction!" });

});
app.route("/guilds/:guild_id/bindings/:binding_name").get((req, res) => {

    findGuild(req.params.guild_id).then(guild => {
        
        let binding = guild.bindings.find(e => {
            return e.name === req.params.binding_name;
        });
        if (binding === undefined) {
            return res.json({ error: "binding not found" });
        }
        return res.json(binding);

    }).catch(error => {
        return res.json({error});
    });

}).put((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {

        let binding = guild.bindings.find(e => {
            return e.name === req.params.binding_name;
        });
        if (binding === undefined) {
            return res.json({ error: "binding not found" });
        }

        if (req.body.name === undefined) {
            return res.json({ error: "name undefined" });
        }
        
        binding.name = req.body.name;
        binding.authorId = req.body.authorId === undefined ? "xdid" : req.body.authorId;
        binding.value = req.body.value === undefined ? `Warning: I'm the only person who could possibly trigger this api route. In that event the bot should crash anyway. In the unlikely event that it doesn't, your ip will only be visiable to the other awesomo devs who could get your ip anyway. I just wanted to put this here for some certain people who have no fucking sense of humour. Anyway back to the fucking ~~already ruined~~ joke... Someone who has no idea wtf they're doing was messing around with my api and fucked it up. ~~Their ip definitely isn't: ${req.ip}.~~ Enjoy!` : req.body.value;

        guild.save(error => {
            if (error !== null) {
                return res.json({error});
            }
            return res.json({ success: "guild binding updated" });
        });
    }).catch(error => {
        return res.json({error});
    });

}).patch((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {

        let binding = guild.bindings.find(e => {
            return e.name === req.params.binding_name;
        });
        if (binding === undefined) {
            return res.json({ error: "binding not found" });
        }

        if (req.body.name !== undefined) {
            binding.name = req.body.name;
        }
        if (req.body.authorId !== undefined) {
            binding.authorId = req.body.authorId;
        }
        if (req.body.value !== undefined) {
            binding.value = req.body.value;
        }
        
        guild.save(error => {
            if (error !== null) {
                return res.json({error});
            }
            return res.json({ success: "guild binding patched" });
        });
    }).catch(error => {
        return res.json({error});
    });

}).delete((req, res) => {

    const token = req.headers["xxx-access-token"];
    if (token === undefined) {
        return res.json({ error: "access token undefined" });
    }
    if (token !== config.api_token_temp) {
        return res.json({ error: "invalid access token" });
    }

    findGuild(req.params.guild_id).then(guild => {
        let found = false;
        for (let i = 0; i < guild.bindings.length; i++) {
            if (guild.bindings[i].name === req.params.binding_name) {
                guild.bindings.splice(i, 1);
                guild.save(error => {
                    if (error !== null) {
                        return res.json({error});
                    }
                    return res.json({ success: "guild binding removed" });
                });
                found = true;
                break;
            }
        }
        if (found === false) {
            return res.json({ error: "could not find guild" });
        }
    }).catch(error => {
        return res.json({error});
    });

});
//

app.use((req, res, next) => {
	let err = new Error("Not Found");
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	res.status(err.status || 500);
	res.render("error");
});

server.on("error", (err) => {
	if (err.syscall !== "listen") {
		throw err;
	}

	let bind = typeof port === "string" ?
		"Pipe " + port :
		"Port " + port;

	switch (err.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use");
			process.exit(1);
			break;
		default:
			throw err;
	}
});

server.on("listening", () => {
	let addr = server.address();
	let bind = typeof addr === "string" ?
		"pipe " + addr :
		"port " + addr.port;
	console.log("API magic happens on port: " + bind);
});

server.listen(port);
