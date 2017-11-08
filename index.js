//Import the required modules
const Discord = require('discord.js');
const request = require('request');
const async = require('async');
const client = new Discord.Client();
const token = 'token';
const prefix = "!"
//Discord Login Token
client.login(token);

//Terminal Ready Message
client.on('ready', () => {
    console.log('Schweet! I am alive!');

    //Game Name (appears in the sidebar)
    client.user.setGame("Mattheous Alpha");

});
process.on("unhandledRejection", (err) => {
    console.error(`Uncaught Promise Rejection: \n${err.stack}`);
});

//Connection Messages
client.on('disconnect', () => {
    console.log('Disconnected');
})

client.on('error', () => {
    console.log('Error 404 kms');
})

client.on('reconnecting', () => {
    console.log('Reconnecting...');
})

client.on("message", function (message) {
    if (message.author.equals(client.user)) return;
    if (!message.content.startsWith(prefix)) return;
    //instead of setting the prefix each time, do this instead
    var args = message.content.substring(prefix.length).split(" ");
    console.log(args);
    //simple commands
    switch (args[0].toLowerCase()) {
        case "ping": //ping command
            message.reply(args[0]);
            var startTime = Date.now();
            const pingEmbed = new Discord.RichEmbed()
                .setColor(0x85171d)
                .setAuthor("Pong, my man!", 'https://a.thumbs.redditmedia.com/CK3mlJPLodayl_2bTbFkxC8FBuyevfeCTu0b6gK-_x8.png')
                .setDescription("Time taken : ")
            message.channel.sendEmbed(pingEmbed).then((m) => {
                m.delete();
                pingEmbed.setDescription('Time taken : ' + Math.floor(Date.now() - startTime) + ' ms.');
                pingEmbed.addField('Websocket Response Time : ', Math.floor(client.ping) + "ms")
                message.channel.sendEmbed(pingEmbed)
            });
            break;

        case "avatar": //avatar
            message.reply(message.author.avatarURL);
            break;

        case "help":
            message.channel.send(
                new Discord.RichEmbed()
                .setColor(0x85171d)
                .setAuthor("NOMAC // Commands", 'https://a.thumbs.redditmedia.com/CK3mlJPLodayl_2bTbFkxC8FBuyevfeCTu0b6gK-_x8.png')
                .setThumbnail("https://cdn.shopify.com/s/files/1/1061/1924/files/Thinking_Face_Emoji.png")
                .addField("ping", "Pong!")
                .addField("botinfo", "Displays a short description of the bot")
                .addField("lyrics", "Displays lyrics for the song. Usage: -lyrics <song name>")
                .addField("help", "Type this if you want to cause inception")
                .addField("times", "Displays a list of times in different timezones.")
                .addField("europe, americas, oceania, africa or asia", "Choose your region")
                .addField("<instrument>", "Type -instrumentlist list of variables")
                .addField("instrumentlist", "I just explained what this does, Do you listen?")
                .setFooter("Page 1 of 2 :: Use -help2 to view page 2 (Non serious commands)")
            );
    }

    //self-applicable roles
    if (args[0] == 'role') {
        if (args[1] != undefined) {
            let validRoles = ['americas', 'europe', 'asia', 'oceania', 'africa', 'bass', 'guitar', 'keyboard', 'vocals', 'drums', 'piano'];
            let world = (args[1].toLowerCase()).charAt(0).toUpperCase() + args[1].slice(1);
            let roles = {
                'americas': 'I flew around the globe and landed here! :earth_americas:',
                'europe': "You are now a :flag_eu: citizen. Unless you're from :flag_gb: because BREXIT!",
                'asia': "I flew around the globe in search of music and landed here! :earth_asia:",
                'oceania': ':ocean: ia, yay',
                'africa': "I flew around the globe in search of music and landed here! :earth_africa:",
                'guitar': '<:petrucci_scare:293783989288828928> :guitar:',
                'bass': '<:myung_uwotm8:293783987812565003> :guitar:',
                'drums': '<:portnoy_stroke:293786431934038017> :drum:',
                'keyboard': '<:rudess_yeo:293783985689985024> :musical_keyboard:',
                'piano': '<:rudess_yeo:293783985689985024> :musical_keyboard:',
                'vocals': '<:labrie_nightmare:293790537880961024> :microphone:'
            };

            if (!validRoles.includes(args[1].toLowerCase())) {
                message.reply("This role is not self applicable.")
            } else {
                let r_mes = eval(`roles.${args[1].toLowerCase()}`);
                message.member.addRole(message.guild.roles.find('name', world)).then(m => message.reply(r_mes)).catch(console.error);
            }
        } else {
            message.reply("Role help message.")
        }
    }
});