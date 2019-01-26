"use strict";

const fs = require("fs");
const path = require("path");

const crypto = require("crypto");
const axios = require("axios");
const express = require("express");
const showdown = require("showdown");
const jwt = require("jsonwebtoken");

const { getClient } = require("../helpers/client");
const schemas = require("../../db");
const { log: { warn, error } } = require("../../utils");
const api = require("./api");
const { authUser, authPremium, authAdmin } = require("../middlewares");
const { fetchSession, getUserData } = require("../helpers");

const config = require("../../../config.json");

const router = express.Router();
const converter = new showdown.Converter({
  tables: true,
  emoji: true,
  customizedHeaderId: true,
  ghCodeBlocks: true
});

router.use("/api/v3", api);
router.get("/api/v3/uptime", (req, res) => {

  axios({
    method: "post",
    url: "https://api.uptimerobot.com/v2/getMonitors",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      api_key: config.uptime_key,
      all_time_uptime_ratio: "1"
    }
  }).then(api_res => {

    return res.json({ uptime: api_res.data.monitors[0].all_time_uptime_ratio });

  }).catch(() => {

    return res.json({ rip: "fucking rip" });
  });
});

const statsCacheTime = 30000;
const cachedStats = {

  expire: Date.now(),
  stats: null
};

router.get("/api/v3/stats", async (req, res) => {

  // total servers
  // total members + online members
  // commands used
  // marketplace commands
  // latest tweet
  // status + ping
  // latest update

  const client = await getClient();

  if (cachedStats.expire < Date.now()) {

    cachedStats.stats = {};

    const promises = [];

    // total servers
    cachedStats.stats.servers = client.guilds.size;

    // online + total members
    cachedStats.stats.members = {};
    cachedStats.stats.members.online = client.guilds
      .map(g => g.members.array())
      .reduce((a, c) => a = a.concat(c))
      .filter(m => m.presence.status === "online").length;
    cachedStats.stats.members.total = client.guilds
      .map(g => g.memberCount)
      .reduce((a, c) => a + c);

    // script uses
    promises.push(schemas.ScriptSchema.aggregate([{
      $group: {
        _id: {},
        total: {
          $sum: "$use_count"
        }
      }
    }]).then(uses => {

      if (uses.length === 0) {

        cachedStats.stats.script_uses = 0;
        return;
      }

      cachedStats.stats.script_uses = uses[0].total;
    }).catch(err => {

      error(`could not get script use count /api/v3/stats: ${err}`);
    }));

    // total scripts
    promises
      .push(schemas.ScriptSchema
        .count()
        .then(count => cachedStats.stats.total_scripts = count));

    // latest tweet
    cachedStats.stats.latest_tweet = {};
    cachedStats.stats.latest_tweet.text = "latest tweet text";
    cachedStats.stats.latest_tweet.date = "latest tweet date";

    // status + ping
    promises.push(axios({
      method: "post",
      url: "https://api.uptimerobot.com/v2/getMonitors",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        api_key: config.uptime_key,
        all_time_uptime_ratio: "1",
        response_times: "1",
        response_times_limit: "1"
      }
    }).then(api_res => {

      cachedStats.stats.status = {};
      cachedStats.stats.status.status = api_res.data.monitors[0].status === 2 ? "OK" : "ERROR";
      cachedStats.stats.status.ping =
        api_res.data.monitors[0].response_times[0].value;
      cachedStats.stats.status.uptime =
        api_res.data.monitors[0].all_time_uptime_ratio;
    }));

    // latest update
    cachedStats.stats.latest_update = "latest update text";

    await Promise.all(promises).then(() => {

      cachedStats.expire = Date.now() + statsCacheTime;
    }).catch(err => {

      error(err);

      cachedStats.stats = { err };
      cachedStats.expire = Date.now();
    });
  }

  return res.json({ stats: cachedStats.stats });
});

