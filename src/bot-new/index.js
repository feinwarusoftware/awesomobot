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
    client.user.setGame(`v2.2 | awesomobeta`);
    logger.log(logConstants.LOG_INFO, "Bot loaded successfully!");
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

client.on("messageDelete", message => {
    logger.log(logConstants.LOG_DEBUG, "message deleted in guild: "+message.guild.id);
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

app.route("/guilds").post((req, res) => {

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
        const guild = new GuildSchema({
            id: req.body.id,
            premium: req.body.premium,
            settings: req.body.settings,
            members: req.body.members,
            groups: req.body.groups,
            commands: req.body.commands,
            bindings: req.body.bindings
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
        guild.premium = req.body.premium;
        guild.settings = req.body.settings;
        guild.members = req.body.members;
        guild.groups = req.body.groups;
        guild.commands = req.body.commands;
        guild.bindings = req.body.bindings;
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
        guild.settings.prefix = req.body.prefix;
        guild.settings.fandom = req.body.fandom;
        guild.settings.logChannel = req.body.logChannel;
        guild.settings.groundedRole = req.body.groundedRole;
        guild.settings.teamRoles = req.body.teamRoles;
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
