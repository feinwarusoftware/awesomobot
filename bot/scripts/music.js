"use strict";

const yt = require("ytdl-core");
const search = require("youtube-search");

const Script = require("../script");

const config = require("../config.json");

const ytOptions = {
    maxResults: 1,
    key: config.yt_key
};

const ytGetInfo = url => {
    return new Promise((resolve, reject) => {

        yt.getInfo(url, (err, info) => {
            if (err != null) {

                return reject(err);
            }

            resolve(info);
        });
    });
}

const ytSearch = query => {
    return new Promise((resolve, reject) => {

        search(query, ytOptions, (err, results) => {
            if (err != null) {

                return reject(err);
            }

            resolve(results);
        });
    });
}

class QueueManager {
    constructor(guild) {

        this.guild = guild;
        this.queue = new Queue();

        this.current = null;
        this.dispatcher = null;
    }
    consumeQueue(channel) {

        if (this.current != null || this.queue.list.length === 0) {

            return;
        }

        this.playNext(channel);

        this.dispatcher.on("end", () => {

            this.current = null;
            this.dispatcher = null;

            this.consumeQueue(channel);
        });

        this.dispatcher.on("error", err => {

            channel.send(`error playing queue: ${err}`);
        });
    }
    async queueFront(channel, member, query) {

        let queued;
        try {
            queued = await this.queue.qunshift(member, query)

        } catch(err) {

            return channel.send(`error queueing song: author: ${queued.requester.user.username}, title: ${queued.title}, ${err}`);
        }

        channel.send(`queued song to front: author: ${queued.requester.user.username}, title: ${queued.title}`);

        queueManager.consumeQueue(channel);
    }
    async queueBack(channel, member, query) {

        let queued;
        try {
            queued = await this.queue.qpush(member, query);

        } catch(err) {

            return channel.send(`error queueing song: author: ${queued.requester.user.username}, title: ${queued.title}, ${err}`);
        }

        channel.send(`queued song: author: ${queued.requester.user.username}, title: ${queued.title}`);

        this.consumeQueue(channel);
    }
    playNext(channel) {

        this.current = this.queue.qshift();
        this.dispatcher = this.guild.voiceConnection.playStream(yt(this.current.url, { audioonly: true }), { passes: 2 });

        channel.send(`now playing: author: ${this.current.requester.user.username}, title: ${this.current.title}`);
    }
    skipCurrent(channel) {

        if (this.dispatcher != null) {

            this.dispatcher.end();

            return channel.send(`skipped song: author: ${this.current.requester.user.username}, title: ${this.current.title}`);
        }

        channel.send(`there is nothing in the queue to skip`);
    }
    clearQueue(channel) {

        this.queue = new Queue();

        channel.send(`cleared the queue`);
    }
    clearSkipQueue(channel) {

        this.clearQueue(channel);
        this.skipCurrent(channel);
    }
}

class Queue {
    constructor() {

        this.list = [];
    }
    ytLookup(query) {
        return new Promise(async (resolve, reject) => {

            if (query.startsWith("https://")) {

                let info;
                try {
                    info = await ytGetInfo(query);
    
                } catch(err) {
    
                    return reject(err);
                }

                resolve({

                    type: "url",
                    info
                });

            } else {

                let info;
                try {
                    info = await ytSearch(query);
    
                } catch(err) {
    
                    return reject(err);
                }
                
                resolve({

                    type: "query",
                    info
                });

            }
        });
    }
    qpush(member, query) {
        return new Promise(async (resolve, reject) => {

            let lookup;
            try {
                lookup = await this.ytLookup(query);

            } catch(err) {

                return reject(err);
            }

            let newElement;
            if (lookup.type === "url") {

                newElement = {

                    url: lookup.info.video_url,
                    title: lookup.info.title,
                    requester: member
                };

                this.list.push(newElement);

            } else {

                newElement = {

                    url: lookup.info[0].link,
                    title: lookup.info[0].title,
                    requester: member
                };

                this.list.push(newElement);
            }

            resolve(newElement);
        });
    }
    qunshift(member, query) {
        return new Promise(async (resolve, reject) => {

            let lookup;
            try {
                lookup = this.ytLookup(query);

            } catch(err) {

                return reject(err);
            }

            let newElement;
            if (lookup.type === "url") {

                newElement = {

                    url: info.video_url,
                    title: info.title,
                    requester: member
                };

                this.list.unshift(newElement);

            } else {

                newElement = {

                    url: results[0].link,
                    title: results[0].title,
                    requester: member
                };

                this.list.unshift(newElement);
            }

            resolve(newElement);
        });
    }
    qpop() {

        return this.list.pop();
    }
    qshift() {

        return this.list.shift();
    }
}

