# Probably Incomplete Guide

Heres how you actually get this thing running. Probably a horribly incomplete guide. If you find that something is missing, please add an issue to our repo and we will try to fix it as soon as we can.
But seriously, we're still working on this and it'll probably change completely in the next update.

## What you need:
- windows or linux (tested on windows 10 and ubuntu 18 lts)
- node 10.x or higher and npm
- c++ build tools and python OR windows-build-tools (npm module)
- git
- bash (git bash works)
- probably python (at least on linux cos otherwise sharp wont build, if it tells you that you can use any python version, thats a lie, just install them all to be sure)
- mongodb 3.x or higher (tested on 4.x as well)
- mongodb compass (only for development)
- a web browser (preferrably firefox for the pretty json parsing)
- a rest client (we use insomnia)
- discord (duh)
- a text editor or ide (vscode recommended)
- ability to debug and use google if something goes wrong

## Installing:
- run npm i in the root directory
- fill out the config json file

The following are required for the bot module:
1. discord_token - your [discord bot token](https://discordapp.com/developers/applications/)
1. fm_key - your [last fm api key](https://www.last.fm/api)
1. mongo_user - set this to null for development and (for production) to your mongodb username if you have one
1. mongo_pass - set this to null for development and (for production) to your mongodb password if you have one

The following are *extra* requirements for the web module:
1. port - the port that you want to run the webserver on
1. cookie_secret - the secret used to parse and encode cookies :cookie:
1. jwt_secret - the secret used to parse and encode json web tokens (used by our api)
1. uptime_key - the [uptime robot api key](https://uptimerobot.com/api)
1. discord_id - your [discord bot id](https://discordapp.com/developers/applications/)
1. discord_secret - your [discord bot secret](https://discordapp.com/developers/applications/)
1. discord_redirect - the page where you plan to handle discord oauth redirects (set it to http://localhost/auth/discord/callback for development)
```json
{
  "discord_token": "discord_token",
  "fm_key": "fm_key",
  "mongo_user": null,
  "mongo_pass": null,

  "port": 80,
  "cookie_secret": "cookie_secret",
  "jwt_secret": "jwt_token",
  "uptime_key": "uptime_key",
  "discord_id": "discord_id",
  "discord_secret": "discord_secret",
  "discord_redirect": "http://localhost/auth/discord/callback"
}

```
- you need to additionally configure your bot if you are using the web module

1. go to [your bot page](https://discordapp.com/developers/applications/)
1. select the bot that you want to configure
1. under OAuth2 add a redirect that *exactly* matches the discord_redirect field in the json
1. dont forget to save your settings

- youre done, its that easy!


## Running:
- start mongodb (you may need to create a /data/db path on your main drive if you are using on windows)
- run node . in the root directory OR if you want to start individual modules, navigate to the module directory and run node . in there.

## Notes:
- this guide may be incomplete
- this guide only contains instructions on how to set up the bot for development purposes (please dont run it like this in production!)
- please read through the contributing section if you intend to contribute code to our cause

## FAQ
Q. Who/what is Feinwaru?

A. matt pls help

***
Q. Why don't you run tests?

A. Soon:tm:

***
Q. Why is eslint highlighting x in red.

A. I haven't finished setting up the eslint config, please let me know what it is as it probably needs to be fixed.

***
Q. What does x mean?

A. If it's a thing specific to this bot, please open an issue, otherwise, google.

***
Q. Do you have a discord server?

A. [Yes, yes we do.](https://discord.feinwaru.com)

***
Q. How can I get AWESOM-O on my server.

A. You can either run it yourself (please ask us first), or [add the bot to your server](ask_matt_for_link). Please note that, currently, all bot features are exclusive to our [patreon supporters](https://www.patreon.com/awesomo), although that will probably change in the future.

***
Q. How can I support you guys for putting thousands of hours into a project that you're not being paid for?

A. You can visit our patreon page. We appreciate any little bit you can give, and of course, well give you some cool perks as thanks! If you've got programming experience, you can also [contribute some code](link_pending) to our cause.
