"use strict";

const path = require("path");

const mongoose = require("mongoose");
const discord = require("discord.js");

const { initSchemas } = require("../db");
initSchemas(mongoose);

const config = require("./config.json");

const {
    log: {
        info,
        warn,
        error
    },
    Sandbox,
    loadGuild,
    loadGuilds,
    loadLocalScripts,
    loadGuildScripts,
    loadUser,
    matchScript,
    evalPerms,
} = require("../utils");

process.on('uncaughtException', function (exception) {
    console.error(exception); // to see your exception details in the console
    // if you are on production, maybe you can send the exception details to your
    // email as well ?
  });

//
mongoose.connect(`mongodb://${config.mongo_user === null && config.mongo_pass === null ? "" : `${config.mongo_user}:${config.mongo_pass}@`}localhost/rawrxd`, {
    useNewUrlParser: true,
    ...(config.mongo_user === null && config.mongo_pass === null ? {} : {
        auth: {
            authdb: "admin"
        }
    })
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", err => {
    
    error(`error connecting to mongo: ${err}`);
});
db.on("open", () => {
    
    info("connected to mongo");
});
//

//
const sandbox = new Sandbox();

const baseScriptSandbox = {

    RichEmbed: discord.RichEmbed
};
//

//
let scripts;
//

//
const client = new discord.Client();
client.login(config.token).then(() => {

    info("logged into discord");

}).catch(err => {

    error(`error logging into discord: ${err}`);
    return process.exit(-1);
});

client.on("error", err => {

    error(err);
});

client.on("ready", async () => {

    try {
        scripts = await loadLocalScripts(path.join(__dirname, "scripts"));

    } catch (err) {

        error(`error loading local scripts: ${err}`);
        return process.exit(-1);
    }

    try {
        await loadGuilds(client.guilds.map(e => e.id));

    } catch (err) {

        error(`error loading guilds: ${err}`);
        return process.exit(-1);
    }

    try {
        client.user.setActivity(`AWESOM-O ${config.version}`);

    } catch (err) {

        error(`error setting playing status: ${err}`);
        return process.exit(-1);
    }

    info("bot ready");
});

client.on("guildCreate", async guild => {

    try {
        await loadGuild(guild.id);

    } catch (err) {

        return error(`error loading guild: ${guild.name}, ${guild.id}: ${err}`);
    }

    info(`loaded new guild: ${guild.name}, ${guild.id}`);
});

client.on("message", async message => {

    if (client.user.id === message.author.id) {

        return;
    }

    if (scripts == null) {

        return warn("received a message event before loading local scripts, ignoring");
    }

    let dbGuild;
    try {
        dbGuild = await loadGuild(message.guild.id);

    } catch (err) {

        return error(`error loading guild: ${guild.name}, ${guild.id}: ${err}`);
    }

    if (dbGuild.premium === false) {

        return;
    }

    let dbUser;
    try {
        dbUser = await loadUser(message.author.id);

    } catch (err) {

        return error(`error loading user: ${message.author.username}, ${message.author.id}: ${err}`);
    }

    const userStatsInc = {};

    if (message.content.includes("shit")) {

        dbUser.shits += 1;
        userStatsInc.shits = 1;
    }

    let xp;
    if (message.content.length <= 15) {

        xp = 1;
    } else {

        xp = Math.min(25, Math.round(message.content.length / 10));
    }

    dbUser.xp += xp;
    userStatsInc.xp = xp;

    // async
    dbUser.updateOne({
        $inc: userStatsInc
    }).catch(err => {

        error(`error saving user stats: ${message.author.username}, ${message.author.id}: ${err}`);
    });

    let guildScripts;
    try {
        guildScripts = await loadGuildScripts(dbGuild);

    } catch (err) {

        return error(`error loading guild scripts: ${guild.name}, ${guild.id}: ${err}`);
    }

    let matchedScript;
    let matchedTerm;
    for (let guildScript of guildScripts) {

        const {matched, err} = matchScript(dbGuild.prefix,
            guildScript.match_type_override || guildScript.match_type,
            guildScript.match_override || guildScript.match,
            message.content);

        if (err != null) {

            return error(`error matching script: ${guildScript.name}: ${err}`);
        }

        if (matched !== false) {

            matchedScript = guildScript;
            matchedTerm = matched;
            break;
        }
    }

    if (matchedTerm == null) {

        return;
    }

    if (!evalPerms(matchedScript, message.member, message.channel)) {

        return;
    }

    if (matchedScript.local) {

        const localScript = scripts.find(e => e.name === matchedScript.name);
        if (localScript == null) {

            return error(`could not find local script: ${matchedScript.name}`);
        }

        try {
            localScript.run(client, message, dbGuild, dbUser, matchedScript, matchedTerm);

        } catch (err) {

            error(`error running local script: ${localScript.name}: ${err}`);
        }
    } else {
        if (matchedScript.type === "js") {

            try {
                sandbox.exec(matchedScript.code, { ...baseScriptSandbox,
                    message
                });

            } catch (err) {

                error(`error running non local script: ${matchedScript.name}: ${err}`);
            }
        } else {

            // old code
            warn(`json script parser called, this is old code and may not work as intended: ${matchedScript.name}`);

            // json script handling

            if (matchedScript.data.action === "text") {

                return message.channel.send(script.data.args[0].value);
            }

            if (matchedScript.data.action === "file") {

                return message.channel.send("", {
                    file: script.data.args[0].value
                });
            }

            if (matchedScript.data.action === "embed") {

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

                for (let arg of matchedScript.data.args) {

                    // cos discord embeds have the BIG gay
                    switch (arg.field) {
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
});
//
