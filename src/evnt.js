"use strict"

const discord = require("discord.js");
const timers = require("timers");

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
    total: -1,
    list: [
        {
            id: "-1",
            name: "undef",
            shits: "-1", 
            activity: 0,
            lastmsg: 0,
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

        jlite.writeJson(config.eplistpath, json, function(err) {
            //temp            
            if (err) {
                console.log("error writing episode json")
                return;
            }
        });
    });

    jlite.readJson(config.datapath, function(data, err) {
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

    const minutes = 5;
    const interval = minutes * 60 * 1000;
    timers.setInterval(function() {
        for (var i = 0; i < shits.list.length; i++) {

            // error catching
            if (shits.list[0].id == -1 || shits === undefined || shits == null) { break; }

            // conversion errors
            if (shits.list[i].activity === undefined) {
                shits.list[i].activity = 0;
            }
            if (shits.list[i].lastmsg === undefined) {
                shits.list[i].lastmsg = 0;
            }

            // last message time
            shits.list[i].lastmsg += 1;

            // degenerate
            if (shits.list[i].activity > 5000) {
                shits.list[i].activity = 5000;

            } else if (shits.list[i].activity > 0) {
                if (shits.list[i].lastmsg >= 576) {
                    shits.list[i].activity -= (Math.log10(shits.list[i].lastmsg) * 200) / 288;

                }

            }

            if (shits.list[i].activity < 0) {
                shits.list[i].activity = 0;
                
            }
        }

        jlite.writeJson(config.datapath, shits, function(err) {
            if (err) {
                console.log("Cannot write to shit.json");
            }
        });
    }, interval);
}

function messageDeleted(message) {
    try {
        message.guild.channels.get("380730018718023681").send("[<#" + message.channel.id + ">] <@" + message.author.id + "> (deleted) --> " + message.content);

    } catch (e) {

        console.log("Error logging message deletion");
    }
}

function callcmd(message) {
    // --- Pre-cmd ---

    var updated = false;
    const activity = message.content.length > 20 ? (message.content.length > 100 ? 20 : 15) : 5;
    for (var i = 0; i < shits.list.length; i++) {
        if (shits.list[i].id == message.author.id) {
            if (shits.list[i].activity === undefined) {
                shits.list[i].activity = 0;
            }
            if (shits.list[i].lastmsg === undefined) {
                shits.list[i].lastmsg = 0;
            }

            shits.list[i].activity += activity;
            shits.list[i].lastmsg = 0;
            updated = true;
        }
    }
    if (!updated) {
        shits.list.push({
            id: message.author.id,
            name: message.author.username,
            shits: 0,
            activity: activity,
            lastmsg: 0,
        });
    }

    // --- Args parsed ---
    const args = cmd.parseArgs(message);

    // --- Triggers ---

    // *** BUG? - when shit changed and json written at the same time ***
    cmd.advTrigger(message, args, ["shit"], ["shitme", "shitlist"], function(flags, info, times) {
        if (flags & cmd.failure) {
            return;
        }

        if (shits.list[0].id == -1 || shits === undefined || shits == null) {
            info.push("shit.json was in an incorrect state, will not write any values");

            flags &= ~cmd.success;
        }

        if (flags & cmd.success) {
            const scaledShits = times > 3 ? 3 : times;
            
            var updated = false;
            for (var i = 0; i < shits.list.length; i++) {
                if (shits.list[i].id == message.author.id) {
                    shits.list[i].shits += scaledShits;
                    updated = true;
    
                    info.push("Updated shit value of user");
                }
            }
    
            if (!updated) {
                shits.list.push({
                    id: message.author.id,
                    name: message.author.username,
                    shits: scaledShits,
                });
    
                info.push("Added new user");
            }
    
            shits.total += scaledShits;
            info.push("Updated total shits");
        }

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ shit ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                .setAuthor(config.name + " // STATUS [ shit ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.devstatus.shit;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }
    });

    cmd.advTrigger(message, args, config.blacklist.words, config.whitelist.words, function(flags, info, times) {
        if (flags & cmd.failure) {
            return;
        }

        message.delete();

        try {
            message.guild.channels.get("380730018718023681").send("[<#" + message.channel.id + ">] <@" + message.author.id + "> --> " + message.content);
            info.push("Logged profanity to logs channel");

        } catch (e) {

            console.log("Error logging profanity");
            info.push("Error logging profanity");

            flags &= ~cmd.success;
        }

        info.push("Response: %text% what WHAT WHAT!!! - Don't be using those words young man");

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ profanity filter ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                .setAuthor(config.name + " // STATUS [ profanity filter ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.devstatus.profanityfilter;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.reply(" what WHAT WHAT!!! - Don't be using those words young man");

            return;
        }
    });

    cmd.advTrigger(message, args, ["i broke the dam"], [], function(flags, info, times) {
        if (flags & cmd.failure) {
            return;
        }
        
        info.push("Response: %text% No, I broke the dam");

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ i broke the dam ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                .setAuthor(config.name + " // STATUS [ i broke the dam ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.devstatus.ibrokethedam;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.reply(" No, I broke the dam");

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("i broke the dam"));
            
            return;
        }
    });

    // --- No prefix ---

    // --- Simple ---
    cmd.advCommand(message, args, "member", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        info.push("Response: %rand% " + config.membermessage);

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

            var status = config.devstatus.member;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.reply(config.membermessage[Math.floor(Math.random() * config.membermessage.length)]);

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("member"));
            
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

        info.push("Response: %url% " + message.author.avatarURL);

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

            var status = config.devstatus.avatar;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.reply(message.author.avatarURL);

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("avatar"));
            
            return;
        }
    });

    cmd.advCommand(message, args, "w", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        if (args[1] === undefined || args[1].startsWith("-")) {
            info.push("Either query not specified or started with flag call ('-')");

            flags &= ~cmd.success;
        }

        var query = "";
        if (flags & cmd.success) {

            for (var i = 1; i < args.length; i++) {
                if (args[i].startsWith("-")) { continue; }
                query += (args[i] + " ");
            }
            query = query.trim();

        } else {
            query = "404";

        }

        info.push("Query: " + query);

        spnav.getPageInfo(query, function(title, url, desc, thumbnail) {
            if (title == null || url == null || desc == null || thumbnail == null) {
                info.push("Search failed, no results returned");

                flags &= ~cmd.success;
            }

            info.push("Response: %embed% ()");

            if (flags & cmd.debug) {
                var debugEmbed = new discord.RichEmbed()
                    .setColor(0x617)
                    .setAuthor(config.name + " // DEBUG [ w ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                    .setAuthor(config.name + " // STATUS [ w ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");
    
                var status = config.devstatus.w;
                statusEmbed.addField("Dev Status", status);
    
                var tests = "untested";
                statusEmbed.addField("Tests", tests);
    
                message.channel.send(statusEmbed);
    
                return;
            }
    
            if (flags & cmd.success) {
                const descEmbed = new discord.RichEmbed()
                    .setColor(0xc19245)
                    .setAuthor(config.name + " // " + title, "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                    .setURL(url)
                    .setThumbnail(thumbnail)
                    .setDescription(desc);

                message.channel.send(descEmbed);
    
                return;
            }

            if (!flags & cmd.success) {
                message.channel.send(embeds.weresorry("w"));
                
                return;
            }
        });
    });

    cmd.advCommand(message, args, "random", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        const query = eplist[Math.floor(Math.random()*eplist.length)];

        if (query === undefined || query == null) {
            info.push("Query was undefined or null");
            query = "404";

            flags &= ~cmd.success;
        }

        info.push("Query: " + query);

        spnav.getPageInfo(query, function(title, url, desc, thumbnail) {
            if (title == null || url == null || desc == null || thumbnail == null) {
                info.push("Search failed, no results returned");

                flags &= ~cmd.success;
            }

            info.push("Response: %embed% ()");

            if (flags & cmd.debug) {
                var debugEmbed = new discord.RichEmbed()
                    .setColor(0x617)
                    .setAuthor(config.name + " // DEBUG [ random ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                    .setAuthor(config.name + " // STATUS [ random ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");
    
                var status = config.devstatus.random;
                statusEmbed.addField("Dev Status", status);
    
                var tests = "untested";
                statusEmbed.addField("Tests", tests);
    
                message.channel.send(statusEmbed);
    
                return;
            }
    
            if (flags & cmd.success) {
                const descEmbed = new discord.RichEmbed()
                    .setColor(0xc19245)
                    .setAuthor(config.name + " // " + title, "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                    .setURL(url)
                    .setThumbnail(thumbnail)
                    .setDescription(desc);

                message.channel.send(descEmbed);
    
                return;
            }

            if (!flags & cmd.success) {
                message.channel.send(embeds.weresorry("random"));
                
                return;
            }
        });
    });

    cmd.advCommand(message, args, "shitme", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        if (shits.list[0].id == -1 || shits === undefined || shits == null) {
            info.push("shit.json was in an incorrect state, will not read any values");

            flags &= ~cmd.success;
        }

        if (flags & cmd.success) {
            var found = false;
            var response = 0;
            for (var i = 0; i < shits.list.length; i++) {
                if (shits.list[i].id == message.author.id) {
                    response = shits.list[i].shits;
                    found = true;
    
                    info.push("Found shit value of user");
                }
            }
    
            if (!found) {
                info.push("Could not find shit value of user, assuming 0");
            }

            info.push("Response: %text% you have said 'shit' " + response + " times!");
        }

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ shitme ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                .setAuthor(config.name + " // STATUS [ shitme ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.devstatus.shitme;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.reply("you have said 'shit' " + response + " times!");

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("shitme"));
            
            return;
        }
    });

    cmd.advCommand(message, args, "shitlist", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        if (shits.list[0].id == -1 || shits === undefined || shits == null) {
            info.push("shit.json was in an incorrect state, will not read any values");

            flags &= ~cmd.success;
        }

        if (flags & cmd.success) {
            shits.list.sort(function(a, b) {
                return b.shits - a.shits;
            });

            info.push("Response: %embed% ()");
        }

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ shitlist ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                .setAuthor(config.name + " // STATUS [ shitlist ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.devstatus.shitlist;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            const embed = new discord.RichEmbed()
                .setColor(0xc19245)
                .setAuthor(config.name + " // " + "It Hits the Fan", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
                .addField("Total", shits.total, true);

            for (var i = 0; i < (shits.list.length < 5 ? shits.list.length : 5); i++) {
                embed.addField("#" + (i + 1), shits.list[i].name + ": " + shits.list[i].shits, true);
            }

            message.channel.send(embed);

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("shitlist"));
            
            return;
        }
    });

    cmd.advCommand(message, args, "issue", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        try {
            message.guild.channels.get("380730018718023681").send("[<#" + message.channel.id + ">] <@" + message.author.id + "> --> " + message.content);
            info.push("Logged issue to logs channel");

            info.push("Response: %text% your issue has been logged, thanks for the feedback");

        } catch (e) {

            console.log("Error logging isusue");
            info.push("Error logging issue");

            flags &= ~cmd.success;
        }

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ issue ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                .setAuthor(config.name + " // STATUS [ issue ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.devstatus.issue;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.reply(" your issue has been logged, thanks for the feedback");

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("issue"));
            
            return;
        }
    });

    cmd.advCommand(message, args, "botinfo", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        info.push("Response: %embed% ()");

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

            var status = config.devstatus.botinfo;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.channel.send(embeds.info);

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("botinfo"));
            
            return;
        }
    });

    cmd.advCommand(message, args, "help1", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        info.push("Response: %embed% ()");

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ help1 ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                .setAuthor(config.name + " // STATUS [ help1 ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.devstatus.help1;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.channel.send(embeds.help1);

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("help1"));
            
            return;
        }
    });

    cmd.advCommand(message, args, "help2", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        info.push("Response: %embed% ()");

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ help2 ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                .setAuthor(config.name + " // STATUS [ help2 ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.devstatus.help1;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.channel.send(embeds.help2);

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("help2"));
            
            return;
        }
    });

    cmd.advCommand(message, args, "sub", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        info.push("Response: %url% http://reddit.com/r/southpark");

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ sub ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                .setAuthor(config.name + " // STATUS [ sub ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.devstatus.sub;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.reply("http://reddit.com/r/southpark");

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("sub"));
            
            return;
        }
    });

    cmd.advCommand(message, args, "micro", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        info.push("Response: %url% https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png");

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ micro ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                .setAuthor(config.name + " // STATUS [ micro ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.devstatus.micro;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.delete()
            message.channel.send("", { file: "https://cdn.discordapp.com/attachments/371762864790306820/378652716483870720/More_compressed_than_my_height.png" });

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("micro"));
            
            return;
        }
    });

    cmd.advCommand(message, args, "reminder", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        info.push("Response: %url% https://cdn.discordapp.com/attachments/378287210711220224/378648515959586816/Towelie_Logo2.png");

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ reminder ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                .setAuthor(config.name + " // STATUS [ reminder ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.devstatus.reminder;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.channel.send("", { file: "https://cdn.discordapp.com/attachments/378287210711220224/378648515959586816/Towelie_Logo2.png" });

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("reminder"));
            
            return;
        }
    });

    cmd.advCommand(message, args, "f", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        info.push("Response: %text% Respects have been paid.");

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ f ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                .setAuthor(config.name + " // STATUS [ f ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.devstatus.f;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.reply("Respects have been paid.");

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("f"));
            
            return;
        }
    });

    cmd.advCommand(message, args, "welcome", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        info.push("Response: %url% https://cdn.discordapp.com/attachments/371762864790306820/378305844959248385/Welcome.png");

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ welcome ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                .setAuthor(config.name + " // STATUS [ welcome ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.devstatus.welcome;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
            message.channel.send("", { file: "https://cdn.discordapp.com/attachments/371762864790306820/378305844959248385/Welcome.png" });

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("welcome"));
            
            return;
        }
    });

    cmd.advCommand(message, args, "times", function(flags, info) {
        if (flags & cmd.failure) {
            return;
        }

        info.push("Response: %embed% ()");

        if (flags & cmd.debug) {
            var debugEmbed = new discord.RichEmbed()
                .setColor(0x617)
                .setAuthor(config.name + " // DEBUG [ times ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
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
                .setAuthor(config.name + " // STATUS [ times ]", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            var status = config.devstatus.times;
            statusEmbed.addField("Dev Status", status);

            var tests = "untested";
            statusEmbed.addField("Tests", tests);

            message.channel.send(statusEmbed);

            return;
        }

        if (flags & cmd.success) {
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

            message.channel.send(timesEmbed);

            return;
        }

        if (!flags & cmd.success) {
            message.channel.send(embeds.weresorry("times"));
            
            return;
        }
    });

    // --- Group ---

    // Mod help
    cmd.groupCommand(message, config.groups.devs, message.member, args, "ground", function() {
        if (args[1] === undefined) { return; }

        var target = message.guild.members.find("username", args[1]);
        if (target === undefined) { return; }

        target = message.guild.members.find("nickname", args[1]);
        if (target === undefined) { return; }

        const grounded = message.guild.roles.find("name", "grounded");
        if (grounded === undefined) { return; }

        const embed = new discord.RichEmbed()
        .setTitle(config.name + " // " + target.user.username + ", has been grounded!", 'https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png')
        .setImage("https://pbs.twimg.com/media/DB5_5s8VYAArTTV.jpg");

        target.addRole(grounded);
        message.channel.send(embed);
    });

    cmd.groupCommand(message, config.groups.devs, message.member, args, "unground", function() {
        if (args[1] === undefined) { return; }

        var target = message.guild.members.find("username", args[1]);
        if (target === undefined) { return; }

        target = message.guild.members.find("nickname", args[1]);
        if (target === undefined) { return; }

        var grounded;
        const roles = target.roles.array();
        for (var i = 0; i < roles.length; i++) {
            if (roles[i].name == "grounded") {
                grounded = roles[i];
            }
        }

        if (grounded === undefined) { return; }

        target.removeRole(grounded);
        message.reply(" you have ungrounded " + target.user.username);
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
            message.member.addRole(fpRole).then(m => message.reply('You are now a member of the Freedom Pals!')).catch(console.error);
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

    cmd.groupCommand(message, config.groups.devs, message.member, args, "activity", function() {
        if (args[1] === undefined) { return; }

        var target = message.guild.members.find("id", args[1]);
        if (target === undefined || target === null) { return; }
        
        var updated = false;
        for (var i = 0; i < shits.list.length; i++) {
            if (shits.list[i].id == target.id) {
                if (shits.list[i].activity === undefined) {
                    message.reply(0);
                    return;
                }
    
                updated = true;
                message.reply(shits.list[i].activity);
                return;
            }
        }
        if (!updated) {
            message.reply(0);

        }
    });

    cmd.groupCommand(message, config.groups.devs, message.member, args, "activelist", function() {
        if (shits.list[0].id == -1 || shits === undefined || shits == null) {
            return;
        }

        const len = args[1] === undefined ? 5 : args[1];
        if (typeof len != "number") {
            return;;
        }

        shits.list.sort(function(a, b) {
            return b.activity - a.activity;
        });

        const embed = new discord.RichEmbed()
            .setColor(0xc19245)
            .setAuthor(config.name + " // " + "Activity", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png");

            //embed.addField("#" + (i + 1), shits.list[i].name + ": " + shits.list[i].shits, true);
        for (var i = 0; i < (shits.list.length < len ? shits.list.length : len); i++) {
            embed.addField("#" + (i + 1), shits.list[i].name + ": " + (shits.list[i].activity === undefined ? 0 : shits.list[i].activity), true);
        }

        message.channel.send(embed);
    });

    // --- Post command ---
}

module.exports = {
    startup,
    messageDeleted,
    callcmd,

};