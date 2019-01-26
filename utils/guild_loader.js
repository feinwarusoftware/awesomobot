"use strict";

const { GuildSchema, ScriptSchema } = require("../db");

const loadGuilds = ids => {
  return new Promise((resolve, reject) => {

    GuildSchema.find({ discord_id: { $in: ids } })
      .then(dbGuilds => {

        // if guild null, add new guild and base scripts
        // for the future: maybe basic scripts dont need to be
        // added, theyre programmed to be there anyway

        const dbGuildIds = dbGuilds.map(guild => guild.discord_id);
        const newGuildIds = ids.filter(id => !dbGuildIds.includes(id));

        let preloadScriptsPromise = new Promise(resolve => resolve());

        // need to fetch preload script list
        if (newGuildIds.length >= 0) {

          preloadScriptsPromise = ScriptSchema.find({ preload: true });
        }

        preloadScriptsPromise
          .then(preloadScripts => {

            const createdGuilds = newGuildIds.map(id => new GuildSchema({
              discord_id: id,
              scripts: preloadScripts.map(script => {
                script.updateOne({ $inc: { guild_count: 1 } });
                return {
                  object_id: script._id
                };
              })
            }));

            const createdGuildsSavePromises = [];

            createdGuilds.forEach(guild => {
              createdGuildsSavePromises.push(guild.save());
            });

            Promise.all(createdGuildsSavePromises)
              .then(() => {
                resolve([...dbGuilds, ...createdGuilds]);
              })
              .catch(error => {
                reject(error);
              });
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

const loadGuild = id => {
  return new Promise((resolve, reject) => {

    GuildSchema.findOne({ discord_id: id })
      .then(dbGuild => {
        if (dbGuild == null) {

          ScriptSchema.find({ preload: true })
            .then(preloadScripts => {
              const createdGuild = new GuildSchema({
                discord_id: id,
                scripts: preloadScripts.map(script => {
                  script.updateOne({ $inc: { guild_count: 1 } });
                  return {
                    object_id: script._id
                  };
                })
              });

              createdGuild.save()
                .then(() => {
                  resolve(createdGuild);
                })
                .catch(error => {
                  reject(error);
                });
            })
            .catch(error => {
              reject(error);
            });
        } else {
          resolve(dbGuild);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {

  loadGuilds,
  loadGuild
};
