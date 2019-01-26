"use strict";

const Command = require("../script");

const discord = require("discord.js");

const artcomp = new Command({

  name: "Art Comp April '18 Entries",
  description: "Entries of the Art Competition from April 2018",
  help: "**[prefix]artcomp** to see out wonderful entries from the first ever Feinwaru Art Competition!",
  thumbnail: "https://cdn.discordapp.com/attachments/394504208222650369/453235231214796800/cartman_and_his_mad_plans.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "artcomp",

  featured: false,

  preload: true,

  cb: function (client, message) {

    const artall = [{
      name: "orang",
      desc: "why the fuck are my arms triangular?",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235029795930126/towel.png"
    },
    {
      name: "Kyle Schwartz",
      desc: "Fucking Chef from South Park",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453234993821515787/Cher.PNG"
    },
    {
      name: "little red riding kahl",
      desc: "creggo my eggo",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453234961961451550/20180430-001.jpg"
    },
    {
      name: "FoxReed",
      desc: "Guitar Queer-O",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235014587383818/kyle_stan_guitar_hero.jpg"
    },
    {
      name: "Jusky",
      desc: "cartman's chest is his stomach",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453234987664146432/big_boy_kyle.PNG"
    },
    {
      name: "pbkid2222",
      desc: "Mysterion",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235020086116363/lol.jpg"
    },
    {
      name: "Phin",
      desc: "Marine Craig dude",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453234970685865984/Almostdone.png"
    },
    {
      name: "Tweek Tweak",
      desc: "Scott Malkinson",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235024880205834/scott.png"
    },
    {
      name: "TowelRoyale",
      desc: "Respect mah Authoritah!",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453234979804020746/Authoritah2.png"
    },
    {
      name: "Stfu",
      desc: "You know I had to do it to 'em",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235035319959553/unknown.png"
    },
    {
      name: "(Mako: Certified Pimp)",
      desc: "Here's my Gerald thing",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235003313094656/funny.png"
    },
    {
      name: "SparkedFires",
      desc: "So sad cause I wanted to make it digital but school is kicking my ASS!!!",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235008736329748/image.jpg"
    },
    {
      name: "Mattheous",
      desc: "Vector Butters!!!",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235040646594561/Vector_Butters.png"
    },
    {
      name: "Fenny",
      desc: "Mosquito VS Coon!",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235046384533522/Week1contest.png"
    },
    {
      name: "officalchespiny",
      desc: "Brimmy",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235101527179274/image_1.jpg"
    },
    {
      name: "Stfu",
      desc: "dogshit",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235163124596756/unknown.png"
    },
    {
      name: "oЯang",
      desc: "david",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235094845390849/daveed.png"
    },
    {
      name: "TowelRoyale",
      desc: "Why so sensitive?",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235154169888778/Reality_2.png"
    },
    {
      name: "little red riding kahl",
      desc: "lola bitch",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235090550685716/bitch.png"
    },
    {
      name: "Nitr0Sag3 (Blind in ways)",
      desc: "Kevin stoley will save mars",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235117532643332/JPEG_20180508_195938.jpg"
    },
    {
      name: "FoxReed",
      desc: "Jesus VS Santa",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235110230360094/jesus_vs_santa.jpg"
    },
    {
      name: "Mattheous",
      desc: "just_ryan.rpy",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235134817107988/just_ryan.rpy.png"
    },
    {
      name: "Kyle Schwartz",
      desc: "Human Kite 2 and Dr. Mephesto",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235159890919442/Stop.png"
    },
    {
      name: "Tweek Tweak",
      desc: "My Big Brother",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235132753510400/kennyandkaren.png"
    },
    {
      name: "duck",
      desc: "kevin the star wars boy",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235137665302558/kevin.png"
    },
    {
      name: "Princess Peach",
      desc: "Just a quick doodle. Not my final submission. It's the ticket dude.",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235107407331328/image.png"
    },
    {
      name: "Phin",
      desc: "I drew Mrs. Tucker because she is very rarely in the show :stuck_out_tongue:",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235151728803850/Ms_tucker.png"
    },
    {
      name: "Gerald",
      desc: "Ain't no rest for the wicked",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235141465341952/money_dont_grow_on_trees.png"
    },
    {
      name: "Princess Peach",
      desc: "REALITY CHECK",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235230065688587/image.jpg"
    },
    {
      name: "Wonder Tweek",
      desc: "South Park: Civil War",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235275280154624/South_Park_Civil_War.png"
    },
    {
      name: "Freeman",
      desc: "simply the best",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235219198377994/alle_4_V1.jpg"
    },
    {
      name: "The cool scout",
      desc: "Why I don't draw",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235208494252072/20180514_173146.jpg"
    },
    {
      name: "duck",
      desc: "cartman being cartman",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235231214796800/cartman_and_his_mad_plans.png"
    },
    {
      name: "pbkid2222",
      desc: "One mysterious boi",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235254925197313/image1.jpg"
    },
    {
      name: "Gerald",
      desc: "Will sing for money",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235330582183957/week3wip.png"
    },
    {
      name: "TowelRoyale",
      desc: "You are tearing me apart, Wendy!",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235284742766602/The_Room.png"
    },
    {
      name: "fighter silvia",
      desc: "he’s the russian tank of a man, the destroyer of druggies, and the bane of capitalism, it’s the one and only",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235252685701131/image.png"
    },
    {
      name: "Nitr0Sag3 (My warcry is shit)",
      desc: "Magic Archer is ready to fight",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235261254664193/IMG_20180516_220955.jpg"
    },
    {
      name: "FoxReed",
      desc: "Movie Mashup",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235289691914240/week_3.jpg"
    },
    {
      name: "little red riding kahl",
      desc: "my south park oc max",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235213003259908/1526511846235.png"
    },
    {
      name: "SnowiiAnge",
      desc: "submitting this for week 3! :^D my OC Joline's fan card for SPPD. version with card and with just the card art",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235281680924673/SPPD_Mystic_card_v2.png"
    },
    {
      name: "Phin",
      desc: "Say it loud and clear for everyone to hear!",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235267814293517/kyle.png"
    },
    {
      name: "SparkedFires",
      desc: "Insomnia Alley",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235273145253888/Mood_Alley.png"
    },
    {
      name: "Stfu",
      desc: "Welcome to South Park!",
      file: "https://cdn.discordapp.com/attachments/394504208222650369/453235259366965248/image2.jpg"
    }
    ];
    let randall = Math.floor(Math.random() * artall.length);
    let randomobject = artall[randall];
    message.channel.send(new discord.RichEmbed()
      .setColor(0xff594f)
      .setAuthor(randomobject.name)
      .setDescription(randomobject.desc)
      .setImage(randomobject.file));
  }
});

module.exports = artcomp;
