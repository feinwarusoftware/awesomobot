const path = require("path");
const mongoose = require("mongoose");
const discord = require("discord.js");

const config = require("../../config.json");

const {
  log: {
    info,
    warn,
    error
  },
  Sandbox,
  loadGuild,
  loadGuilds,
  loadLocalScripts,
  loadGuildScripts,
  loadUser,
  matchScript,
  evalPerms
} = require("../utils");

process.on("uncaughtException", (exception) => {
  console.error(exception); // to see your exception details in the console
  // if you are on production, maybe you can send the exception details to your
  // email as well ?
});

//
mongoose.connect(`mongodb://${config.mongo_user === null && config.mongo_pass === null ? "" : `${config.mongo_user}:${config.mongo_pass}@`}localhost/rawrxd?authSource=admin`, {
  useNewUrlParser: true,
  ...config.mongo_user === null && config.mongo_pass === null ? {} : {
    auth: {
      authdb: "admin"
    }
  }
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", (err) => {
  error(`error connecting to mongo: ${err}`);
});
db.on("open", () => {
  info("connected to mongo");
});
//

//
const sandbox = new Sandbox();

const baseScriptSandbox = {

  RichEmbed: discord.RichEmbed,
  utils: {
    RichEmbed: discord.RichEmbed
  }
};
//

//
let scripts;
//

//
const client = new discord.Client();
client.login(config.discord_token).then(() => {
  info("logged into discord");
}).catch((err) => {
  error(`error logging into discord: ${err}`);
  return process.exit(-1);
});

client.on("error", (err) => {
  error(err);
});

client.on("ready", async () => {
  try {
    scripts = await loadLocalScripts(path.join(__dirname, "scripts"));
  } catch (err) {
    error(`error loading local scripts: ${err}`);
    return process.exit(-1);
  }

  try {
    await loadGuilds(client.guilds.map(e => e.id));
  } catch (err) {
    error(`error loading guilds: ${err}`);
    return process.exit(-1);
  }

  try {
    client.user.setActivity(`AWESOM-O ${config.version}`);
  } catch (err) {
    error(`error setting playing status: ${err}`);
    return process.exit(-1);
  }

  info("bot ready");
});

client.on("guildCreate", async (guild) => {
  try {
    await loadGuild(guild.id);
  } catch (err) {
    return error(`error loading guild: ${guild.name}, ${guild.id}: ${err}`);
  }

  info(`loaded new guild: ${guild.name}, ${guild.id}`);
});

