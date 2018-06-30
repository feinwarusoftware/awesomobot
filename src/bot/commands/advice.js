"use strict"

const Command = require("../command");

const advice = new Command("advice", "Awesom-e advice!", "js", 0, "advice", "command", 0, false, null, function(client, message, guildDoc) {
 
    let advice = [
                "Stop being so lame. It's not kewl.",
                "Kill all jews... and gingers...",
                "Respect Eric Cartman. He is totally cool and not at all lame.",
                "Kid picking on you? Turn their parents into chili and feed it to them.",
                "Not invited to a party? Trick the most gullible kid.",
                "Need a superhero? Call on the Coon! He is the saviour this town needs!",
                "Have no idea what to do? Think: What would Brian Boitano do?"
            ];
            let advicerandom = advice[Math.floor(Math.random() * advice.length)];
            message.reply("**Here's some advice:** " + advicerandom);

});

module.exports = advice;