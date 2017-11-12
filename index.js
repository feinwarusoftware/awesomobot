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
utils.readFile(groupsfp, function (data) {
    devs = JSON.parse(data).dev;
});

var newkids;
utils.readFile(groupsfp, function (data) {
    newkids = JSON.parse(data).newkid;
});

var swears;
utils.readFile(blacklistfp, function (data) {
    swears = JSON.parse(data).words;
});

var config;
utils.readFile(configfp, function (data) {
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

client.on("message", function (message) {
    if (message.author.equals(client.user)) return;


// Triggers
    //Swear Trigger
    trigger(message, swears, function () {
        utils.logMessage(chatlogfp, message);
        message.delete();
        message.reply(" what WHAT WHAT!!! - Don't be using those words young man");
        log.write(log.INFO, "User: " + message.author.username + ", has been logged for using a blacklisted word.");
    });

//End of Triggers

//Universal Commands
    
    //Issue
    command(message, prefix, "issue", function (args) {
        utils.logMessage(issuefp, message);
        log.write(log.INFO, "User: " + message.author.username + ", has logged an issue.");
    });

    //Wiki
    command(message, prefix, "w", function (args) {
        if (args[1] === undefined) {
            return;
        }

        var query = args[1];

        for (var i = 2; i < args.length; i++) {
            query += (" " + args[i]);
        }

        spnav.getPageInfo(query, function (title, url, desc, thumbnail) {
            const descEmbed = new Discord.RichEmbed()
                .setColor(0xC0FF33)
                .setAuthor("AWESOME-O // " + title, "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .setURL(url)
                .setThumbnail(thumbnail)
                .setDescription(desc);

            message.channel.send(descEmbed);
        });
    });

    //Member Berries
    command(message, "", "member", function (args) {
        message.reply(membermessage[Math.floor(Math.random() * membermessage.length)]);
    });

    //F to Pay Respects
    command(message, prefix, "f", function (args) {
        message.reply("Respects have been paid.");
    });

    //Ping
    command(message, prefix, "ping", function (args) {
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
    });

    //Avatar
    command(message, prefix, "avatar", function (args) {
        message.reply(message.author.avatarURL);
    });

    //Bot Info
    command(message, prefix, "botinfo", function (args) {
        message.channel.sendEmbed(embed.infoEmbed);
    });

    //Help
    command(message, prefix, "help", function (args) {
        message.channel.sendEmbed(embed.helpEmbed);
    });

    //Help Page 2
    command(message, prefix, "help2", function (args) {
        message.channel.sendEmbed(embed.helpEmbedTwo);
    });

    //Subreddit Link
    command(message, prefix, "sub", function (args) {
        message.reply("http://reddit.com/r/southpark");
    });

    //Subreddit Link 2
    command(message, prefix, "subreddit", function (args) {
        message.reply("http://reddit.com/r/southpark");
    });

    //Microagressions
        
        //-microaggression
        command(message, prefix, "microaggression", function (args) {
            message.delete()
            message.channel.sendMessage("", {
                file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
            });
        });

        //-micro
        command(message, prefix, "micro", function (args) {
            message.delete()
            message.channel.sendMessage("", {
                file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
            });
        });

        //-aggression
        command(message, prefix, "aggression", function (args) {
            message.delete()
            message.channel.sendMessage("", {
                file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
            });
        });

    //Towel Reminder
    command(message, prefix, "reminder", function (args) {
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/378287210711220224/378648515959586816/Towelie_Logo2.png"
        });
    });

    //Towel Reminder 2
    command(message, prefix, "towel", function (args) {
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/378287210711220224/378648515959586816/Towelie_Logo2.png"
        });
    });

    //Welcome Image
    command(message, prefix, "welcome", function (args) {
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/371762864790306820/378305844959248385/Welcome.png"
        });
    });

    //Times
    command(message, prefix, "times", function (args) {
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

    });

//End Universal Commands

//Group Specific Commands

    //Moderator Commands
        
        //Fuck Yourself
        groupCommand(devs, message, prefix, "fuckyourself", function (args) {
            message.delete();
            message.channel.send("", {
                file: "http://1.images.southparkstudios.com/blogs/southparkstudios.com/files/2014/09/1801_5a.gif"
            });
        });

        //Dick
        groupCommand(devs, message, prefix, "dick", function (args) {
            message.delete();
            message.channel.send("", {
                file: "https://actualconversationswithmyhusband.files.wordpress.com/2017/01/stop-being-a-dick-scott.gif"
            });
        });

        //Fuck You
        groupCommand(devs, message, prefix, "fuckyou", function (args) {
            message.delete();
            message.channel.send("", {
                file: "https://cdn.vox-cdn.com/thumbor/J0D6YqKKwCqNY2zaej_MEUlT-oo=/3x0:1265x710/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/39977666/fuckyou.0.0.jpg"
            });
        });
    //New Kid Commands
        
        //Freedom Pals
        groupCommand(newkids, message, prefix, "addfp", function (args) {
            let fpRole = message.guild.roles.find('name', 'Freedom Pals');
            message.member.addRole(fpRole) .then(m => message.reply('You are now a member of the Freedom Pals!')).catch(console.error);
        });
        groupCommand(newkids, message, prefix, "removefp", function (args) {
            let fpRole = message.guild.roles.find('name', 'Freedom Pals');
            message.member.removeRole(fpRole) .then(m => message.reply('You are no longer a member of the Freedom Pals!')).catch(console.error);
        });

        //Coon & Friends
        groupCommand(newkids, message, prefix, "addcf", function (args) {
            let cfRole = message.guild.roles.find('name', 'Coon & Friends');
            message.member.addRole(cfRole) .then(m => message.reply('You are now a member of Coon & Friends!')).catch(console.error);
        });
        groupCommand(newkids, message, prefix, "removecf", function (args) {
            let cfRole = message.guild.roles.find('name', 'Coon & Friends');
            message.member.removeRole(cfRole) .then(m => message.reply('You are no longer a member of Coon & Friends!')).catch(console.error);
        }); 

        //Drow Elves
        groupCommand(newkids, message, prefix, "addde", function (args) {
            let deRole = message.guild.roles.find('name', 'Drow Elves');
            message.member.addRole(deRole) .then(m => message.reply('You are now a member of the Drow Elves!')).catch(console.error);
        });
        groupCommand(newkids, message, prefix, "removede", function (args) {
            let deRole = message.guild.roles.find('name', 'Drow Elves');
            message.member.removeRole(deRole) .then(m => message.reply('You are no longer a member of the Drow Elves!')).catch(console.error);
        });        

        //Humans
        groupCommand(newkids, message, prefix, "addh", function (args) {
            let hRole = message.guild.roles.find('name', 'Humans');
            message.member.addRole(hRole) .then(m => message.reply('You are now a member of the Humans!')).catch(console.error);
        });
        groupCommand(newkids, message, prefix, "removeh", function (args) {
            let hRole = message.guild.roles.find('name', 'Humans');
            message.member.removeRole(hRole) .then(m => message.reply('You are no longer a member of the Humans!')).catch(console.error);
        });     
//End Group Specific Commands

});