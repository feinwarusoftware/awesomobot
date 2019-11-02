"use strict";

const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const schemas = require("../../../db");
const { authUser } = require("../../middlewares");
const { getClient } = require("../../helpers/client");

const router = express.Router();
const { log: { error } } = require("../../../utils");

const defaultSearchLimit = 5;
const maxSearchLimit = 20;
const defaultSearchPage = 0;

const defaultValue = (param, def) => {

  return param === undefined ? def : param;
};

/*
{
    expire,
    data
}
*/
const guildCache = {};

const cacheTime = 30000;

const getUserGuilds = token => {
  return new Promise((resolve, reject) => {

    let data = null;
    for (let k in guildCache) {

      if (guildCache[k].expire < Date.now()) {

        delete guildCache[k];
        continue;
      }

      if (k === token) {

        data = guildCache[k].data;
      }
    }

    if (data === null) {

      axios
        .get("https://discordapp.com/api/v6/users/@me/guilds", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {

          guildCache[token] = {

            expire: new Date(Date.now() + cacheTime),
            data: res.data
          };

          resolve(res.data);
        })
        .catch(err => {

          reject(err);
        });
    } else {

      resolve(data);
    }
  });
};

router.route("/premium/:discord_id").post(authUser, async (req, res) => {

  let limit = 0;

  switch(req.user.tier) {
  case "partner":
    limit = 1;
    break;
  case "f":
    limit = 0;
    break;
  case "bf":
    limit = 1;
    break;
  case "sbf":
    limit = 3;
    break;
  default:
    limit = parseInt(req.user.tier);

    if (isNaN(limit)) {

      return res.json({ status: 400, message: "invalid tier" });
    }
  }

  let current = [];
  const currentGuilds = await schemas.GuildSchema.find({
    discord_id: {
      $in: req.user.premium
    }
  });
  if (currentGuilds.length !== 0) {

    current = currentGuilds.map(e => e.discord_id);
  }
  req.user.premium.filter(e => current.includes(e));

  if (limit <= req.user.premium.length) {

    return res.json({
      status: 403,
      tier: req.user.tier,
      limit,
      used: req.user.premium.length
    });
  }

  schemas.GuildSchema
    .findOne({
      discord_id: req.params.discord_id
    })
    .then(doc => {
      if (doc === null) {

        return res.json({ status: 404 });
      }

      if (doc.premium === true) {

        return res.json({ status: 400, message: "already premium" });
      }

      const promises = [];
      promises.push(doc.update({ premium: true }));
      promises.push(req.user.update({
        premium: [ ...req.user.premium, doc.discord_id ]
      }));

      Promise.all(promises).then(() => {

        res.json({ status: 200 });
      }).catch(err => {

        error(err);
        return res.json({ status: 500, message: "I selled my wife for internet connection." });
      });
    })
    .catch(err => {

      error(err);
      return res.json({ status: 500, message: "I selled my wife for internet connection." });
    });
});

router.route("/premium/:discord_id").delete(authUser, (req, res) => {

  schemas.GuildSchema
    .findOne({
      discord_id: req.params.discord_id
    })
    .then(doc => {
      if (doc === null) {

        return res.json({ status: 404 });
      }

      const index = req.user.premium.indexOf(req.params.discord_id);

      if (index === -1) {

        return res.json({ status: 403, message: "you didnt give this guild premium" });
      }

      if (doc.premium === false) {

        return res.json({ status: 400, message: "already not premium" });
      }

      req.user.premium.splice(index, 1);

      const promises = [];
      promises.push(doc.update({ premium: false }));
      promises.push(req.user.update({ premium: req.user.premium }));

      Promise.all(promises).then(() => {

        res.json({ status: 200 });
      }).catch(err => {

        error(err);
        return res.json({ status: 500, message: "I selled my wife for internet connection." });
      });
    })
    .catch(err => {

      error(err);
      return res.json({ status: 500, message: "I selled my wife for internet connection." });
    });
});

router.route("/").post(authUser, (req, res) => {

  const params = {};
  params.discord_id = req.body.discord_id;
  params.prefix = req.body.prefix;
  params.member_perms = req.body.member_perms;
  params.scripts = [];

  if (req.user.admin === true) {

    params.premium = req.body.premium === undefined ? true : req.body.premium;
  }

  const guild = new schemas.GuildSchema(params);

  guild
    .save()
    .then(() => {

      return res.json({ status: 200 });
    })
    .catch(err => {

      error(err);
      return res.json({ status: 500, message: "I selled my wife for internet connection." });
    });
});

