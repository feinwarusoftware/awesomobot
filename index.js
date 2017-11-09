/*
AWESOME-0 Discord bot made specifically for the /r/SouthPark Discord
Coded with love by Mattheous
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

function test() {
    "use strict";
    let a = 1;
}

const prefix = "-"
//Discord Login Token
client.login('Mzc3OTE2MjY4OTc3ODQ4MzIx.DOT5fg._et-VkFihZh5TG4KtIlFijSIHgY');

//Terminal Ready Message
client.on('ready', () => {
    console.log('Shweet! I am alive!');

    //Game Name (appears in the sidebar)
    client.user.setGame('v0.1 | -botinfo');

});
process.on("unhandledRejection", (err) => {
    console.error(`Uncaught Promise Rejection: \n${err.stack}`);
});


//Connection Messages
client.on('disconnect', () => {
    console.log('Disconnected');
})

client.on('error', () => {
    console.log('Error');
})

client.on('reconnecting', () => {
    console.log('Reconnecting');
})

client.on

client.on("message", function (message) {
    if (message.author.equals(client.user)) return;

    if (!message.content.startsWith(prefix)) return;

    var args = message.content.substring(prefix.length).split(" ");

    //Allow Lower or Upper Case for the roles
    var availableRoles = {
        "europe": "Europe",
        "americas": "Americas",
        "guitar": "Guitar",
        "bass": "Bass",
        "keyboard": "Keyboard",
        "vocals": "Vocals",
        "drums": "Drums",

    };

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
            //Avatar
        case "avatar":
            message.reply(message.author.avatarURL);
            break;

            //COMMANDS

            //New Kid
        case "newkid":
            let europe = message.guild.roles.find('name', 'New Kid');
            message.member.addRole(europe).then(m => message.reply("I think it worked?")).catch(console.error);
            break;

            //stupid instrument that don't actually exist
        case "harmonica":
            message.reply("<:mangini_phonecall:293783988353368064> https://youtu.be/-w-58hQ9dLk?t=10s  <:mangini_phonecall:293783988353368064>");
            break;

            //END OF ROLES
            //OTHER COMMANDS BELOW

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
                .setColor(0x85171d)
                .setAuthor("AWESOME-O // Times", 'https://a.thumbs.redditmedia.com/CK3mlJPLodayl_2bTbFkxC8FBuyevfeCTu0b6gK-_x8.png')
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