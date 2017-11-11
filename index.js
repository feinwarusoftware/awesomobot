/*
AWESOME-0 Discord bot made specifically for the /r/SouthPark Discord
Coded with love by Mattheous & Dragon1320

Using the lovely and quite annoying discord.js repo
QUICK COPY LINKS
Awesome-O picture: https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png
*/

//Import the required modules
const Discord = require('discord.js');
const client = new Discord.Client();
var moment = require('moment');
var momentTz = require('moment-timezone');
var embed = require("./embeds.js");
var spnav = require("./spwikia-nav");
const utils = require("./utils");
const log = require("./log");
const debug = require("./debug");

// Constant globals.
const chatlogfp = "./data/chatlogs.txt";
const blacklistfp = "./data/blacklist.json";
const configfp = "./data/config.json";
const issuefp = "./data/issues.txt";
const groupsfp = "./data/groups.json";

const prefix = "-"

const membermessage = ['Ooohhh I Member!', 'Me member!', 'I member!'];

log.setLogLevel(log.DEBUG | log.ERROR | log.INFO | log.WARNING | log.FILEDUMP);

var devs;
utils.readFile(groupsfp, function(data) {
    devs = JSON.parse(data).dev;
});

var swears;
utils.readFile(blacklistfp, function(data) {
    swears = JSON.parse(data).words;
});

var config;
utils.readFile(configfp, function(data) {
    config = JSON.parse(data);

    //Discord Login Token
    client.login(config.token);
});

// Testing...
function command(message, prefix, command, callback) {
    if (!message.content.startsWith(prefix) && prefix != "") {
        return;
    }

    var args = message.content.substring(prefix.length).toLowerCase().split(" ");

    if (command.toLowerCase() != args[0]) {
        return;
    }

    callback(args);
}

function groupCommand(group, message, prefix, command, callback) {
    if (!message.content.startsWith(prefix) && prefix != "") {
        return;
    }

    // Make helper for this.
    var auth = false || message.author.id == 168690518899949569;
    const roles = message.member.roles.array();
    for (var i = 0; i < roles.length; i++) {
        console.log(roles[i].name);
        if (group.includes(roles[i].name)) {
            auth = true;
        }
    }

    if (auth == false) {
        return;
    }

    var args = message.content.substring(prefix.length).toLowerCase().split(" ");

    if (command.toLowerCase() != args[0]) {
        return;
    }

    callback(args);
}

// Testing...
function trigger(message, words, callback) {
    // Theres a helper for this now!
    if (words instanceof Array) {
        if (utils.messageIncludes(message, words)) {
            callback();
        }
    } else if (message.content.toLowerCase().includes(words)) {
        callback();
    }
}

function test() {
    "use strict";
    let a = 1;
}

//Terminal Ready Message
client.on('ready', () => {
    console.log('Shweet! I am alive!');
    log.write(log.INFO, "Bot connected.", __function, __line);
    log.write(log.DEBUG, "Name: " + client.user.username + ", Id: " + client.user.id + ", Token: " + client.token, __function, __line);

    //Game Name (appears in the sidebar)
    client.user.setGame('v0.2 | -botinfo');

});
process.on("unhandledRejection", (err) => {
    console.error(`Uncaught Promise Rejection: \n${err.stack}`);
});

//Connection Messages
client.on('disconnect', () => {
    console.log('Disconnected');
});

client.on('error', () => {
    console.log('Error');
});

client.on('reconnecting', () => {
    console.log('Reconnecting');
});

