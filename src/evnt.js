"use strict"

const discord = require("discord.js");

const config = require("./config/config-main");
const embeds = require("./embeds");
const cmd = require("./cmd");
const jlite = require("./jlite");
const spnav = require("./spnav");

// Move the timezone stuff to embeds!
const moment = require("moment");
const momentTz = require('moment-timezone');
//

var shits = {
    total: "-1",
    list: [
        {
            id: "-1",
            name: "undef",
            shits: "-1", 
        },
    ],
};

var eplist = {};

function startup() {
    spnav.getEpList(function(episodes) {
        eplist = episodes;

        const json = {
            episodes: episodes,
        }

        jlite.writeJson("./src/data/episodes.json", json, function(err) {
            //temp            
            if (err) {
                console.log("error writing episode json")
                return;
            }
        });
    });

    jlite.readJson("./src/data/shit.json", function(data, err) {
        if (err) {
            console.log("error reading shit json")
            return;
        }

        var total = 0;
        for (var i = 0; i < data.list.length; i++) {
            total += data.list[i].shits;
        }

        data.total = total;

        shits = data;
    });
}

function callcmd(message) {
    // --- Pre-cmd ---

    // --- Args parsed ---
    const args = cmd.parseArgs(message);

    // --- Triggers ---

    // shit
    cmd.trigger(message, ["shit"], ["shitme", "shitlist"], function(times) {
        var sent = false;

        var original = times;
        var index = -1;
        times = times > 3 ? 3 : times;

        var logged = false;
        for (var i = 0; i < shits.list.length; i++) {
            if (shits.list[i].id == message.author.id) {
                logged = true;
                index = i;
                shits.list[i].shits += times;
                break;
            }
        }

        if (!logged) {
            shits.list.append( {
                id: message.author.id,
                name: message.author.username,
                shits: times,
            });
        }

        shits.total += times;

        jlite.writeJson("./src/data/shit.json", shits, function(err) {
            //temp            
            if (err) {
                cmd.flag(args, "-d", function() {
                    const debugEmbed = new discord.RichEmbed()
                        .setColor(0x617)
                        .setAuthor(config.name + " // DEBUG INFO [ shit ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                        .addField("Error", "Could not write to shit.json");
        
                    message.channel.send(debugEmbed);
                    sent = true;
                });

                // fail silently
                console.log("Error writing to shit.json");

                return;
            }
        });

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ shit ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Target", "./src/data/shit.json")
                .addField("Original shits", original)
                .addField("Scaled shits", times)
                .addField("Listed", logged)
                .addField("Shits", shits.list[index].shits)
                .addField("People", shits.list.length)
                .addField("Total", shits.total);

            message.channel.send(debugEmbed);
            sent = true;
        });
    });

    cmd.trigger(message, config.blacklist.words, config.whitelist.words, function() {
        var sent = false;

        message.delete();

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ wordlist ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Message", message.content)

            message.channel.send(debugEmbed);
            sent = true;
        });

        if (!sent) {
            message.reply(" what WHAT WHAT!!! - Don't be using those words young man");
        }

        message.guild.channels.get("380730018718023681").send("[<#" + message.channel.id + ">] <@" + message.author.id + "> --> " + message.content);
    });

    cmd.trigger(message, ["i broke the dam"], [], function() {
        var sent = false;

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ i broke the dam ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Info", "THE DAM IS BROKEN. Stop trying to debug it!");

            message.channel.send(debugEmbed);
            sent = true;
        });

        if (!sent) {
            message.reply(" No, I broke the dam");
        }
    });

    // --- No prefix ---

    // --- Simple ---
    cmd.advCommand(message, args, "member", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ member ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .setDescription("");

            for (var i = 0; i < info.length; i++) {
                debugEmbed.description += info[i] + "\n";
            }

            message.channel.send(debugEmbed);

            return;
        }

        if (flags & cmd.status) {
            const statusEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // STATUS [ member ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.status.member;
            statusEmbed.addField("Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.reply(config.membermessage[Math.floor(Math.random() * config.membermessage.length)]);

            return;
        }
    });

    // --- Prefix check ---
    if (!message.content.startsWith(config.prefix)) { return; }

    // --- Prefix ---

    // --- Simple ---
    cmd.advCommand(message, args, "avatar", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        info.push("Url: " + message.author.avatarURL);

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ avatar ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .setDescription("");

            for (var i = 0; i < info.length; i++) {
                debugEmbed.description += info[i] + "\n";
            }

            message.channel.send(debugEmbed);

            return;
        }

        if (flags & cmd.status) {
            const statusEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // STATUS [ avatar ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.status.avatar;
            statusEmbed.addField("Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.reply(message.author.avatarURL);

            return;
        }
    });

    // -w
    cmd.command(message, args, "w", function() {
        if (args[1] === undefined) {
            return;
        }

        var sent = false;

        var query = "";
        for (var i = 1; i < args.length; i++) {
            if (args[i].startsWith("-")) { continue; }
            query += (args[i] + " ");
        }
        query = query.trim();

        if (query == "") {
            cmd.flag(args, "-d", function() {
                const debugEmbed = new discord.RichEmbed()
                    .setColor(0x617)
                    .setAuthor(config.name + " // DEBUG INFO [ -w ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                    .addField("Errors", "Query was undefined");

                message.channel.send(debugEmbed);
                sent = true;
            });

            return;
        }

        spnav.getPageInfo(query, function(title, url, desc, thumbnail) {
            if (title == null || url == null || desc == null || thumbnail == null) {
                cmd.flag(args, "-d", function() {
                    const debugEmbed = new discord.RichEmbed()
                        .setColor(0x617)
                        .setAuthor(config.name + " // DEBUG INFO [ -w ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                        .addField("Errors", "Either the page was non-standard or got 404")
                        .addField("Query", query);
    
                    message.channel.send(debugEmbed);
                    sent = true;
                });

                if (!sent) {
                    const errorEmbed = new discord.RichEmbed()
                        .setColor(0x617)
                        .setAuthor(config.name + " // ERROR INFO [ -w ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                        .addField("404 not found - blame the wiki", query)
                        .setThumbnail("https://memegenerator.net/img/instances/250x250/68275241/were-sorry-soooo-sorry.jpg");

                    message.channel.send(errorEmbed);

                    sent = true;
                }

                return;
            }

            cmd.flag(args, "-d", function() {
                const debugEmbed = new discord.RichEmbed()
                    .setColor(0x617)
                    .setAuthor(config.name + " // DEBUG INFO [ -w ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                    .addField("Query", query)
                    .addField("Title", title)
                    .addField("Url", url)
                    .addField("Desc", desc)
                    .addField("Thumbnail", thumbnail);

                message.channel.send(debugEmbed);
                sent = true;
            });

            if (!sent) {
                const descEmbed = new discord.RichEmbed()
                .setColor(0xc19245)
                .setAuthor(config.name + " // " + title, "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .setURL(url)
                .setThumbnail(thumbnail)
                .setDescription(desc);

                message.channel.send(descEmbed);
            }
        });
    });


    // -random
    // remove dupe code
    cmd.command(message, args, "random", function() {
        var sent = false;

        const query = eplist[Math.floor(Math.random()*eplist.length)];

        if (query === undefined || query == null) {
            cmd.flag(args, "-d", function() {
                const debugEmbed = new discord.RichEmbed()
                    .setColor(0x617)
                    .setAuthor(config.name + " // DEBUG INFO [ -random ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                    .addField("Errors", "Failed to fetch the episode list")

                message.channel.send(debugEmbed);
                sent = true;
            });

            if (!sent) {
                const errorEmbed = new discord.RichEmbed()
                    .setColor(0x617)
                    .setAuthor(config.name + " // ERROR INFO [ -random ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                    .addField("We're sorry", "Something seems broken. Try running the command again to see what happens. If this continues, report this issue to a mod.")
                    .setThumbnail("https://memegenerator.net/img/instances/250x250/68275241/were-sorry-soooo-sorry.jpg");

                message.channel.send(errorEmbed);

                sent = true;
            }

            return;
        }

        spnav.getPageInfo(query, function(title, url, desc, thumbnail) {
            if (title == null || url == null || desc == null || thumbnail == null) {
                cmd.flag(args, "-d", function() {
                    const debugEmbed = new discord.RichEmbed()
                        .setColor(0x617)
                        .setAuthor(config.name + " // DEBUG INFO [ -random ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                        .addField("Errors", "Either the page was non-standard or got 404")
                        .addField("Query", query);
    
                    message.channel.send(debugEmbed);
                    sent = true;
                });

                if (!sent) {
                    const errorEmbed = new discord.RichEmbed()
                        .setColor(0x617)
                        .setAuthor(config.name + " // ERROR INFO [ -random ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                        .addField("404 not found - blame the wiki", query)
                        .setThumbnail("https://memegenerator.net/img/instances/250x250/68275241/were-sorry-soooo-sorry.jpg");

                    message.channel.send(errorEmbed);

                    sent = true;
                }

                return;
            }

            cmd.flag(args, "-d", function() {
                const debugEmbed = new discord.RichEmbed()
                    .setColor(0x617)
                    .setAuthor(config.name + " // DEBUG INFO [ -random ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                    .addField("Count", eplist.length)
                    .addField("Query", query)
                    .addField("Title", title)
                    .addField("Url", url)
                    .addField("Desc", desc)
                    .addField("Thumbnail", thumbnail);

                message.channel.send(debugEmbed);
                sent = true;
            });
            
            if (!sent) {
                const descEmbed = new discord.RichEmbed()
                .setColor(0xc19245)
                .setAuthor(config.name + " // " + title, "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .setURL(url)
                .setThumbnail(thumbnail)
                .setDescription(desc);

                message.channel.send(descEmbed);
            }
        });
    });

    // -issue
    // -shitme
    cmd.command(message, args, "shitme", function() {
        var sent = false;

        if (shits.total == -1 || shits.total == null || shits.total === undefined) {
            const errorEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // ERROR INFO [ -shitme ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("We're sorry", "This command seems to be broken. We're aware of this and are working on a fix.")
                .setThumbnail("https://memegenerator.net/img/instances/250x250/68275241/were-sorry-soooo-sorry.jpg");

            message.channel.send(errorEmbed);

            sent = true;
        }

        var logged = false;
        var reply = 0;
        for (var i = 0; i < shits.list.length; i++) {
            if (shits.list[i].id == message.author.id) {
                logged = true;
                reply =  shits.list[i].shits;
                break;
            }
        }

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ -shitme ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Listed", logged)
                .addField("Shits", reply);

            message.channel.send(debugEmbed);
            sent = true;
        });

        if (!sent) {
            message.reply("you have said 'shit' " + reply + " times!");
        }
    });

    // -shitlist
    cmd.command(message, args, "shitlist", function() {
        var sent = false;

        if (shits.total == -1 || shits.total == null || shits.total === undefined) {
            const errorEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // ERROR INFO [ -shitlist ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("We're sorry", "This command seems to be broken. We're aware of this and are working on a fix.")
                .setThumbnail("https://memegenerator.net/img/instances/250x250/68275241/were-sorry-soooo-sorry.jpg");

            message.channel.send(errorEmbed);

            sent = true;
        }

        shits.list.sort(function(a, b) {
            return b.shits - a.shits;
        });

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ -shitlist ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("People", shits.list.length)
                .addField("Total", shits.total)
                .addField("#1", shits.list[0].name + ": " + shits.list[0].shits)
                .addField("#2", shits.list[1].name + ": " + shits.list[1].shits)
                .addField("#3", shits.list[2].name + ": " + shits.list[2].shits)
                .addField("#4", shits.list[3].name + ": " + shits.list[3].shits)
                .addField("#5", shits.list[4].name + ": " + shits.list[4].shits);

            message.channel.send(debugEmbed);
            sent = true;
        });

        if (!sent) {
            const embed = new discord.RichEmbed()
                .setColor(0xc19245)
                .setAuthor(config.name + " // " + "It Hits the Fan", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Total", shits.total, true)
                .addField("#1", shits.list[0].name + ": " + shits.list[0].shits, true)
                .addField("#2", shits.list[1].name + ": " + shits.list[1].shits, true)
                .addField("#3", shits.list[2].name + ": " + shits.list[2].shits, true)
                .addField("#4", shits.list[3].name + ": " + shits.list[3].shits, true)
                .addField("#5", shits.list[4].name + ": " + shits.list[4].shits, true);

            message.channel.send(embed);
        }
    });

    cmd.advCommand(message, args, "botinfo", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ botinfo ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .setDescription("");

            for (var i = 0; i < info.length; i++) {
                debugEmbed.description += info[i] + "\n";
            }

            message.channel.send(debugEmbed);

            return;
        }

        if (flags & cmd.status) {
            const statusEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // STATUS [ botinfo ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.status.botinfo;
            statusEmbed.addField("Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.channel.send(embeds.info);

            return;
        }
    });

    /*
    cmd.command(message, args, "avatar", function() {
        var sent = false;

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ -avatar ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Info", "Don't debug this.")

            message.channel.send(debugEmbed);
            sent = true;
        });

        if (!sent) {
            message.reply(message.author.avatarURL);
        }
    });
    */

    cmd.command(message, args, "help1", function() {
        var sent = false;

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ -help1 ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Info", "Don't debug this.")

            message.channel.send(debugEmbed);
            sent = true;
        });

        if (!sent) {
            message.channel.send(embeds.help1);
        }
    });

    cmd.command(message, args, "help2", function() {
        var sent = false;

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ -help2 ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Info", "Don't debug this.")

            message.channel.send(debugEmbed);
            sent = true;
        });

        if (!sent) {
            message.channel.send(embeds.help2);
        }
    });

    cmd.command(message, args, "sub", function() {
        var sent = false;

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ -sub ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Info", "Don't debug this.")

            message.channel.send(debugEmbed);
            sent = true;
        });

        if (!sent) {
            message.reply("http://reddit.com/r/southpark");
        }
    });

    cmd.command(message, args, "subreddit", function() {
        var sent = false;

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ -subreddit ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Info", "Don't debug this.")

            message.channel.send(debugEmbed);
            sent = true;
        });

        if (!sent) {
            message.reply("http://reddit.com/r/southpark");
        }
    });

    cmd.command(message, args, "micro", function() {
        var sent = false;

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ -micro ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Info", "Don't debug this.")

            message.channel.send(debugEmbed);
            sent = true;
        });

        if (!sent) {
            message.delete()
            message.channel.sendMessage("", {
                file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png"
            });
        }
    });

    cmd.command(message, args, "reminder", function() {
        var sent = false;

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ -reminder ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Info", "Don't debug this.")

            message.channel.send(debugEmbed);
            sent = true;
        });

        if (!sent) {
            message.channel.sendMessage("", {
                file: "https://cdn.discordapp.com/attachments/378287210711220224/378648515959586816/Towelie_Logo2.png"
            });
        }
    });

    cmd.command(message, args, "f", function() {
        var sent = false;

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ -f ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Info", "Don't debug this.")

            message.channel.send(debugEmbed);
            sent = true;
        });

        if (!sent) {
            message.reply("Respects have been paid.");
        }
    });

    cmd.command(message, args, "welcome", function() {
        var sent = false;

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ -welcome ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Info", "Don't debug this.")

            message.channel.send(debugEmbed);
            sent = true;
        });

        if (!sent) {
            message.channel.sendMessage("", {
                file: "https://cdn.discordapp.com/attachments/371762864790306820/378305844959248385/Welcome.png"
            });
        }
    });

    cmd.command(message, args, "times", function(data) {
        var sent = false;

        const current_time = moment().format('MMMM Do YYYY, h:mm a');
        const est = momentTz().tz("America/New_York").format('MMMM Do YYYY, h:mm a');
        const pst = momentTz().tz("America/Los_Angeles").format('MMMM Do YYYY, h:mm a');
        const mst = momentTz().tz("America/Boise").format('MMMM Do YYYY, h:mm a');
        const nst = momentTz().tz("America/St_Johns").format('MMMM Do YYYY, h:mm a');
        const cet = momentTz().tz("Europe/Stockholm").format('MMMM Do YYYY, h:mm a');
        const gmt = momentTz().tz("Europe/Dublin").format('MMMM Do YYYY, h:mm a');
        const ist = momentTz().tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm a');
        const ast = momentTz().tz("Asia/Qatar").format('MMMM Do YYYY, h:mm a');

        cmd.flag(args, "-d", function() {
            const debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG INFO [ -times ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Info", "Don't debug this.")

            message.channel.send(debugEmbed);
            sent = true;
        });

        if (!sent) {
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
        message.channel.send(timesEmbed);
        }
    });

    // --- Group ---

    // Mod help
    cmd.groupCommand(message, config.groups.devs, message.member, args, "ground", function() {
        if (args[1] === undefined) { return; }

        const target = message.guild.members.find("nickname", args[1]);
        if (target === undefined) { return; }

        const channels = message.guild.channels.array();
        for (var i = 0; i < channels.length; i++) {
            if (channels[i].name != "rules") {
                channels[i].overwritePermissions(target, { "SEND_MESSAGES": false });
            }
        }

        const embed = new discord.RichEmbed()
            .setTitle(config.name + " // " + target.user.username + ", has been grounded!", 'https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png')
            .setImage("https://pbs.twimg.com/media/DB5_5s8VYAArTTV.jpg");

        message.delete()
        message.channel.send(embed);
    });

    // Mod abuse
    cmd.groupCommand(message, config.groups.devs, message.member, args, "fuckyourself", function() {
        var sent = false;

        if (!sent) {
            const embed = new discord.RichEmbed()
                .setImage("http://1.images.southparkstudios.com/blogs/southparkstudios.com/files/2014/09/1801_5a.gif");
            message.channel.send(embed);
        }
    });

    cmd.groupCommand(message, config.groups.devs, message.member, args, "fuckyou", function() {
        var sent = false;

        if (!sent) {
            const embed = new discord.RichEmbed()
                .setImage("https://cdn.vox-cdn.com/thumbor/J0D6YqKKwCqNY2zaej_MEUlT-oo=/3x0:1265x710/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/39977666/fuckyou.0.0.jpg");
            message.channel.send(embed);
        }
    });

    cmd.groupCommand(message, config.groups.devs, message.member, args, "dick", function() {
        var sent = false;

        if (!sent) {
            const embed = new discord.RichEmbed()
                .setImage("https://actualconversationswithmyhusband.files.wordpress.com/2017/01/stop-being-a-dick-scott.gif");
            message.channel.send(embed);
        }
    });

    // Role switching
    cmd.groupCommand(message, config.groups.newkids, message.member, args, "addfp", function() {
        var sent = false;

        let fpRole = message.guild.roles.find('name', 'Freedom Pals');

        if (!sent) {
            message.member.addRole(fpRole) .then(m => message.reply('You are now a member of the Freedom Pals!')).catch(console.error);
        }
    });

    cmd.groupCommand(message, config.groups.newkids, message.member, args, "removefp", function() {
        var sent = false;

        let fpRole = message.guild.roles.find('name', 'Freedom Pals');

        if (!sent) {
            message.member.removeRole(fpRole) .then(m => message.reply('You are no longer a member of the Freedom Pals!')).catch(console.error);
        }
    });

    cmd.groupCommand(message, config.groups.newkids, message.member, args, "addcf", function() {
        var sent = false;

        let cfRole = message.guild.roles.find('name', 'Coon & Friends');

        if (!sent) {
            message.member.addRole(cfRole) .then(m => message.reply('You are now a member of Coon & Friends!')).catch(console.error);
        }
    });

    cmd.groupCommand(message, config.groups.newkids, message.member, args, "removecf", function() {
        var sent = false;

        let cfRole = message.guild.roles.find('name', 'Coon & Friends');

        if (!sent) {
            message.member.removeRole(cfRole) .then(m => message.reply('You are no longer a member of Coon & Friends!')).catch(console.error);
        }
    }); 

    cmd.groupCommand(message, config.groups.newkids, message.member, args, "addde", function() {
        var sent = false;

        let deRole = message.guild.roles.find('name', 'Drow Elves');

        if (!sent) {
            message.member.addRole(deRole) .then(m => message.reply('You are now a member of the Drow Elves!')).catch(console.error);
        }
    });

    cmd.groupCommand(message, config.groups.newkids, message.member, args, "removede", function() {
        var sent = false;

        let deRole = message.guild.roles.find('name', 'Drow Elves');

        if (!sent) {
            message.member.removeRole(deRole) .then(m => message.reply('You are no longer a member of the Drow Elves!')).catch(console.error);
        }
    }); 

    cmd.groupCommand(message, config.groups.newkids, message.member, args, "addh", function() {
        var sent = false;

        let hRole = message.guild.roles.find('name', 'Humans');

        if (!sent) {
            message.member.addRole(hRole) .then(m => message.reply('You are now a member of the Humans!')).catch(console.error);
        }
    });

    cmd.groupCommand(message, config.groups.newkids, message.member, args, "removeh", function() {
        var sent = false;

        let hRole = message.guild.roles.find('name', 'Humans');

        if (!sent) {
            message.member.removeRole(hRole) .then(m => message.reply('You are no longer a member of the Humans!')).catch(console.error);
        }
    });
}

module.exports = {
    startup,
    callcmd,

};