// redlynx server
const rlBlacklist = [
  "2g1c",
  "2 girls 1 cup",
  "acrotomophilia",
  "alabama hot pocket",
  "alaskan pipeline",
  "anal",
  "anilingus",
  "anus",
  "apeshit",
  "arsehole",
  "ass",
  "assmunch",
  "auto erotic",
  "autoerotic",
  "babeland",
  "baby batter",
  "baby juice",
  "ball gag",
  "ball gravy",
  "ball kicking",
  "ball licking",
  "ball sack",
  "ball sucking",
  "bangbros",
  "bareback",
  "barely legal",
  "barenaked",
  "bastard",
  "bastardo",
  "bastinado",
  "bbw",
  "bdsm",
  "beaner",
  "beaners",
  "beaver cleaver",
  "beaver lips",
  "bestiality",
  "big black",
  "big breasts",
  "big knockers",
  "big tits",
  "bimbos",
  "birdlock",
  "black cock",
  "blonde action",
  "blonde on blonde action",
  "blowjob",
  "blow job",
  "blow your load",
  "blue waffle",
  "blumpkin",
  "bollocks",
  "bondage",
  "brown showers",
  "brunette action",
  "bukkake",
  "bulldyke",
  "bullet vibe",
  "busty",
  "camel toe",
  "camgirl",
  "camslut",
  "camwhore",
  "carpet muncher",
  "carpetmuncher",
  "chocolate rosebuds",
  "circlejerk",
  "cleveland steamer",
  "clit",
  "clitoris",
  "clover clamps",
  "clusterfuck",
  "coprolagnia",
  "coprophilia",
  "cornhole",
  "creampie",
  "cum",
  "cumming",
  "cunnilingus",
  "cunt",
  "darkie",
  "date rape",
  "daterape",
  "deep throat",
  "deepthroat",
  "dendrophilia",
  "dick",
  "dildo",
  "dingleberry",
  "dingleberries",
  "dirty pillows",
  "dirty sanchez",
  "doggie style",
  "doggiestyle",
  "doggy style",
  "doggystyle",
  "dolcett",
  "domination",
  "dominatrix",
  "dommes",
  "donkey punch",
  "double dong",
  "double penetration",
  "dp action",
  "dry hump",
  "dvda",
  "eat my ass",
  "ecchi",
  "ejaculation",
  "erotic",
  "erotism",
  "eunuch",
  "faggot",
  "fecal",
  "felch",
  "fellatio",
  "feltch",
  "female squirting",
  "femdom",
  "figging",
  "fingering",
  "fisting",
  "foot fetish",
  "footjob",
  "frotting",
  "fucktards",
  "fudge packer",
  "fudgepacker",
  "futanari",
  "gang bang",
  "gay sex",
  "genitals",
  "giant cock",
  "goatcx",
  "goatse",
  "gokkun",
  "golden shower",
  "goodpoop",
  "goo girl",
  "goregasm",
  "grope",
  "group sex",
  "g-spot",
  "guro",
  "hand job",
  "handjob",
  "hentai",
  "homoerotic",
  "honkey",
  "hot carl",
  "hot chick",
  "how to kill",
  "how to murder",
  "huge fat",
  "humping",
  "incest",
  "intercourse",
  "jack off",
  "jail bait",
  "jailbait",
  "jelly donut",
  "jerk off",
  "jigaboo",
  "jiggaboo",
  "jiggerboo",
  "jizz",
  "juggs",
  "kike",
  "kinbaku",
  "kinkster",
  "kinky",
  "knobbing",
  "leather restraint",
  "leather straight jacket",
  "lemon party",
  "lolita",
  "lovemaking",
  "make me come",
  "male squirting",
  "masturbate",
  "menage a trois",
  "missionary position",
  "mound of venus",
  "muff diver",
  "muffdiving",
  "nawashi",
  "negro",
  "neonazi",
  "nigga",
  "nigger",
  "nig nog",
  "nimphomania",
  "nipple",
  "nipples",
  "nsfw images",
  "nude",
  "nudity",
  "nympho",
  "nymphomania",
  "octopussy",
  "omorashi",
  "one cup two girls",
  "one guy one jar",
  "orgasm",
  "orgy",
  "paedophile",
  "paki",
  "pedobear",
  "pedophile",
  "pegging",
  "penis",
  "pissing",
  "piss pig",
  "pisspig",
  "playboy",
  "pleasure chest",
  "pole smoker",
  "ponyplay",
  "poof",
  "poon",
  "poontang",
  "punany",
  "porn",
  "porno",
  "pornography",
  "pthc",
  "pubes",
  "pussy",
  "quim",
  "raghead",
  "rape",
  "raping",
  "rapist",
  "rectum",
  "reverse cowgirl",
  "rimjob",
  "rimming",
  "rosy palm",
  "rosy palm and her 5 sisters",
  "sadism",
  "santorum",
  "scat",
  "schlong",
  "scissoring",
  "semen",
  "sexo",
  "shaved beaver",
  "shaved pussy",
  "shemale",
  "shibari",
  "shota",
  "shrimping",
  "skeet",
  "slanteye",
  "s&m",
  "smut",
  "snatch",
  "sodomize",
  "sodomy",
  "spic",
  "splooge",
  "splooge moose",
  "spooge",
  "spread legs",
  "spunk",
  "strap on",
  "strapon",
  "strappado",
  "strip club",
  "style doggy",
  "suicide girls",
  "sultry women",
  "swastika",
  "swinger",
  "tainted love",
  "taste my",
  "tea bagging",
  "threesome",
  "throating",
  "tight white",
  "tit",
  "tits",
  "titties",
  "titty",
  "tongue in a",
  "topless",
  "tosser",
  "towelhead",
  "tranny",
  "tribadism",
  "tub girl",
  "tubgirl",
  "tushy",
  "twat",
  "twink",
  "twinkie",
  "two girls one cup",
  "undressing",
  "upskirt",
  "urethra play",
  "urophilia",
  "vagina",
  "venus mound",
  "vibrator",
  "violet wand",
  "vorarephilia",
  "voyeur",
  "vulva",
  "wank",
  "wetback",
  "wet dream",
  "white power",
  "wrapping men",
  "wrinkled starfish",
  "yellow showers",
  "yiffy",
  "zoophilia"
];
//

const rlGuildId = "486066493801496586";
const rlTermsChanId = "552718280792735744";
const rlMemberRoleId = "540413905332076544";

