"use strict";

const discord = require("discord.js");
const { matchScript } = require("../../utils");
const Command = require("../script");
const schemas = require("../../db");

// Assumes that there is a limit on the length of the description, if (that_assumption === broken()) {
// that could cause the page not to be sent or error out and node has a spasm. }
const help = new Command({

  name: "AWESOM-O Help",
  description: "Lists all the commands enabled on the current server",
  help: "Type **[prefix]help help**",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509384571842723849/Untitled-1.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "help",

  featured: false,

  preload: true,

  cb: function(client, message, guildDoc) {

    schemas.ScriptSchema
      .find({
        _id: { $in: guildDoc.scripts.map(e => e.object_id) },
        local: true
      })
      .then(scripts => {

        if (scripts.length === 0) {

          return message.channel.send("no scripts enabled in this server :(");
        }

        const args = message.content.split(" ");

        let page = 1;
        let total =  Math.ceil(scripts.length / 6);

        String.prototype.replaceAll = function(search, replacement) {
          const target = this;
          return target.split(search).join(replacement);
        };

        //Check if a page number is specified
        if (args[1] !== undefined && isNaN(args[1]) === false){
          page = parseInt(args[1]);
        }
        //Check if a term is specified
        else if (args[1] !== undefined && isNaN(args[1]) === true){
          for (let script of scripts) {
            const { matched, err } = matchScript(null,
              script.match_type === "command" ? script.match === "help" ? "startswith" : "exactmatch" : script.match_type,
              script.match,
              args.slice(1).reduce((a, e) => a += " " + e, "").trim());

            if (err != null) {
              return message.reply(`error fetching help, this is probably a bug and should be reported to the devs: ${err}`);
            }

            if (matched !== false) {
              const embed = new discord.RichEmbed();
              embed.setAuthor(`AWESOM-O // ${script.name} Help`, "https://cdn.discordapp.com/attachments/437671103536824340/462653108636483585/a979694bf250f2293d929278328b707c.png");
              script.match === "help" ? embed.setFooter("doin' you mum") : embed.setFooter("Wow! These Feinwaru kidz are very helpful!");
              script.match === "help" ? embed.setDescription(script.help.replaceAll("[prefix]", guildDoc.prefix) + " **" + args.slice(1).reduce((a, e) => a += " " + e, "").trim() + "** for more info.") : embed.setDescription(script.help.replaceAll("[prefix]", guildDoc.prefix));
              embed.setThumbnail(script.thumbnail);

              return message.channel.send(embed);
            }
          }
        }

        if (page === 0){
          return message.reply("I see you think arrays start from 0! Haha, good one");
        } else if (page < 0){
          return message.reply("Nice try!");
        } else if (page > total){
          return message.reply("No scripts found on this page!");
        }

        let first = page * 6 - 6;

        let last = 6 * page;

        const embed = new discord.RichEmbed();
        embed.setAuthor("AWESOM-O // Help", "https://cdn.discordapp.com/attachments/437671103536824340/462653108636483585/a979694bf250f2293d929278328b707c.png");
        embed.setFooter(`Page ${page}/${total}. ${page === total ? "This is the last page" : "Type `" + guildDoc.prefix + "help " + (page + 1) + "` for the next page"}`);

        scripts = [ ...scripts ].sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);

        for (let [i, script] of scripts.slice(first,last).entries()) {

          embed.addField(script.name, `${script.description}\n${"`"}${script.match_type === "command" ? guildDoc.prefix : ""}${script.match}${"`"}\n`, false);
          //embed.description += `${i + 1}. **${script.name}**: ${script.description}\n[${"`"}${script.match_type === "command" ? guildDoc.prefix : ""}${script.match}${"`"}]\n`;
        }
        message.channel.send(embed);
      })
      .catch(error => {

        message.channel.send(`error fetching scripts: ${error}`);
      });
  }
});

module.exports = help;