const queueManagers = [];

const music = new Script({

    name: "AWESOM-O Music",
    description: "*wip*",
    thumbnail: "https://media.discordapp.net/attachments/379432139856412682/504362169165414417/unknown.png?width=545&height=497",
    marketplace_enabled: false,

    type: "js",
    match_type: "command",
    match: "join;leave;play;skip;stop;np",

    featured: false,

    preload: false,

    cb: async function(client, message, guild, user, script, match) {

        if (match === "join") {

            if (message.member.voiceChannel == null) {

                return message.reply("you need to be in a voice channel");
            }

            if (message.guild.voiceConnection != null) {

                return message.reply("bot already in a voice channel");
            }

            try {
                await message.member.voiceChannel.join();

            } catch(err) {

                return message.reply(`error joining voice channel: ${err}`);
            }

            queueManagers.push(new QueueManager(message.guild));

            message.reply("successfully joined voice channel");
        }

        if (match === "leave") {

            if (message.member.voiceChannel == null) {

                return message.reply("you need to be in a voice channel");
            }

            if (message.guild.voiceConnection == null) {

                return message.reply("bot not in a voice channel");
            }

            const queueManager = queueManagers.find(e => e.guild.id === message.guild.id);

            queueManager.clearSkipQueue(message.channel);
            queueManagers.splice(queueManagers.indexOf(queueManager), 1);

            message.guild.voiceConnection.disconnect();

            message.channel.send("successfully left the voice channel");
        }

        if (match === "play") {

            if (message.member.voiceChannel == null) {

                return message.reply("you need to be in a voice channel");
            }

            if (message.guild.voiceConnection == null) {

                return message.reply("bot not in a voice channel");
            }

            const queueManager = queueManagers.find(e => e.guild.id === message.guild.id);

            queueManager.queueBack(message.channel, message.member, message.content.slice(guild.prefix.length + 5));
        }

        if (match === "skip") {

            if (message.member.voiceChannel == null) {

                return message.reply("you need to be in a voice channel");
            }

            if (message.guild.voiceConnection == null) {

                return message.reply("bot not in a voice channel");
            }

            const queueManager = queueManagers.find(e => e.guild.id === message.guild.id);

            queueManager.skipCurrent(message.channel);
        }

        if (match === "stop") {

            if (message.member.voiceChannel == null) {

                return message.reply("you need to be in a voice channel");
            }

            if (message.guild.voiceConnection == null) {

                return message.reply("bot not in a voice channel");
            }

            const queueManager = queueManagers.find(e => e.guild.id === message.guild.id);

            queueManager.clearSkipQueue(message.channel);
        }

        if (match === "np") {

            if (message.member.voiceChannel == null) {

                return message.reply("you need to be in a voice channel");
            }

            if (message.guild.voiceConnection == null) {

                return message.reply("bot not in a voice channel");
            }

            const queueManager = queueManagers.find(e => e.guild.id === message.guild.id);

            if (queueManager.current == null) {

                message.channel.send("currently not playing anything");

            } else {

                message.channel.send(`currently playing: ${queueManager.current.requester.user.username}, title: ${queueManager.current.title}`);
            }
        }
    },

    load: function() {
        return new Promise((resolve, reject) => {

            resolve();
        });
    }
});

module.exports = music;
