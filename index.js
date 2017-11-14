"use strict"

const discord = require("discord.js");
const fs = require("fs");

// Move the timezone stuff to embeds!
const moment = require("moment");
const momentTz = require('moment-timezone');
//

const config = require("./src/config/config-main");
const cmd = require("./src/cmd");
const embeds = require("./src/embeds");
const spnav = require("./src/spnav");

const client = new discord.Client();
client.login(config.token);

client.on("ready", () => {
    spnav.getEpList(function(episodes) {
        const json = {
            episodes: episodes,
        };
        fs.writeFile("./src/data/episodes.json", JSON.stringify(json), function(err) {
            if (err) {
                return;
            }
        });
    });

    client.user.setGame(config.version + " | -botinfo");

    // replace with flog
    console.log('Shweet! I am alive!');
});

client.on("message", function(message) {
    if (message.author.equals(client.user)) { return; }

    // Args parse
    const args = message.content.startsWith(config.prefix)
                    ? message.content.substring(config.prefix.length).toLowerCase().split(" ")
                    : message.content.toLowerCase().split(" ");

    // Triggers
    cmd.advtrigger(message.content, config.blacklist.words, config.whitelist.words, function() {
        message.delete();
        message.reply(" what WHAT WHAT!!! - Don't be using those words young man");
    });

    cmd.advtrigger(message.content, ["shit"], ["shitme", "shitlist"], function(times) {
        fs.readFile("./src/data/shit.json", "utf8", function(err, data) {
            if (err) {
                return;
            }

            var json = JSON.parse(data);

            var logged = false;
            for (var i = 0; i < json.list.length; i++) {
                if (json.list[i].id == message.author.id) {
                    logged = true;
                    json.list[i].shits += times;
                    break;
                }
            }

            if (!logged) {
                json.list[json.list.length + 1] = {
                    id: message.author.id,
                    name: message.author.username,
                    shits: times,
                }
            }

            json.total += times;

            fs.writeFile("./src/data/shit.json", JSON.stringify(json), function(err) {
                if (err) {
                    return;
                }
            });
        });
    });

    // Safe commands
    // Nothing Here

    // Unsafe without prefix
    cmd.unsafe(args, "member", function() {
        message.reply(config.membermessage[Math.floor(Math.random() * config.membermessage.length)]);
    });

    // Prefix check
    if (!message.content.startsWith(config.prefix)) { return; }

    // Unsafe with prefix
    cmd.unsafe(args, "random", function() {
        fs.readFile("./src/data/episodes.json", "utf8", function(err, data) {
            if (err) {
                return;
            }

            const json = JSON.parse(data);
            const item = json.episodes[Math.floor(Math.random()*json.episodes.length)];
            var query = item;
    
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
    });

    cmd.unsafe(args, "w", function() {
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

    cmd.unsafe(args, "shitme", function() {
        fs.readFile("./src/data/shit.json", "utf8", function(err, data) {
            if (err) {
                return;
            }

            var logged = false;
            for (var i = 0; i < json.list.length; i++) {
                if (json.list[i].id == message.author.id) {
                    logged = true;
                    message.reply("you have said 'shit' " + json.list[i].shits + " times!");
                    break;
                }
            }

            if (!logged) {
                message.reply("you have said 'shit' " + 0 + " times!");
            }
        });
    });

    cmd.unsafe(args, "shitlist", function() {
        const dummy = {
            id: 0,
            name: "dummy",
            shits: 0,
        };
        var top = [dummy, dummy, dummy, dummy, dummy];

        fs.readFile("./src/data/shit.json", "utf8", function(err, data) {
            if (err) {
                return;
            }

            for (var i = 0; i < json.list.length; i++) {
                var index = -1;
                for (var j = 0; j < 5; j++) {
                    if (top[j].shits < json.list[i].shits) {
                        if (index != -1) {
                            if (top[index].shits > top[j].shits) {
                                index = j;
                            }

                        } else {
                            index = j;

                        }
                    }
                }

                if (index != -1) {
                    top[index] = json.list[i];
                    index = -1;
                }
            }

            top.sort(function(a, b) {
                return b.shits - a.shits;
            });

            const embed = new discord.RichEmbed()
                .setColor(0xc19245)
                .setAuthor(config.name + " // " + "It Hits the Fan", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Total", shits, true)
                .addField("#1", top[0].name + ": " + top[0].shits, true)
                .addField("#2", top[1].name + ": " + top[1].shits, true)
                .addField("#3", top[2].name + ": " + top[2].shits, true)
                .addField("#4", top[3].name + ": " + top[3].shits, true)
                .addField("#5", top[4].name + ": " + top[4].shits, true);

            message.channel.send(embed);
        });
    });

    cmd.unsafe(args, "avatar", function() {
        message.reply(message.author.avatarURL);
    });

    cmd.unsafe(args, "botinfo", function() {
        message.channel.sendEmbed(embeds.info);
    });

    cmd.unsafe(args, "help1", function() {
        message.channel.sendEmbed(embeds.help1);
    });

    cmd.unsafe(args, "help2", function() {
        message.channel.sendEmbed(embeds.help2);
    });

    cmd.unsafe(args, "sub", function() {
        message.reply("http://reddit.com/r/southpark");
    });

    cmd.unsafe(args, "subreddit", function() {
        message.reply("http://reddit.com/r/southpark");
    });

    cmd.unsafe(args, "micro", function() {
        message.delete()
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
        });
    });

    cmd.unsafe(args, "aggression", function() {
        message.delete()
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
        });
    });

    cmd.unsafe(args, "microaggression", function() {
        message.delete()
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
        });
    });

    cmd.unsafe(args, "reminder", function() {
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/378287210711220224/378648515959586816/Towelie_Logo2.png"
        });
    });

    cmd.unsafe(args, "towel", function () {
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/378287210711220224/378648515959586816/Towelie_Logo2.png"
        });
    });

    cmd.unsafe(args, "f", function() {
        message.reply("Respects have been paid.");
    });

    cmd.unsafe(args, "welcome", function() {
        message.channel.sendMessage("", {
            file: "https://cdn.discordapp.com/attachments/371762864790306820/378305844959248385/Welcome.png"
        });
    });

    cmd.unsafe(args, "times", function(data) {
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

    // Unsafe groups
    // Mod abuse
    cmd.gunsafe(config.groups.devs, message.member, args, "fuckyourself", function() {
        const embed = new discord.RichEmbed()
            .setImage("http://1.images.southparkstudios.com/blogs/southparkstudios.com/files/2014/09/1801_5a.gif");
        message.channel.send(embed);
    });

    cmd.gunsafe(config.groups.devs, message.member, args, "fuckyou", function() {
        const embed = new discord.RichEmbed()
            .setImage("https://cdn.vox-cdn.com/thumbor/J0D6YqKKwCqNY2zaej_MEUlT-oo=/3x0:1265x710/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/39977666/fuckyou.0.0.jpg");
        message.channel.send(embed);
    });

    cmd.gunsafe(config.groups.devs, message.member, args, "dick", function() {
        const embed = new discord.RichEmbed()
            .setImage("https://actualconversationswithmyhusband.files.wordpress.com/2017/01/stop-being-a-dick-scott.gif");
        message.channel.send(embed);
    });

    // Role switching
    cmd.gunsafe(config.groups.newkids, message.member, args, "addfp", function() {
        let fpRole = message.guild.roles.find('name', 'Freedom Pals');
        message.member.addRole(fpRole) .then(m => message.reply('You are now a member of the Freedom Pals!')).catch(console.error);
    });

    cmd.gunsafe(config.groups.newkids, message.member, args, "removefp", function() {
        let fpRole = message.guild.roles.find('name', 'Freedom Pals');
        message.member.removeRole(fpRole) .then(m => message.reply('You are no longer a member of the Freedom Pals!')).catch(console.error);
    });

    cmd.gunsafe(config.groups.newkids, message.member, args, "addcf", function() {
        let cfRole = message.guild.roles.find('name', 'Coon & Friends');
        message.member.addRole(cfRole) .then(m => message.reply('You are now a member of Coon & Friends!')).catch(console.error);
    });

    cmd.gunsafe(config.groups.newkids, message.member, args, "removecf", function() {
        let cfRole = message.guild.roles.find('name', 'Coon & Friends');
        message.member.removeRole(cfRole) .then(m => message.reply('You are no longer a member of Coon & Friends!')).catch(console.error);
    }); 

    cmd.gunsafe(config.groups.newkids, message.member, args, "addde", function() {
        let deRole = message.guild.roles.find('name', 'Drow Elves');
        message.member.addRole(deRole) .then(m => message.reply('You are now a member of the Drow Elves!')).catch(console.error);
    });

    cmd.gunsafe(config.groups.newkids, message.member, args, "removede", function() {
        let deRole = message.guild.roles.find('name', 'Drow Elves');
        message.member.removeRole(deRole) .then(m => message.reply('You are no longer a member of the Drow Elves!')).catch(console.error);
    }); 

    cmd.gunsafe(config.groups.newkids, message.member, args, "addh", function() {
        let hRole = message.guild.roles.find('name', 'Humans');
        message.member.addRole(hRole) .then(m => message.reply('You are now a member of the Humans!')).catch(console.error);
    });

    cmd.gunsafe(config.groups.newkids, message.member, args, "removeh", function() {
        let hRole = message.guild.roles.find('name', 'Humans');
        message.member.removeRole(hRole) .then(m => message.reply('You are no longer a member of the Humans!')).catch(console.error);
    });
});