router.route("/@me").get(authUser, (req, res) => {

  // + cond discord data
  const noawesomo = req.query.noawesomo === "true";

  // + cond discord data
  const extended = req.query.extended === "true";

  // Parse the amount of scripts that the api will return.
  let limit = parseInt(req.query.limit);
  if (isNaN(limit)) {
    limit = defaultSearchLimit;
  }
  limit = Math.min(limit, maxSearchLimit);

  // Parse the current page of scripts that the api will return.
  const page = defaultValue(req.query.page, defaultSearchPage);

  // Parse the name seperately as it will be a 'contains' filter.
  const name = req.query.name;

  //
  let owner;
  if (req.query.owner === "true") {
    owner = true;
  }
  if (req.query.owner === "false") {
    owner = false;
  }

  getUserGuilds(req.session.discord.access_token)
    .then(guilds => {

      const search_ids = [];
      const search_guilds = [];
      for (let guild of guilds) {
        if (guild.name.includes(name === undefined ? "" : name) === true && (owner === undefined ? true : guild.owner === owner)) {

          search_ids.push(guild.id);
          search_guilds.push(guild);
        }
      }

      schemas.GuildSchema
        .count({
          discord_id: {
            $in: search_ids
          }
        })
        .skip(page * limit)
        .limit(limit)
        .then(total => {
          if (total === 0 && noawesomo !== true) {

            return res.json({ status: 404 });
          }

          schemas.GuildSchema
            .find({
              discord_id: {
                $in: search_ids
              }
            })
            .skip(page * limit)
            .limit(limit)
            .select({
              __v: 0,
              _id: 0,
              scripts: 0
            })
            .then(async docs => {

              if (extended === true) {

                const client = await getClient();

                docs = docs.map(doc => {

                  const doc_obj = doc.toObject();

                  for (let guild of guilds) {

                    if (guild.id === doc_obj.discord_id) {

                      const clientGuild = client.guilds
                        .find(e => e.id === guild.id);

                      doc_obj.owner = guild.owner;
                      doc_obj.permissions = guild.permissions;
                      doc_obj.icon = guild.icon;
                      //doc.id = guild.id;
                      doc_obj.name = guild.name;

                      if (clientGuild != null){
                        doc_obj.roles = clientGuild.roles.array().map(e => ({
                          name: e.name,
                          id: e.id
                        }));

                        doc_obj.channels = clientGuild.channels.array().filter(e => e.type === "text").map(e => ({
                          id: e.id,
                          name: e.name
                        }));
                      }

                      break;
                    }
                  }

                  return doc_obj;
                });

                if (noawesomo === true) {

                  docs = [
                    ...docs,
                    ...search_guilds
                      .filter(e => !docs.map(e => e.discord_id).includes(e.id))
                      .map(e => {

                        if (e.discord_id !== undefined) {

                          return e;
                        }

                        e.discord_id = e.id;
                        delete e.id;

                        return e;
                      })];
                }
              } else {
                if (noawesomo === true) {

                  docs = search_guilds.map(e => {

                    e.discord_id = e.id;
                    delete e.id;

                    return e;
                  });
                }
              }

              return res.json({
                status: 200,
                page,
                limit,
                total,
                guilds: docs
              });
            })
            .catch(err => {

              error(err);
              return res.json({ status: 500, message: "I selled my wife for internet connection." });
            });
        })
        .catch(err => {

          error(err);
          return res.json({ status: 500, message: "I selled my wife for internet connection." });
        });

    })
    .catch(err => {

      error(err);
      return res.json({ status: 500, message: "I selled my wife for internet connection." });
    });
});