router.get("/api/v3/patrons", (req, res) => {

  // username
  // avatar
  // date
  // amount

  const patrons = [
    {
      discord_id: "99626024181968896",
      username: "Airborn56",
      avatar: "https://cdn.discordapp.com/attachments/452632364238110721/535948735310594066/airborn.png",
      date: "2018-04-01T00:00:00.000000+00:00",
      amount: 10
    },
    {
      discord_id: "430503118262894614",
      username: "timmys9inchjimmy",
      avatar: "https://media.discordapp.net/attachments/452632364238110721/535948736631668736/Timmy9Inch.png",
      date: "2018-07-01T00:00:00.000000+00:00",
      amount: 5
    },
    {
      discord_id: "328837258788601857",
      username: "lonelychef",
      avatar: "https://media.discordapp.net/attachments/452632364238110721/535948742537379870/Lonely.png",
      date: "2018-06-01T00:00:00.000000+00:00",
      amount: 10
    },
    {
      discord_id: "393620893835984896",
      username: "Savagekiller115",
      avatar: "https://media.discordapp.net/attachments/452632364238110721/535948744315895848/Savage.png",
      date: "2018-06-01T00:00:00.000000+00:00",
      amount: 10
    },
    {
      discord_id: "215216840085864448",
      username: "Umustalldie2",
      avatar: "https://media.discordapp.net/attachments/452632364238110721/535948745859137537/umad2.png",
      date: "2018-11-01T00:00:00.000000+00:00",
      amount: 10
    },
    {
      discord_id: "479238224682942474",
      username: "🐍сфъга🐍",
      avatar: "https://media.discordapp.net/attachments/452632364238110721/535948748963184652/cobra.png",
      date: "2018-12-01T00:00:00.000000+00:00",
      amount: 5
    },
    {
      discord_id: "312769434458652672",
      username: "peytonmarie",
      avatar: "https://cdn.discordapp.com/attachments/535514626973106187/536331151896346635/peyton.png",
      date: "2018-09-01T00:00:00.000000+00:00",
      amount: 10
    }
  ];

  return res.json(patrons);
});

router.get("/api/v3/stats", async (req, res) => {

  const client = await getClient();

  const guilds = client.guilds.array();

  let memberCount = 0;
  for (let i = 0; i < guilds.length; i++) {

    memberCount += guilds[i].members.array().length;
  }

  return res.json({ guilds: guilds.length, members: memberCount });
});

router.get("/api/v3/sloc", (req, res) => {

  return res.json({ code: 0 });
});

router.get("/dashboard/profiles/:discord_id", authUser, async (req, res) => {

  res.render("dashboard/profile");
});

router.get("/terms", (req, res) => {

  res.render("soontm");
});

router.get("/help", (req, res) => {

  res.render("soontm");
});

router.get("/feedback", (req, res) => {

  res.render("soontm");
});

router.get("/soontm", (req, res) => {

  res.render("soontm");
});

router.get("/logout", async (req, res) => {

  let session_doc;

  // if the cookie exists, attempt to fetch the users session
  if (req.cookies !== undefined && req.cookies.session !== undefined) {

    try {

      session_doc = await fetchSession(req.cookies.session);
    } catch(err) {

      // fail silently
      warn(err);
    }
  }

  // the user was logged in
  if (session_doc !== undefined && session_doc.complete === true) {

    // log the user out
    try {

      await session_doc.remove();
    } catch(err) {

      return res.json({ message: "error loggin out", err });
    }
  }

  // redirect to home page to show successful log out
  return res.redirect("/");
});

