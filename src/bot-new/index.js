"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");

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

const port = 3001;
const publicPath = "public";
const server = http.createServer((req, res) => {
    logger.log(logConstants.LOG_DEBUG, `request ${req.url}`);

    let filePath = path.join(__dirname, publicPath, req.url);
    if (req.url === "/") {
        filePath = path.join(__dirname, publicPath, "index.html");;
    }

    let extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".gif": "image/gif",
        ".wav": "audio/wav",
        ".mp4": "video/mp4",
        ".woff": "application/font-woff",
        ".ttf": "application/font-ttf",
        ".eot": "application/vnd.ms-fontobject",
        ".otf": "application/font-otf",
        ".svg": "application/image/svg+xml"
    };

    let contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === "ENOENT") {

                // not a static file, possibly an api route

                // "/guilds/0000/members/0000/stats?name=aaa"
                // "/guilds/:id/members/:id/stats?name=aaa"

                class Route {
                    constructor(type, path, cb) {

                        this.type = type;
                        this.path = path;
                        this.cb = cb;
                    }
                    check(url) {

                        let params = {};

                        let pathStart = 0;
                        let urlStart = 0;
                        while (pathStart !== -1 || urlStart !== -1) {

                            let pathPart = this.path.substring(pathStart, this.path.indexOf("/", pathStart + 1) === -1 ? this.path.length : this.path.indexOf("/", pathStart + 1));
                            let urlPart = url.substring(urlStart, url.indexOf("/", urlStart + 1) === -1 ? url.length : url.indexOf("/", urlStart + 1));

                            if (pathPart === "" || urlPart === "") {
                                return;
                            }

                            if (pathPart.startsWith("/:")) {
                                params[pathPart.substring(2)] = urlPart.substring(1);                                
                            } else if (pathPart !== urlPart) {
                                return;
                            }

                            pathStart = this.path.indexOf("/", pathStart + 1);
                            urlStart = url.indexOf("/", urlStart + 1);
                        }

                        this.cb(params);
                    }
                }

                const routes = [     
                    new Route("get", "/guilds/:guild_id/settings", params => {

                        console.log("/guilds/:guild_id/settings");
                    }),
                    new Route("get", "/guilds/:guild_id/settings/teamroles/:teamrole_id", params => {

                        console.log("/guilds/:guild_id/settings/teamroles/:teamrole_id");
                    }),

                    new Route("get", "/guilds/:guild_id/members", params => {

                        console.log("/guilds/:guild_id/members");
                    }),
                    new Route("get", "/guilds/:guild_id/members/:member_id", params => {

                        console.log("/guilds/:guild_id/members/:member_id");
                    }),
                    new Route("get", "/guilds/:guild_id/members/:member_id/stats/:stat_name", params => {

                        console.log("/guilds/:guild_id/members/:member_id/stats/:stat_name");
                    }),

                    new Route("get", "/guilds/:guild_id/groups", params => {

                        console.log("/guilds/:guild_id/groups");
                    }),
                    new Route("get", "/guilds/:guild_id/groups/:group_name", params => {

                        console.log("/guilds/:guild_id/groups/:group_name");
                    }),

                    new Route("get", "/guilds/:guild_id/commands", params => {

                        console.log("/guilds/:guild_id/commands");
                    }),
                    new Route("get", "/guilds/:guild_id/commands/command_name", params => {

                        console.log("/guilds/:guild_id/commands/command_name");
                    }),
                ];

                for (let i = 0; i < routes.length; i++) {

                    routes[i].check(req.url);
                }

            } else {
                res.writeHead(500);
                res.end("Sorry, check with the site admin for error: " + error.code + " ..\n");
                res.end();
            }
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
        }
    });
});

server.on("listening", () => {
    logger.log(logConstants.LOG_INFO, `API magic happens on port: ${port}`);
});

server.on("error", error => {
    logger.log(logConstants.LOG_ERROR, error);
});

server.listen(port);
