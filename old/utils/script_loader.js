"use strict";

const { ScriptSchema } = require("../db");

const { getFilePathsInDir } = require("./misc");

const loadGuildScripts = guild => {
  return new Promise((resolve, reject) => {

    ScriptSchema.find({ _id: { $in: guild.scripts.map(e => e.object_id) } })
      .then(guildScripts => {
        resolve(guildScripts);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const loadLocalScripts = dir => {
  return new Promise((resolve, reject) => {

    const scripts = [];

    const files = getFilePathsInDir(dir);

    for (let file of files) {

      const ext = file.slice(file.lastIndexOf(".") + 1);

      if (ext !== "js") {

        return reject(`non js scripts not supported: '${file}'`);
      }

      const script = require(file);

      scripts.push(script);
    }

    ScriptSchema.find({ local: true, name: { $in: scripts.map(e => e.name) } })
      .then(dbScripts => {
        const promises = [];

        for (let script of scripts) {

          promises.push(script.startup());

          const dbScript = dbScripts.length === 0
            ? null
            : dbScripts.find(e => e.name === script.name);

          if (dbScript == null) {

            const newScript = new ScriptSchema({

              author_id: "feinwaru-devs",

              name: script.name,
              description: script.description,
              thumbnail: script.thumbnail,
              marketplace_enabled: script.marketplace_enabled,

              type: script.type,
              match_type: script.match_type,
              match: script.match,

              code: null,
              data: null,

              local: true,
              featured: script.featured,
              preload: script.preload,
              verified: true,
              likes: 0,
              guild_count: 0,
              use_count: 0,

              created_with: "vscode"
            });

            dbScripts.push(newScript);

            promises.push(newScript.save());
            continue;
          }

          let options = {};
          let change = false;
          for (let prop in script) {

            if (dbScript[prop] !== script[prop] && prop !== "author_id" && prop !== "cb" && prop !== "load") {

              options[prop] = script[prop];
              change = true;
            }
          }

          if (change) {

            promises.push(dbScript.updateOne(options));
          }
        }

        Promise.all(promises)
          .then(() => {

            resolve(scripts, dbScripts);
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {

  loadGuildScripts,
  loadLocalScripts
};