router.route("/:discord_id").get(authUser, (req, res) => {

  schemas.GuildSchema
    .findOne({
      discord_id: req.params.discord_id
    })
    .select({
      __v: 0,
      _id: 0,
      scripts: 0
    })
    .then(doc => {
      if (doc === null) {

        return res.json({ status: 404 });
      }

      return res.json({ status: 200, guild: doc });
    })
    .catch(err => {

      error(err);
      return res.json({ status: 500, message: "I selled my wife for internet connection." });
    });

}).patch(authUser, (req, res) => {

  const params = {};
  params.prefix = req.body.prefix;
  params.member_perms = req.body.member_perms;
  params.script_perms = req.body.script_perms;

  if (params.member_perms === undefined || params.member_perms === null){
    params.member_perms = [];
  }

  if (params.script_perms === undefined || params.script_perms === null){
    params.script_perms = [];
  }

  if (req.user.admin === true) {

    params.premium = req.body.premium;
  }

  schemas.GuildSchema
    .findOne({
      discord_id: req.params.discord_id
    })
    .then(doc => {
      if (doc === null) {

        return res.json({ status: 404 });
      }

      getUserGuilds(req.session.discord.access_token)
        .then(guilds => {

          const current_guild = guilds.find(e => {

            return e.id === req.params.discord_id;
          });

          const member_perms = doc.member_perms
            .find(e => e.member_id === req.user.discord_id);
          if (current_guild === undefined || current_guild.owner === false && (current_guild.permissions & 0b1000) !== 0b1000 && (member_perms === undefined || member_perms.list.includes("patch_guild") === false)) {

            return res.json({ status: 403 });
          }

          doc
            .update(params)
            .then(() => {

              return res.json({ status: 200 });
            })
            .catch(err => {

              error(err);
              return res.json({ status: 500, message: "I selled my wife for internet connection." });
            });
        })
        .catch(err => {

          error(err);
          return res.json({ status: 500, message: "I selled my wife for internet connection." });
        });
    })
    .catch(err => {

      error(err);
      return res.json({ status: 500, message: "I selled my wife for internet connection." });
    });

}).delete(authUser, (req, res) => {

  schemas.GuildSchema
    .findOne({
      discord_id: req.params.discord_id
    })
    .then(doc => {
      if (doc === null) {

        return res.json({ status: 404 });
      }

      getUserGuilds(req.session.discord.access_token)
        .then(guilds => {

          const current_guild = guilds.find(e => {

            return e.id === req.params.discord_id;
          });

          const member_perms = doc.member_perms
            .find(e => e.member_id === req.user.discord_id);
          if (current_guild === undefined || current_guild.owner === false && (current_guild.permissions & 0b1000) !== 0b1000 && (member_perms === undefined || member_perms.list.includes("delete_guild") === false)) {

            return res.json({ status: 403 });
          }

          doc
            .remove()
            .then(() => {

              return res.json({ status: 200 });
            })
            .catch(err => {

              error(err);
              return res.json({ status: 500, message: "I selled my wife for internet connection." });
            });
        })
        .catch(err => {

          error(err);
          return res.json({ status: 500, message: "I selled my wife for internet connection." });
        });
    })
    .catch(err => {

      error(err);
      return res.json({ status: 500, message: "I selled my wife for internet connection." });
    });
});

