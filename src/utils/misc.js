"use strict";

const fs = require("fs");
const path = require("path");

const _ = require("lodash");

const { wikia, wikipedia } = require("./api");

const isFile = fp => fs.lstatSync(fp).isFile();
const getFilePathsInDir = fp => fs
  .readdirSync(fp)
  .map(name => path.join(fp, name))
  .filter(isFile);

const colourDistance = (c1, c2) => Math.sqrt(Math.pow(c1.r - c2.r, 2)
  + Math.pow(c1.g - c2.g, 2)
  + Math.pow(c1.b - c2.b, 2)
  + Math.pow(c1.a - c2.a, 2));

const hexToRgb = hex => {

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const opt = (options, name, def) => {
  return options && options[name] !== undefined ? options[name] : def;
};

const allIndicesOf = (string, search) => {
  let indices = [];
  for (let pos = string.indexOf(search);
    pos !== -1;
    pos = string.indexOf(search, pos + 1)) {

    indices.push(pos);
  }
  return indices;
};

const editDistance = (s1, s2) => {
  let costs = new Array();
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

const similarity = (s1, s2) => {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  let longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter))
    / parseFloat(longerLength);
};

// old code
const wikiaSearch = query => {
  return new Promise((resolve, reject) => {
    wikia.search({
      query: query,
      limit: 5
    }).then(page => {
      if (page === undefined || page.exception !== undefined) {
        // message.reply(`the wikia api shit itself
        // at 'search' trying to look up: ${query}`);
        reject(`the wikia api shit itself at 'search' trying to look up: ${query}`);
      }

      let index;
      let success = false;
      for (let i = 0; i < page.items.length; i++) {
        if (page.items[i].title.indexOf("/") === -1) {
          index = i;
          success = true;
          break;
        }
      }

      if (success === false) {
        //message.reply(`failed to look up: ${query}`);
        reject(`failed to look up: ${query}`);
      }

      let id = page.items[index].id;
      let url = page.items[index].url;
      let title = page.items[index].title;

      wikia.articleAsSimpleJson({
        id: id
      }).then(simple => {
        if (simple === undefined) {
          // message.reply(`the wikia api shit itself at
          // 'simpleJson' trying to look up: ${query}`);
          reject(`the wikia api shit itself at 'simpleJson' trying to look up: ${query}`);
        }

        let desc;
        if (simple.sections[1].title === "Synopsis") {
          desc = simple.sections[1].content[0].text;
        } else {
          desc = simple.sections[0].content[0].text;
        }

        wikia.articleDetails({
          ids: id
        }).then(detail => {
          if (detail === undefined) {
            // message.reply(`the wikia api shit itself at
            // 'articleDetails' trying to look up: ${query}`);
            reject(`the wikia api shit itself at 'articleDetails' trying to look up: ${query}`);
          }

          let thumbnail = detail.items[id].thumbnail;

          if (thumbnail === null) {
            thumbnail = "https://media.tenor.com/images/1317831d21cd4cf6e57f34a86b46a821/tenor.gif";
          }

          resolve({title, url, desc, thumbnail});

        }).catch(error => {
          // message.reply(`error searching wikia
          // 'articleDetails' for: ${query}, throwing error: ${error}`);
          reject(`error searching wikia 'articleDetails' for: ${query}, throwing error: ${error}`);
        });

      }).catch(error => {
        // message.reply(`error searching wikia at
        // 'simpleJson' for: ${query}, throwing error: ${error}`);
        reject(`error searching wikia at 'simpleJson' for: ${query}, throwing error: ${error}`);
      });

    }).catch(error => {
      // message.reply(`error searching wikia at
      // 'search' for: ${query}, throwing error: ${error}`);
      reject(`error searching wikia at 'search' for: ${query}, throwing error: ${error}`);
    });
  });
};

// old code
const getEpList = () => {
  return new Promise((resolve, reject) => {
    wikipedia.pageAsJson({
      titles: "List_of_South_Park_episodes"
    }).then(data => {
      data = JSON.stringify(data);

      let spos = allIndicesOf(data, "[[#Season ");
      let seasons = [];
      for (let i = 0; i < spos.length; i++) {
        spos[i] += 10;
        seasons[i] = data.substring(spos[i], spos[i] + (data.substring(spos[i] + 1, spos[i] + 2) == " " ? 1 : 2));
      }

      let pagePromises = [];
      for (let i = 0; i < seasons.length; i++) {
        pagePromises.push(wikipedia.pageAsJson({ titles: "South_Park_(season_" + seasons[i] + ")" }));
      }

      Promise.all(pagePromises).then(data => {
        let hopefulleAllEpisodes = [];

        for (let i = 0; i < data.length; i++) {
          data[i] = JSON.stringify(data[i]);

          let epos = allIndicesOf(data[i], "|Title = [[");
          let episodes = [];
          for (let j = 0; j < epos.length; j++) {
            epos[j] += 11;
            episodes[j] = data[i].substring(epos[j], epos[j] + 100);
          }
          for (let j = 0; j < epos.length; j++) {
            let end = episodes[j].indexOf("]]");
            episodes[j] = episodes[j].substring(0, end);
            episodes[j] = episodes[j].replace("\\", "");
            episodes[j] = episodes[j].replace("|", "");
            episodes[j] = episodes[j].replace("(South Park)", "");

            if (episodes[j].length % 2 != 0) {

              // I dont even know what these are anymore
              // but it works so lets not touch it.
              const episodeVar1 = episodes[j]
                .substring(
                  0,
                  Math.floor(episodes[j].length / 2)
                );
              const episodeVar2 = episodes[j]
                .substring(
                  Math.ceil(episodes[j].length / 2),
                  episodes[j].length
                );

              if (episodeVar1 == episodeVar2) {
                episodes[j] = episodes[j]
                  .substring(0, Math.floor(episodes[j].length / 2));
              }
            }
          }

          hopefulleAllEpisodes = hopefulleAllEpisodes.concat(episodes);
        }

        resolve(hopefulleAllEpisodes);

      }).catch(error => {
        reject(error);
      });

    }).catch(error => {
      reject(error);
    });
  });
};