client.on("message", async (message) => {
  if (client.user.id === message.author.id) {
    return;
  }

  // redlynx server
  if (message.guild.id === rlGuildId) {
    // terms of use - 'i agree'
    if (message.channel.id === rlTermsChanId && !(message.member.permissions.bitfield & 8)) {
      // check if the user typed 'i agree'
      if (message.content.toLowerCase() === "i agree") {
        // give the user the 'new kid' role
        message.member
          .addRole(rlMemberRoleId)

          .catch(error);
      } else {
        // warn the user that they didnt type 'i agree'
        message
          .reply("Please agree to the terms in order to continue.")

          .then(reply => {
            reply
              .delete(5000)

              .catch(error);
          });
      }
      // remove the users message
      return message
        .delete()

        .catch(error);
    }

    // redlynx blacklisted words
    if (rlBlacklist.includes(message.content.toLowerCase()) === true) {
      // delete the users message
      message
        .delete()

        .catch(error);

      // inform the user that the word they used is blacklisted
      const blacklistReplies = ["Using that word here is so not cool!", "Using that word here is lame."];
      return message.reply(blacklistReplies[
        Math.floor(Math.random() * blacklistReplies.length)
      ]);
    }
  }
  //

  if (scripts == null) {
    return warn("received a message event before loading local scripts, ignoring");
  }

  let dbGuild;
  try {
    dbGuild = await loadGuild(message.guild.id);
  } catch (err) {
    return error(`error loading guild: ${message.guild.name}, ${message.guild.id}: ${err}`);
  }

  if (dbGuild.premium === false) {
    return;
  }

  let dbUser;
  try {
    dbUser = await loadUser(message.author.id);
  } catch (err) {
    return error(`error loading user: ${message.author.username}, ${message.author.id}: ${err}`);
  }

  const userStatsInc = {};
  let trophiesPush = null;

  if (message.content.includes("shit")) {
    dbUser.shits += 1;
    userStatsInc.shits = 1;

    if (dbUser.shits >= 1000 && !dbUser.trophies.includes("1kshits")){
      trophiesPush = "1kshits";
    }
  }

  let xp;
  if (message.content.length <= 15) {
    xp = 1;
  } else {
    xp = Math.min(25, Math.round(message.content.length / 10));
  }

  dbUser.xp += xp;
  userStatsInc.xp = xp;

  // async
  dbUser.updateOne({
    $inc: userStatsInc,
    ... trophiesPush == null ? {} : { $push: { trophies: trophiesPush } }
  }).catch((err) => {
    error(`error saving user stats: ${message.author.username}, ${message.author.id}: ${err}`);
  });

  let guildScripts;
  try {
    guildScripts = await loadGuildScripts(dbGuild);
  } catch (err) {
    return error(`error loading guild scripts: ${message.guild.name}, ${message.guild.id}: ${err}`);
  }

  // merge with local script data as weight isnt supported by the database.
  // assign -1 weight to non local scripts, then sort by weight.
  guildScripts.forEach(e => {
    const local = scripts.find(f => f.name === e.name);
    if (local == null) {
      return e.weight = -1;
    }
    e.weight = local.weight || 0;
  });
  guildScripts.sort((a, b) => b.weight - a.weight);

  let matchedScript;
  let matchedTerm;
  for (const guildScript of guildScripts) {
    const { matched, err } = matchScript(dbGuild.prefix,
      guildScript.match_type_override || guildScript.match_type,
      guildScript.match_override || guildScript.match,
      message.content);

    if (err != null) {
      return error(`error matching script: ${guildScript.name}: ${err}`);
    }

    if (matched !== false) {
      matchedScript = guildScript;
      matchedTerm = matched;
      break;
    }
  }

  if (matchedTerm == null) {
    return;
  }

  if (!evalPerms(dbGuild, matchedScript, message.member, message.channel)) {
    return;
  }

  matchedScript.updateOne({
    $inc: { use_count: 1 }
  }).catch(error => {
    error(`error updating script use_count: ${message.author.username}, ${message.author.id}, script: ${matchedScript.name}: ${error}`);
  });

  if (matchedScript.local) {
    // message.channel.startTyping();

    const localScript = scripts.find(e => e.name === matchedScript.name);
    if (localScript == null) {
      return error(`could not find local script: ${matchedScript.name}`);
    }

    try {
      localScript.run(
        client,
        message,
        dbGuild,
        dbUser,
        matchedScript,
        matchedTerm
      );
    } catch (err) {
      error(`error running local script: ${localScript.name}: ${err}`);
    }

    // message.channel.stopTyping();
  } else if (matchedScript.type === "js") {
    try {
      sandbox.exec(matchedScript.code, {
        ...baseScriptSandbox,
        message
      });
    } catch (err) {
      error(`error running non local script: ${matchedScript.name}: ${err}`);
    }
  } else {
    // old code
    warn(`json script parser called, this is old code and may not work as intended: ${matchedScript.name}`);

    // json script handling

    if (matchedScript.data.action === "text") {
      return message.channel.send(matchedScript.data.args[0].value);
    }

    if (matchedScript.data.action === "file") {
      return message.channel.send("", {
        file: matchedScript.data.args[0].value
      });
    }

    if (matchedScript.data.action === "embed") {
      // author
      // color
      // description
      // footer
      // image
      // thumbnail
      // timestamp
      // title
      // url

      const embed = new discord.RichEmbed();

      for (const arg of matchedScript.data.args) {
        // cos discord embeds have the BIG gay
        switch (arg.field) {
        case "author":
          embed.setAuthor(arg.value);
          break;
        case "color":
          embed.setColor(arg.value);
          break;
        case "description":
          embed.setDescription(arg.value);
          break;
        case "footer":
          embed.setFooter(arg.value);
          break;
        case "image":
          embed.setImage(arg.value);
          break;
        case "thumbnail":
          embed.setThumbnail(arg.value);
          break;
        case "timestamp":
          embed.setTimestamp(arg.value);
          break;
        case "title":
          embed.setTitle(arg.value);
          break;
        case "url":
          embed.setURL(arg.value);
          break;
        default:
          return message.channel.send("invalid embed argument");
        }
      }

      return message.channel.send(embed);
    }
  }
});
//
