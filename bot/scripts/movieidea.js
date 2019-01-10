"use strict";

const Command = require("../script");

const movieidea = new Command({

  name: "Movie Ideas",
  description: "Movie Idea #2305: Adam Sandler is trapped on an island... and falls in love with a ehh coconut",
  help: "**[prefix]movieidea** to generate a random Adam Sandler movie idea!",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/509092328091287553/t15.png",
  marketplace_enabled: true,

  type: "js",
  match_type: "command",
  match: "movieidea",

  featured: false,

  preload: true,

  cb: function(client, message, guildDoc) {

    const movieIdeas = [
      "Movie Idea #01: Adam Sandler... is like in love with some girl.. but then it turns out that the girl is actually a golden retriever or something..",
      "Movie Idea #02: Adam Sandler... inherits like a billion dollars.. but first he needs to become a boxer or something",
      "Movie Idea #03: Rob Schneider... is forced to write in javascript... and something",
      "Movie Idea #04: Adam Sandler is kidnapped and made to copy bootstrap code",
      "Movie Idea #05: Adam Sandler... is actually some guy with some sword that lights up and stuff",
      "Movie Idea #06: Adam Sandler... is a robot sent from the future to kill another robot",
      "Movie Idea #07: Adam Sandler... has like a katana sword.. and eh needs to kill some guy named Bill",
      "Movie Idea #08: Adam Sandler is forced to train under this chinese guy... thats actually japanese and stuff",
      "Movie Idea #09: AWESOM-O is forced to clean up rubbish and then like goes into space and stuff",
      "Movie Idea #10: Adam Sandler argues with this red light robot on some.. eh spaceship",
      "Movie Idea #11: Adam Sandler... is a toy.. and completes a story",
      "Movie Idea #12: Adam Sandler... like robs a bank and has a some scars or something...",
      "Movie Idea #13: Rob Schneider is a like a guy like in the second world war and stuff",
      "Movie Idea #14: Adam Sandler is in a car... only problem is that he can't go below 50MPH or he'll die",
      "Movie Idea #15: Adam Sandler is scottish and wears a kilt and stuff",
      "Movie Idea #16: Adam Sandler has a dream.. but he thinks it real life and stuff",
      "Movie Idea #17: Rob Schneider is actually a carrot and stuff",
      "Movie Idea #18: Adam Sandler takes too many drugs.. and has to dodge bullets and stuff",
      "Movie Idea #19: Adam Sandler.. has to put a tell the sheep to shut up.. and stuff...",
      "Movie Idea #20: Adam Sandler... is a lion... and he ehh has to become a king and stuff",
      "Movie Idea #21: Adam Sandler has to stick an axe through a door.. but then like freezes and stuff",
      "Movie Idea #22: Adam Sandler... has to wear pyjamas and do work.. but then he is asked to have a shower and stuff...",
      "Movie Idea #23: Adam Sandler has to drive some car into the future... and like has an adventure and something...",
      "Movie Idea #24: Adam Sandler... is an old person... and he doesn't like his life so he eh... attaches balloons to his house and flys and away and stuff..",
      "Movie Idea #25: Adam Sandler... is accused of hitting this girl.. but he did naht hit her.. its not true.. its bullshit.. oh hi mark...",
      "Movie Idea #26: Adam Sandler... doesn't like fart jokes.. so he like tries to kill some canadians.. and saddam hussein comes back and stuff...",
      "Movie Idea #27: Adam Sandler.. is like the captain on this ehh...space..ship.. and ehh he yells khan a lot...",
      "Movie Idea #28: Rob Schneider... has to play drums in this eh.. jazz band but he doesnt know if he is rushing or dragging...",
      "Movie Idea #29: Adam Sandler.. is hungry.. so he plays some games... to get his food stamps...",
      "Movie Idea #30: Adam Sandler.. is this dictator who fancies some girl who works in like some wholefoods place.. so he decides to not be a dictator and stuff..",
      "Movie Idea #31: Adam Sandler and his friend makes a TV show called Adam's World but is not allowed to play stairway in the guitar shop... and stuff...",
      "Movie Idea #34.249.184.154: Adam Sandler... has to make money through patreon to fund the servers....  https://www.patreon.com/awesomo ..not selling out at all...",
      "Movie Idea #35: Rob Schneider is afraid of ghosts, and he has to like bust 'em up and stuff..",
      "Movie Idea #69: Adam Sandler is the new kid in a small town in.. eh.. Colorado.. and he has to deal with these 8-year olds and stuff...",
      "Movie Idea #2305: Adam Sandler is trapped on an island... and falls in love with a ehh coconut"
    ];

    message.reply(movieIdeas[Math.floor(Math.random() * movieIdeas.length)]);
  }
});

module.exports = movieidea;
