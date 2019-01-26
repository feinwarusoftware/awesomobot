"use strict";

const discord = require("discord.js");

const Command = require("../script");

const love = new Command({

  name: "Chef Quotes",
  description: "An anal probe is when they stick a big metal hoob-a-joo up your butt.",
  help: "**[prefix]love** to let Chef's heavenly voice flow over you!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092317655728128/t12.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "love",

  featured: false,

  preload: true,

  cb: function (client, message) {

    const chefquotes = [

      "I'm very proud of you, children. Let's all go home and find a nice white woman to make love to.",
      "Stan, sometimes God takes those closest to us.",
      "Well, look at it this way: if you want to make a baby cry, first you give it a lollipop.",
      "Look, schools are teaching condom use to younger and younger students each day! But sex isn't something that should be taught in textbooks and diagrams. Sex is emotional and spiritual. It needs to be taught by family. I know it can be hard, parents, but if you leave it up to the schools to teach sex to kids, you don't know who they're learning it from. It could be from someone who doesn't know, someone who has a bad opinion of it, or even a complete pervert.",
      "It's very simple, children; The right time to start having sex is 17.",
      "Yeah, I don't think ol' Mackey knows a hymen from a hysterectomy. And Ms. Choksondik? I'd be surprised she's ever been laid in her life.",
      "Dag-nabbit children! How come every time you come in here you've got to be asking me questions I shouldn't be answering? \"Chef, what's a clitoris? What's a lesbian, Chef? How come they call it a rim job Chef?\". For once, can't you kids come in here and say \"Hey Chef, nice day isn't it\"?",
      "Well look at you cute little crackers with your money and your fancy clothes and your cell phones. It's almost like you were... Oh my God! Children, what have I told you about drugs?",
      "Well whatever you're doing, just remember this: Having money may seem fun but... Oh never mind.",
      "Sometimes you fall in love!\nAnd you think you'll feel that way forever!\nYou change your life and ignore your friends cause you think it can't get any better!\nBut then love goes away, no matter what it doesn't stay as strong!\nAnd then your left with nothin cause your thinking with your dong!\nSo watch out for that lover! It can destroy like a typhoon wind!\nJust play it cool and don't be a fool!",
      "Don't let him bleed on my Meredith Baxter-Birney memorial towel\nI actually was with Meredith Baxter-Birney in this very car. And afterwards we used that towel to Wait a minute! Why am I telling you this?",
      "I hope you're ready for lunch children, because today I've got spooky spaghetti, and freaky french fries...\n...and haunted hash browns, and a creepy cookie...\n...and monstrous milk, and a terrifying napkin!",
      "Look Elton, you are a great singer, but a retarded monkey could write better lyrics.",
      "Well I'll be sodomized on Christmas!",
      "Get them while they're hot. My all new cookies, I Just Went And Fudged Your Momma.",
      "Okay. Everybody get in a line so I can whoop all your asses!",
      "Hello? What? Oh, hello, children! It's a what? A giant snake?! Killing everybody?! Growing bigger?! Children, you know I rarely say this, but, well... fudge ya. ",
      "Children, I heard about what happened at school today! Now none of you tooked that nasty marijuana, did you?",
      "Is she like, uh, Vanessa Williams beautiful or Toni Braxton beautiful? Or Pamela Anderson beautiful? Or is she Erin Grey in the second season of \"Buck Rogers\" beautiful?",
      "I'm gonna make love to ya woman!",
      "Suck on ma chocolate salty balls!",
      "An anal probe is when they stick a big metal hoob-a-joo up your butt.",
      "Sieg Heil!",
      "https://www.youtube.com/watch?v=b3npXX9vQ20"
    ];

    message.channel.send(new discord.RichEmbed().setColor(0xff594f).setAuthor("AWESOM-O // Love!", "https://cdn.discordapp.com/attachments/437671103536824340/462653108636483585/a979694bf250f2293d929278328b707c.png").setThumbnail("https://vignette.wikia.nocookie.net/southpark/images/3/38/JeromeChef.png/revision/latest?cb=20160402120214").setDescription(chefquotes[Math.floor(Math.random() * chefquotes.length)]).setFooter("Hello there, children!"));
  }
});

module.exports = love;