router.route("/:discord_id/scripts").get(authUser, (req, res) => {

  // + cond script data
  const extended = req.query.extended === "true";

  // Parse the amount of scripts that the api will return.
  let limit = parseInt(req.query.limit);
  if (isNaN(limit)) {
    limit = defaultSearchLimit;
  }
  limit = Math.min(limit, maxSearchLimit);

  // Parse the current page of scripts that the api will return.
  const page = defaultValue(req.query.page, defaultSearchPage);

  // Parse other search parameters. Add only
  // the allowed parameters into a new search object.
  const search = {
    ... req.query.local === undefined
      ? {}
      : { local: req.query.local } ,
    ... req.query.verified === undefined
      ? {}
      : { verified: req.query.verified } ,
    ... req.query.featured === undefined
      ? {}
      : { featured: req.query.featured } ,
    ... req.query.marketplace_enabled === undefined
      ? { }
      : { marketplace_enabled: req.query.marketplace_enabled } ,
    ... req.query.name === undefined
      ? {}
      : { name: { $regex: `.*${req.query.name}.*` } }
  };

  schemas.GuildSchema
    .findOne({
      discord_id: req.params.discord_id
    })
    .then(doc => {
      if (doc === null) {

        return res.json({ status: 404 });
      }

      if (extended === true) {

        const search_ids = doc.scripts.map(script => script.object_id);

        schemas.ScriptSchema
          .count({
            ...search,
            _id: {
              $in: search_ids
            }
          })
          .then(total => {
            if (total === 0) {

              return res.json({ status: 404 });
            }

            schemas.ScriptSchema
              .find({
                ...search,
                _id: {
                  $in: search_ids
                }
              })
              .skip(page * limit)
              .limit(limit)
              .select({ __v: 0 })
              .then(docs => {

                docs = docs.map(doc2 => {

                  const doc2_obj = doc2.toObject();

                  for (let script of doc.scripts) {

                    if (script.object_id.equals(doc2_obj._id)) {

                      delete doc2_obj._id;

                      doc2_obj.object_id = script.object_id;
                      doc2_obj.match_type_override = script.match_type_override;
                      doc2_obj.match_override = script.match_override;
                      doc2_obj.permissions = script.permissions;

                      break;
                    }
                  }

                  return doc2_obj;
                });

                return res.json({
                  status: 200,
                  page,
                  limit,
                  total,
                  scripts: docs
                });
              })
              .catch(err => {

                error(err);
                return res.json({ status: 500, message: "I selled my wife for internet connection." });
              });
          })
          .catch(err => {

            error(err);
            return res.json({ status: 500, message: "I selled my wife for internet connection." });
          });
      } else {

        return res.json({
          status: 200,
          page,
          limit,
          total: doc.scripts.length,
          scripts: doc.scripts.slice(page * limit, page * limit + limit)
        });
      }
    })
    .catch(err => {

      error(err);
      return res.json({ status: 500, message: "I selled my wife for internet connection." });
    });

}).post(authUser, (req, res) => {

  let object_id;
  try {

    object_id = mongoose.Types.ObjectId(req.body.object_id);
  } catch(err) {

    return res.json({ status: 400 });
  }

  const params = {
    ... req.query.match_type_override === undefined
      ? {}
      : { match_type_override: req.query.match_type_override } ,
    ... req.query.match_override === undefined
      ? {}
      : { match_override: req.query.match_override } ,
    ... req.query.permissions === undefined
      ? {}
      : { permissions: req.query.permissions }
  };

  schemas.GuildSchema
    .findOne({
      discord_id: req.params.discord_id
    })
    .then(doc => {
      if (doc === null) {

        return res.json({ status: 404 });
      }

      for (let guildScript of doc.scripts) {

        if (guildScript.object_id.equals(object_id)) {

          return res.json({ status: 400 });
        }
      }

      schemas.ScriptSchema
        .findById(object_id)
        .then(doc2 => {
          if (doc2 === null) {

            return res.json({ status: 400 });
          }

          if (doc2.marketplace_enabled === false) {

            return res.json({ status: 403 });
          }

          getUserGuilds(req.session.discord.access_token)
            .then(guilds => {

              const current_guild = guilds.find(e => {

                return e.id === req.params.discord_id;
              });

              const member_perms = doc.member_perms
                .find(e => e.member_id === req.user.discord_id);
              if (current_guild === undefined || current_guild.owner === false && (current_guild.permissions & 0b1000) !== 0b1000 && (member_perms === undefined || member_perms.list.includes("post_script") === false)) {

                return res.json({ status: 403 });
              }

              const script = new schemas.GuildScriptSchema({
                ...params,
                object_id
              });

              doc.scripts.push(script);

              doc
                .save()
                .then(() => {

                  doc2.guild_count++;

                  doc2
                    .save()
                    .then(() => {

                      return res.json({ status: 200 });
                    })
                    .catch(err => {

                      error(err);
                      return res.json({ status: 500, message: "I selled my wife for internet connection." });
                    });
                })
                .catch(err => {

                  error(err);
                  return res.json({ status: 500, message: "I selled my wife for internet connection." });
                });
            })
            .catch(err => {

              error(err);
              return res.json({ status: 500, message: "I selled my wife for internet connection." });
            });
        })
        .catch(err => {

          error(err);
          return res.json({ status: 500, message: "I selled my wife for internet connection." });
        });
    })
    .catch(err => {

      error(err);
      return res.json({ status: 500, message: "I selled my wife for internet connection." });
    });
});