router.get("/auth/discord", async (req, res) => {

  let session_doc;
  if (req.cookies !== undefined && req.cookies.session !== undefined) {

    try {

      session_doc = await fetchSession(req.cookies.session);
    } catch(err) {

      // fail silently
      error(err);
    }
  }

  if (session_doc !== undefined && session_doc.complete === true) {
    return res.redirect("/dashboard");
  }

  const nonce = crypto.randomBytes(20).toString("hex");

  const session = new schemas.SessionSchema({
    nonce
  });

  let new_session_doc;
  try {

    new_session_doc = await session.save();
  } catch(err) {

    error(err);
    res.render("401", { status: 401, message: "Unauthorized", err });
  }

  res.cookie("session", jwt.sign({ id: new_session_doc._id }, config.jwt_secret), { maxAge: 604800000, httpOnly: true });
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${config.discord_id}&redirect_uri=${encodeURIComponent(config.discord_redirect)}&response_type=code&scope=guilds%20identify&state=${nonce}`);
});

router.get("/auth/discord/callback", async (req, res) => {

  let session_doc;
  try {

    session_doc = await fetchSession(req.cookies.session);
  } catch(err) {

    error(err);
    //return res.render("401", { status: 401, message: "Unauthorized", err });
    return res.redirect("/auth/discord");
  }

  if (session_doc.nonce !== req.query.state) {
    return res.render("401", { status: 401, message: "Unauthorized", error: "Login state was incorrect" });
  }

  let token_res;
  try {

    token_res = await axios({
      method: "post",
      url: `https://discordapp.com/api/oauth2/token?client_id=${config.discord_id}&client_secret=${config.discord_secret}&grant_type=authorization_code&code=${req.query.code}&redirect_uri=${encodeURIComponent(config.discord_redirect)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
  } catch(err) {

    error(err);
    return res.render("401", { status: 401, message: "Unauthorized", err });
  }

  let user_res;
  try {

    user_res = await axios({
      method: "get",
      url: "https://discordapp.com/api/v6/users/@me",
      headers: {
        Authorization: `Bearer ${token_res.data.access_token}`
      }
    });
  } catch(err) {

    error(err);
    return res.render("401", { status: 401, message: "Unauthorized", err });
  }

  session_doc.discord.access_token = token_res.data.access_token;
  session_doc.discord.token_type = token_res.data.token_type;
  session_doc.discord.expires_in = token_res.data.expires_in;
  session_doc.discord.refresh_token = token_res.data.refresh_token;
  session_doc.discord.scope = token_res.data.scope;

  session_doc.discord.id = user_res.data.id;

  // remove all dead sessions with the same discord_id
  let userData;
  try {

    userData = await getUserData(token_res.data.access_token);
  } catch(err) {

    error(err);
    return res.render("401", { status: 401, message: "Unauthorized", err });
  }

  try {

    await schemas.SessionSchema
      .find({
        "discord.id": userData.id
      })
      .then(async sessions => {

        const promises = [];

        for (let i = 0; i < sessions.length; i++) {

          promises.push(sessions[i].remove());
        }

        await Promise.all(promises);
      });

  } catch(err) {

    error(err);
    return res.render("401", { status: 401, message: "Unauthorized", err });
  }

  session_doc.nonce = null;
  session_doc.complete = true;

  try {

    await session_doc.save();
  } catch(err) {

    error(err);
    return res.render("401", { status: 401, message: "Unauthorized", err });
  }

  res.redirect("/dashboard");
});

router.get("/", (req, res) => {

  res.render("index", { md: text => {
    return converter.makeHtml(text);
  }, user: {} });
});

router.get("/api/docs", async (req, res) => {
  const apidocs = fs.readFileSync(path.join(__dirname, "..", "markdown",  "api-docs", "reference.md")).toString();
  res.render("apidocs", { md: text => {
    return converter.makeHtml(text);
  }, user: {}, apidocs});
});

router.get("/privacy", async (req, res) => {

  res.render("soontm");
});

router.get("/credits", async (req, res) => {
  let credits;
  try {

    credits = JSON.parse(fs.readFileSync(path.join(__dirname, "json", "credits.json")));
  } catch (err) {

    error(`Could not read config file: ${err}`);
    process.exit(-1);
  }
  res.render("credits", { md: text => {
    return converter.makeHtml(text);
  }, user: {}, credits:credits});
});

