"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");

const express = require("express");
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

let build;
try {
    build = JSON.parse(fs.readFileSync(path.join(__dirname, "config", "build.json"))).build;
    build++;
    fs.writeFileSync(path.join(__dirname, "config", "build.json"), JSON.stringify({build}));
} catch(error) {
    console.error(error);
}

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
    client.user.setGame(`v2.5.${build} | awesomobeta`);
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

/*
const app = express();
const port = "3001";
const server = http.createServer(app);

app.set("env", "development");
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static(path.join(__dirname, "static")));

const guildRouter = express.Router();

guildRouter.route("/").get((req, res) => {

    for (let i = 0; i < guilds.length; i++) {
        if (guilds[i].id === req.params.guild_id) {
            
            return res.json(guilds[i]);
        }
    }

    GuildSchema.findOne({ id: message.guild.id }, (err, guildDoc) => {
        if (err !== undefined) {

            return res.json({ error: "404 not found" });
        }

        return res.json(guildDoc);
    });
});

guildRouter.route("/settings").get((req, res) => {

});
guildRouter.route("/settings/teamroles").get((req, res) => {

});
guildRouter.route("/settings/teamroles/:teamrole_id").get((req, res) => {

});

guildRouter.route("/members").get((req, res) => {

});
guildRouter.route("/members/:member_id").get((req, res) => {

});
guildRouter.route("/members/:member_id/stats").get((req, res) => {

});
guildRouter.route("/members/:member_id/stats/:stat_name").get((req, res) => {

});

guildRouter.route("/groups").get((req, res) => {

});
guildRouter.route("/groups/:group_name").get((req, res) => {

});

guildRouter.route("/commands").get((req, res) => {

});
guildRouter.route("/commands/:command_name").get((req, res) => {

});

app.use("/guilds/:guild_id", guildRouter);

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
	debug("Listening on " + bind);
});
*/