router.route("/:discord_id/scripts/:object_id").get(authUser, (req, res) => {

  let object_id;
  try {

    object_id = mongoose.Types.ObjectId(req.params.object_id);
  } catch(err) {

    return res.json({ status: 400 });
  }

  schemas.GuildSchema
    .findOne({
      discord_id: req.params.discord_id
    })
    .select({
      __v: 0,
      _id: 0
    })
    .then(doc => {
      if (doc === null) {

        return res.json({ status: 404 });
      }

      const script = doc.scripts.find(e => {

        return e.object_id.equals(object_id);
      });

      if (script === undefined) {

        return res.json({ status: 404 });
      }

      return res.json({ status: 200, script });
    })
    .catch(err => {

      error(err);
      return res.json({ status: 500, message: "I selled my wife for internet connection." });
    });

}).patch(authUser, (req, res) => {

  let object_id;
  try {

    object_id = mongoose.Types.ObjectId(req.params.object_id);
  } catch(err) {

    return res.json({ status: 400 });
  }

  const params = {};
  // params.match_type_override = req.body.match_type_override;
  // params.match_override = req.body.match_override;
  params.permissions = req.body.permissions;

  schemas.GuildSchema
    .findOne({
      discord_id: req.params.discord_id
    })
    .then(doc => {
      if (doc === null) {

        return res.json({ status: 404 });
      }

      getUserGuilds(req.session.discord.access_token)
        .then(guilds => {

          const current_guild = guilds.find(e => {

            return e.id === req.params.discord_id;
          });

          const member_perms = doc.member_perms
            .find(e => e.member_id === req.user.discord_id);
          if (current_guild === undefined || current_guild.owner === false && (current_guild.permissions & 0b1000) !== 0b1000  && (member_perms === undefined || member_perms.list.includes("patch_script") === false)) {

            return res.json({ status: 403 });
          }

          let found = false;
          for (let i = 0; i < doc.scripts.length; i++) {

            if (doc.scripts[i].object_id.equals(object_id)) {

              found = true;

              doc.scripts[i].permissions = params.permissions === undefined
                ? doc.scripts[i].permissions
                : params.permissions;

              break;
            }
          }

          if (found === false) {

            return res.json({ status: 404 });
          }

          doc
            .save()
            .then(() => {

              return res.json({ status: 200 });
            })
            .catch(err => {

              error(err);
              return res.json({ status: 500, message: "I selled my wife for internet connection." });
            });
        })
        .catch(err => {

          error(err);
          return res.json({ status: 500, message: "I selled my wife for internet connection." });
        });
    })
    .catch(err => {

      error(err);
      return res.json({ status: 500, message: "I selled my wife for internet connection." });
    });

}).delete(authUser, (req, res) => {

  let object_id;
  try {

    object_id = mongoose.Types.ObjectId(req.params.object_id);
  } catch(err) {

    return res.json({ status: 400 });
  }

  schemas.GuildSchema
    .findOne({
      discord_id: req.params.discord_id
    })
    .then(doc => {
      if (doc === null) {

        return res.json({ status: 404 });
      }

      getUserGuilds(req.session.discord.access_token)
        .then(guilds => {

          const current_guild = guilds.find(e => {

            return e.id === req.params.discord_id;
          });

          const member_perms = doc.member_perms
            .find(e => e.member_id === req.user.discord_id);
          if (current_guild === undefined || current_guild.owner === false && (current_guild.permissions & 0b1000) !== 0b1000  && (member_perms === undefined || member_perms.list.includes("delete_script") === false)) {

            return res.json({ status: 403 });
          }

          let found = false;
          for (let i = 0; i < doc.scripts.length; i++) {

            if (doc.scripts[i].object_id.equals(object_id)) {

              found = true;

              doc.scripts.splice(i, 1);

              break;
            }
          }

          if (found === false) {

            return res.json({ status: 404 });
          }

          doc
            .save()
            .then(() => {

              schemas.ScriptSchema
                .findById(object_id)
                .then(script => {
                  if (script === null) {

                    return res.json({ status: 404 });
                  }

                  script.guild_count--;

                  script
                    .save()
                    .then(() => {

                      return res.json({ status: 200 });
                    })
                    .catch(err => {

                      error(err);
                      return res.json({ status: 500, message: "I selled my wife for internet connection." });
                    });
                })
                .catch(err => {

                  error(err);
                  return res.json({ status: 500, message: "I selled my wife for internet connection." });
                });
            })
            .catch(err => {

              error(err);
              return res.json({ status: 500, message: "I selled my wife for internet connection." });
            });
        })
        .catch(err => {

          error(err);
          return res.json({ status: 500, message: "I selled my wife for internet connection." });
        });
    })
    .catch(err => {

      error(err);
      return res.json({ status: 500, message: "I selled my wife for internet connection." });
    });
});

module.exports = router;