router.get("/surveys", (req, res) => {
  res.render("surveys", { md: text => {
    return converter.makeHtml(text);
  }, user: {}});
});

router.get("/surveys/results", (req, res) => {
  res.render("survey-results", { md: text => {
    return converter.makeHtml(text);
  }, user: {}});
});

router.get("/premium", (req, res) => {
  const premium = fs.readFileSync(path.join(__dirname, "..", "markdown", "premium", "premium.md")).toString();
  res.render("premium", { md: text => {
    return converter.makeHtml(text);
  }, user: {}, premium});
});

router.get("/premium/checkout", (req, res) => {
  res.render("premiumcheckout", { md: text => {
    return converter.makeHtml(text);
  }, user: {}});
});

router.get("/dashboard", authUser, async (req, res) => {

  let user_res;
  try {

    user_res = await axios({
      method: "get",
      url: "https://discordapp.com/api/v6/users/@me",
      headers: {
        Authorization: `Bearer ${req.session.discord.access_token}`
      }
    });
  } catch(err) {

    error(err);
    return res.json({ err: "error fetching discord data lol" });
  }

  res.render("dashboard/main", { user_data: user_res.data });
});

/*
router.get("/dashboard/scripts/editor", authUser, (req, res) => {
    res.render("dashboard/editor");
});
*/

router.get("/dashboard/scripts/marketplace", authUser, async (req, res) => {

  let user_res;
  try {

    user_res = await axios({
      method: "get",
      url: "https://discordapp.com/api/v6/users/@me",
      headers: {
        Authorization: `Bearer ${req.session.discord.access_token}`
      }
    });
  } catch(err) {

    error(err);
    return res.json({ err: "error fetching discord data lol" });
  }

  res.render("dashboard/marketplace", { user_data: user_res.data });
});

router.get("/dashboard/legacy/leaderboards/v1", authUser, async (req, res) => {

  let v1;
  try {

    v1 = JSON.parse(fs.readFileSync(path.join(__dirname, "json", "v1.json")));
  } catch (err) {

    error(`Could not read config file: ${err}`);
    process.exit(-1);
  }

  res.render("dashboard/legacy-leaderboards", {v1:JSON.stringify(v1)});
});

router.get("/dashboard/legacy/leaderboards/v2", authUser, async (req, res) => {

  let v2;
  try {

    v2 = JSON.parse(fs.readFileSync(path.join(__dirname, "json", "v2.json")));
  } catch (err) {

    error(`Could not read config file: ${err}`);
    process.exit(-1);
  }
  res.render("dashboard/legacy-leaderboards-2", {v2:JSON.stringify(v2)});
});

router.get("/dashboard/commands", authUser, (req, res) => {

  res.render("dashboard/commands");
});

router.get("/dashboard/legacy/bindings", authUser, (req, res) => {

  res.render("dashboard/legacy-bindings");
});

router.get("/dashboard/leaderboards", authUser, (req, res) => {

  res.render("dashboard/leaderboards");
});

router.get("/dashboard/scripts/editor/advanced", authUser, (req, res) => {

  res.render("dashboard/userscripts");
});

router.get("/dashboard/scripts/editor/basic", authUser, (req, res) => {

  res.render("dashboard/userscripts-basic");
});

router.get("/dashboard/patrons/script-manager", authPremium, (req, res) => {

  res.render("dashboard/scriptmanager");
});

router.get("/dashboard/patrons/server-manager", authPremium, (req, res) => {

  res.render("dashboard/patrons", { md: text => {
    return converter.makeHtml(text);
  }});
});

router.get("/dragonsplayroom", authUser, (req, res) => {

  res.render("dumbshit/dragonsplayroom");
});

router.get("/token", authAdmin, (req, res) => {

  res.render("token", { token: req.cookies.session });
});

module.exports = router;
