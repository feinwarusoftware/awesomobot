"use strict"

const discord = require("discord.js");

const Command = require("../command");

const butters = new Command("butters", "random photo of butters", "js", 0, "butters", "command", 0, false, null, function(client, message, guildDoc) {
    
   const buttersimg = [
                "https://cdn.discordapp.com/attachments/394504208222650369/447785248931971082/Butters17.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785256129527809/Butters3.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785260034555915/Butters5.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785265121984534/Butters8.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785273179504640/Butters9.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785279529680910/Butters10.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785288178335764/Butters12.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785295220441128/Butters13.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785304359960576/Butters14.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785316481499136/Butters15.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785340237774848/Butters30.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785353148104705/Butters18_.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785365017985024/Butters19.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785370374111243/Butters20.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785380041850880/Butters22.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785388103303188/Butters24.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785397091827724/Butters26.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785406474354699/Butters27.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785413533499392/Butters28.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785421838221322/Butters29.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785438271242240/Butters55.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785447020691456/Butters31.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785455161704448/Butters32.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785462606725131/Butters34.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785471439929346/Butters35.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785483557404673/Butters40.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785487650783237/Butters44.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785497117458459/Butters48.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785504331530242/Butters51.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785510325190677/Butters54.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785525802303503/Butters75.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785532165193738/Butters66.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785540696408074/Butters67.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785546761240577/Butters68.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785552977068032/Butters69.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785559658856479/Butters70.gif",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785566667407380/Butters71.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785574196051968/Butters72.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785586003017728/Butters73.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785587508903976/Butters74.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785602973433857/Butters81.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785614373552181/Butters77.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785615115812874/Butters76.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785621675573258/Butters78.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785633826734081/Butters80.png",
                "https://cdn.discordapp.com/attachments/394504208222650369/447785636376870943/Butters79.png"
            ];

            message.channel.send(new discord.RichEmbed().setColor(0xff594f).setImage(buttersimg[Math.floor(Math.random() * buttersimg.length)]));
        
});

//module.exports = butters;