client.on("message", function(message) {
    if (message.author.equals(client.user)) return;

    trigger(message, swears, function() {
        utils.logMessage(chatlogfp, message);
        message.delete();
        message.reply(" what WHAT WHAT!!! - Don't be using those words young man");
        log.write(log.INFO, "User: " + message.author.username + ", has been logged for using a blacklisted word.");
    });

    command(message, prefix, "issue", function(args) {
        utils.logMessage(issuefp, message);
        log.write(log.INFO, "User: " + message.author.username + ", has logged an issue.");
    });

    command(message, prefix, "w", function(args) {
        if (args[1] === undefined) { return; }
        
        var query = args[1];
        
        for (var i = 2; i < args.length; i++) {
            query += (" " + args[i]);
        }

        spnav.getPageInfo(query, function(title, url, desc, thumbnail) {
            const descEmbed = new Discord.RichEmbed()
            .setColor(0xC0FF33)
            .setAuthor("AWESOME-O // " + title, "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
            .setURL(url)
            .setThumbnail(thumbnail)
            .setDescription(desc);
            
            message.channel.send(descEmbed);
        });
    });

    command(message, "", "member", function(args) {        
        message.reply(membermessage[Math.floor(Math.random() * membermessage.length)]);
    });

    groupCommand(devs, message, prefix, "fuckyourself", function(args) {
        message.channel.send("http://1.images.southparkstudios.com/blogs/southparkstudios.com/files/2014/09/1801_5a.gif");
    });

    if (!message.content.startsWith(prefix)) return;

    var args = message.content.substring(prefix.length).split(" ");

    switch (args[0].toLowerCase()) {

        //Ping
        case "ping":
            var startTime = Date.now();
            const pingEmbed = new Discord.RichEmbed()
                .setColor(0x85171d)
                .setAuthor("Pong, my man!", 'https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png')
                .setDescription("Time taken : ")
            message.channel.sendEmbed(pingEmbed).then((m) => {
                m.delete()
                pingEmbed.setDescription('Time taken : ' + Math.floor(Date.now() - startTime) + ' ms.');
                pingEmbed.addField('Websocket Response Time : ', Math.floor(client.ping) + "ms")
                message.channel.sendEmbed(pingEmbed)
            });
            break;
            
        case "avatar":
            message.reply(message.author.avatarURL);
            break;

        case "botinfo":
            message.channel.sendEmbed(embed.infoEmbed);
            break;

        case "help":
            message.channel.sendEmbed(embed.helpEmbed);
            break;

        case "help2":
            message.channel.sendEmbed(embed.helpEmbedTwo);
            break;

        case "sub":
            message.reply("http://reddit.com/r/southpark");
            break;

        case "subreddit":
            message.reply("http://reddit.com/r/southpark");
            break
            
        case "microaggression":
            message.delete()
            message.channel.sendMessage("", {
                file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
            });
            break

        case "micro":
            message.delete()
            message.channel.sendMessage("", {
                file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
            });
            break

        case "aggression":
            message.delete()
            message.channel.sendMessage("", {
                file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
            });
            break

        case "reminder":
            message.channel.sendMessage("", {
                file: "https://cdn.discordapp.com/attachments/378287210711220224/378648515959586816/Towelie_Logo2.png"
            });
            break

        case "towel":
            message.channel.sendMessage("", {
                file: "https://cdn.discordapp.com/attachments/378287210711220224/378648515959586816/Towelie_Logo2.png"
            });
            break    

        case "welcome":
            message.channel.sendMessage("", {
                file: "https://cdn.discordapp.com/attachments/371762864790306820/378305844959248385/Welcome.png"
            });
            break


        case "times":
            current_time = moment().format('MMMM Do YYYY, h:mm a');
            est = momentTz().tz("America/New_York").format('MMMM Do YYYY, h:mm a');
            pst = momentTz().tz("America/Los_Angeles").format('MMMM Do YYYY, h:mm a');
            mst = momentTz().tz("America/Boise").format('MMMM Do YYYY, h:mm a');
            nst = momentTz().tz("America/St_Johns").format('MMMM Do YYYY, h:mm a');
            cet = momentTz().tz("Europe/Stockholm").format('MMMM Do YYYY, h:mm a');
            gmt = momentTz().tz("Europe/Dublin").format('MMMM Do YYYY, h:mm a');
            ist = momentTz().tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm a');
            ast = momentTz().tz("Asia/Qatar").format('MMMM Do YYYY, h:mm a');
            timesEmbed = new Discord.RichEmbed()
                .setColor(0xc19245)
                .setAuthor("AWESOME-O // Times", 'https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png')
                .setThumbnail("https://openclipart.org/image/2400px/svg_to_png/217068/6oclock.png")
                .addField("CST (Central Standard Time)", current_time)
                .addField("EST (Eastern Standard Time)", est)
                .addField("PST (Pacific Standard Time)", pst)
                .addField("MST (Mountain Standard Time)", mst)
                .addField("NST (Newfoundland Standard Time)", nst)
                .addField("CET (Central European Time)", cet)
                .addField("GMT (Greenwich Mean Time)", gmt)
                .addField("IST (Indian Standard Time)", ist)
                .addField("AST (Arabia Standard Time)", ast)
                .setFooter("Don't see your timezone? Ping Mattheous to get yours added!")
            message.channel.sendEmbed(timesEmbed);
            break;
            
}
});