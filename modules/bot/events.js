"use strict"

const discord = require("discord.js");
const moment = require("moment");
const momentTz = require('moment-timezone');

const cmd = require("./cmd");
const embeds = require("./embeds");
const flog = require("../utils/flog");
const fstream = require("../utils/fstream");
const spnav = require("../spwikia/nav");
const config = require("../../config/bot");

const client = new discord.Client();
const token = config.token;
const version = config.version;

client.on('ready', () => {
    client.user.setGame(version + " | -botinfo");

    // replace with flog
    console.log('Shweet! I am alive!');
});

client.on("message", function (message) {
    if (message.author.equals(client.user)) { return; }

    cmd.trigger(message, config.blacklist.words, config.whitelist.words, function() {
        message.delete();
        message.reply(" what WHAT WHAT!!! - Don't be using those words young man");
    });

    cmd.trigger(message, ["shit"], [], function() {

        console.log("shit detected!");
        fstream.readJson(__dirname + "/../../" + "data/storage/shit.json", function(json) {
            var shit = json[message.author.id] == null || json[message.author.id] === undefined ? 0 : json[message.author.id];

            shit += 1;

            json[message.author.id] = shit;

            fstream.writeJson(__dirname + "/../../" + "data/storage/shit.json", json);
        });
    });

    cmd.command(message, config.prefix, "shitme", function() {
        fstream.readJson(__dirname + "/../../" + "data/storage/shit.json", function(json) {
            var shit = json[message.author.id] == null || json[message.author.id] === undefined ? 0 : json[message.author.id];

            message.reply(shit);
        });
    });

    cmd.command(message, config.prefix, "issue", function(args) {
        flog.message(message);
    });

    cmd.command(message, config.prefix, "w", function(args) {
        if (args[1] === undefined) { return; }
        
        var query = args[1];
        
        for (var i = 2; i < args.length; i++) {
            query += (" " + args[i]);
        }

        spnav.getPageInfo(query, function(title, url, desc, thumbnail) {
            if (title == null || url == null || desc == null || thumbnail == null) {
                // do something
                return;
            }
            const descEmbed = new discord.RichEmbed()
            .setColor(0xC0FF33)
            .setAuthor(config.name + " // " + title, "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
            .setURL(url)
            .setThumbnail(thumbnail)
            .setDescription(desc);
            
            message.channel.send(descEmbed);
        });
    });

    cmd.command(message, "", "member", function(args) {
        message.reply(config.membermessage[Math.floor(Math.random() * config.membermessage.length)]);
    });

    cmd.command(message, config.prefix, "avatar", function(args) {
        message.reply(message.author.avatarURL);
    });

    cmd.command(message, config.prefix, "botinfo", function(data) {
        message.channel.sendEmbed(embeds.info);
    });

    cmd.command(message, config.prefix, "help1", function(data) {
        message.channel.sendEmbed(embeds.help1);
    });

    cmd.command(message, config.prefix, "help2", function(data) {
        message.channel.sendEmbed(embeds.help2);
    });

    cmd.command(message, config.prefix, "sub", function(data) {
        message.reply("http://reddit.com/r/southpark");
    });

    cmd.command(message, config.prefix, "subreddit", function(data) {
        message.reply("http://reddit.com/r/southpark");
    });

    cmd.command(message, config.prefix, "micro", function(data) {
        message.delete()
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
        });
    });

    cmd.command(message, config.prefix, "aggression", function (args) {
        message.delete()
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
        });
    });

    cmd.command(message, config.prefix, "microaggression", function (args) {
        message.delete()
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
        });
    });

    cmd.command(message, config.prefix, "reminder", function(data) {
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/378287210711220224/378648515959586816/Towelie_Logo2.png"
        });
    });

    cmd.command(message, config.prefix, "towel", function (args) {
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/378287210711220224/378648515959586816/Towelie_Logo2.png"
        });
    });

    cmd.command(message, config.prefix, "f", function(args) {
        message.reply("Respects have been paid.");
    });

    cmd.command(message, config.prefix, "welcome", function (args) {
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/371762864790306820/378305844959248385/Welcome.png"
        });
    });

    cmd.command(message, config.prefix, "times", function(data) {
        const current_time = moment().format('MMMM Do YYYY, h:mm a');
        const est = momentTz().tz("America/New_York").format('MMMM Do YYYY, h:mm a');
        const pst = momentTz().tz("America/Los_Angeles").format('MMMM Do YYYY, h:mm a');
        const mst = momentTz().tz("America/Boise").format('MMMM Do YYYY, h:mm a');
        const nst = momentTz().tz("America/St_Johns").format('MMMM Do YYYY, h:mm a');
        const cet = momentTz().tz("Europe/Stockholm").format('MMMM Do YYYY, h:mm a');
        const gmt = momentTz().tz("Europe/Dublin").format('MMMM Do YYYY, h:mm a');
        const ist = momentTz().tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm a');
        const ast = momentTz().tz("Asia/Qatar").format('MMMM Do YYYY, h:mm a');
        const timesEmbed = new discord.RichEmbed()
            .setColor(0xc19245)
            .setAuthor(config.name + " // Times", 'https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png')
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

    cmd.groupCommand(config.groups.dev, message, config.prefix, "fuckyourself", function(args) {
        const embed = new discord.RichEmbed()
            .setImage("http://1.images.southparkstudios.com/blogs/southparkstudios.com/files/2014/09/1801_5a.gif");
        message.channel.send(embed);
    });

    cmd.groupCommand(config.groups.dev, message, config.prefix, "fuckyou", function(args) {
        const embed = new discord.RichEmbed()
            .setImage("https://cdn.vox-cdn.com/thumbor/J0D6YqKKwCqNY2zaej_MEUlT-oo=/3x0:1265x710/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/39977666/fuckyou.0.0.jpg");
        message.channel.send(embed);
    });

    cmd.groupCommand(config.groups.dev, message, config.prefix, "dick", function(args) {
        const embed = new discord.RichEmbed()
            .setImage("https://actualconversationswithmyhusband.files.wordpress.com/2017/01/stop-being-a-dick-scott.gif");
        message.channel.send(embed);
    });

    //New Kid Commands
    
    //Freedom Pals
    cmd.groupCommand(config.groups.newkids, message, config.prefix, "addfp", function (args) {
        let fpRole = message.guild.roles.find('name', 'Freedom Pals');
        message.member.addRole(fpRole) .then(m => message.reply('You are now a member of the Freedom Pals!')).catch(console.error);
    });
    cmd.groupCommand(config.groups.newkids, message, config.prefix, "removefp", function (args) {
        let fpRole = message.guild.roles.find('name', 'Freedom Pals');
        message.member.removeRole(fpRole) .then(m => message.reply('You are no longer a member of the Freedom Pals!')).catch(console.error);
    });
    //Coon & Friends
    cmd.groupCommand(config.groups.newkids, message, config.prefix, "addcf", function (args) {
        let cfRole = message.guild.roles.find('name', 'Coon & Friends');
        message.member.addRole(cfRole) .then(m => message.reply('You are now a member of Coon & Friends!')).catch(console.error);
    });
    cmd.groupCommand(config.groups.newkids, message, config.prefix, "removecf", function (args) {
        let cfRole = message.guild.roles.find('name', 'Coon & Friends');
        message.member.removeRole(cfRole) .then(m => message.reply('You are no longer a member of Coon & Friends!')).catch(console.error);
    }); 
    //Drow Elves
    cmd.groupCommand(config.groups.newkids, message, config.prefix, "addde", function (args) {
        let deRole = message.guild.roles.find('name', 'Drow Elves');
        message.member.addRole(deRole) .then(m => message.reply('You are now a member of the Drow Elves!')).catch(console.error);
    });
    cmd.groupCommand(config.groups.newkids, message, config.prefix, "removede", function (args) {
        let deRole = message.guild.roles.find('name', 'Drow Elves');
        message.member.removeRole(deRole) .then(m => message.reply('You are no longer a member of the Drow Elves!')).catch(console.error);
    });        
    //Humans
    cmd.groupCommand(config.groups.newkids, message, config.prefix, "addh", function (args) {
        let hRole = message.guild.roles.find('name', 'Humans');
        message.member.addRole(hRole) .then(m => message.reply('You are now a member of the Humans!')).catch(console.error);
    });
    cmd.groupCommand(config.groups.newkids, message, config.prefix, "removeh", function (args) {
        let hRole = message.guild.roles.find('name', 'Humans');
        message.member.removeRole(hRole) .then(m => message.reply('You are no longer a member of the Humans!')).catch(console.error);
    });
});

function runBot() {
    client.login(token);
}

module.exports = {
    runBot,

};