const getLevelData = xp => {

  if (xp === 0) {

    return {

      level: 0,
      progress: 0
    };
  }

  const levels = [
    0,
    1,
    250,
    400,
    550,
    700,
    850,
    1000,
    1200,
    1400,
    1600,
    1800,
    2000,
    2250,
    2500,
    2750,
    3000,
    3300,
    3600,
    4000,
    4500
  ];

  let count = 0;
  let level = 0;
  let progress = 0;

  for (let i = 0; i < levels.length; i++) {

    count += levels[i];

    if (xp < count) {

      level = i - 1;
      progress = 1 - (count - xp) / levels[i];
      break;
    }
  }

  if (level === 0 && count !== 0) {

    xp -= count;

    level = Math.floor(xp / 5000) + levels.length - 1;
    progress = xp % 5000 / 5000;
  }

  if (level > 70) {

    level = 70;
    progress = 1;
  }

  return {

    level,
    progress
  };
};

const matchScript = (prefix, type, match, content) => {

  if (!(match instanceof Array)) {

    match = match.split(";");
  }

  for (let str of match) {

    let flags;
    let regex;

    switch(type) {
    case "command":
      if (content.split(" ")[0].toLowerCase() === prefix + str.toLowerCase()) {

        return { matched: str, err: null };
      }
      break;
    case "startswith":
      if (content.toLowerCase().startsWith(str.toLowerCase())) {

        return { matched: str, err: null };
      }
      break;
    case "contains":
      if (content.toLowerCase().includes(str.toLowerCase())) {

        return { matched: str, err: null };
      }
      break;
    case "exactmatch":
      if (content === str) {

        return { matched: str, err: null };
      }
      break;
    case "regex":
      try {
        regex = str.split("/");

        flags = regex.pop();
        regex.shift();

        regex = regex.join("/");

      } catch(err) {

        return { matched: null, err };
      }

      regex = new RegExp(regex, flags);

      if (regex.test(content)) {

        return { matched: str, err: null };
      }

      break;
    }
  }

  return { matched: false, err: null };
};

const evalPerms = (guild, script, member, channel) => {

  const defaultPerms = {
    members: {
      whitelist: false,
      list: []
    },
    channels: {
      whitelist: false,
      list: []
    },
    roles: {
      whitelist: false,
      list: []
    }
  };

  const globalPerms = guild.script_perms || {};
  const localPerms = guild.scripts
    .find(e => e.object_id.equals(script._id))
    .permissions || {};

  // handle overrides
  const scriptPerms = defaultPerms;

  for (let field in scriptPerms) {
    if (globalPerms[field] != null) {
      scriptPerms[field].whitelist = globalPerms[field].whitelist
        || scriptPerms[field].whitelist;

      scriptPerms[field].list = globalPerms[field].list != null
        ? _.uniq([ ...scriptPerms[field].list, ...globalPerms[field].list ])
        : scriptPerms[field].list;
    }
  }

  for (let field in scriptPerms) {
    if (localPerms[field] != null) {
      scriptPerms[field].whitelist = localPerms[field].whitelist
        || scriptPerms[field].whitelist;

      scriptPerms[field].list = localPerms[field].list != null
        ? _.uniq([ ...scriptPerms[field].list, ...localPerms[field].list ])
        : scriptPerms[field].list;
    }
  }

  /*
  const scriptPerms = {
    // the default fields that are expected to exist
    ...defaultPerms,
    // the global guild perms
    ...guild.script_perms,
    // the script overrides
    ...guildScript.permissions
  };
  */

  // if list is empty, and whitelist, disallow everything
  // if list is empty, and blacklist, allow everything
  // if whitelist, allow only in list (roles - allow if
  // the member has any of the whitelisted roles)
  // if blacklist, allow everything not in list (roles -
  // disallow if the member has any of the blacklisted roles)

  // member null, whitelist - block
  // member null, blacklist - allow
  // member found, whitelist - allow
  // member found, blacklist - block
  const memberp = scriptPerms.members.list.find(e => e === member.user.id);
  if (memberp == null && scriptPerms.members.whitelist === true
    || memberp != null && scriptPerms.members.whitelist === false) {

    return false;
  }

  // channel null, whitelist - block
  // channel null, whitelist - allow
  // channel found, whitelist - allow
  // channel found, whitelist - block
  const channelp = scriptPerms.channels.list.find(e => e === channel.id);
  if (channelp == null && scriptPerms.channels.whitelist === true
    || channelp != null && scriptPerms.channels.whitelist === false) {

    return false;
  }

  // role null, whitelist - block (no role overlap between user and list)
  // role null, whitelist - allow (no role overlap between user and list)
  // role found, whitelist - allow (there is role overlap between user and list)
  // role found, whitelist - block (there is role overlap between user and list)
  const memberRoleIds = member.roles.array().map(e => e.id);
  const rolep = scriptPerms.roles.list.find(e => memberRoleIds.includes(e));
  if (rolep == null && scriptPerms.roles.whitelist === true
    || rolep != null && scriptPerms.roles.whitelist === false) {

    return false;
  }

  return true;
};

module.exports = {

  isFile,
  getFilePathsInDir,

  colourDistance,
  hexToRgb,

  opt,
  allIndicesOf,
  editDistance,
  similarity,

  getLevelData,

  matchScript,
  evalPerms,

  wikiaSearch,
  getEpList
};
