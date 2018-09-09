"use strict"

const yt = require("ytdl-core");
const search = require("youtube-search");

const config = require("../../../config.json");

const Command = require("../command");

const ytOptions = {
    maxResults: 1,
    key: config.yt_key
};

const ytGetInfo = url => {
    return new Promise((resolve, reject) => {

        yt.getInfo(url, (error, info) => {
            if (error === null || error === undefined) {

                return resolve(info);
            }

            reject(error);
        });
    });
}

const ytSearch = query => {
    return new Promise((resolve, reject) => {

        search(query, ytOptions, (error, results) => {
            if (error === null || error === undefined) {

                return resolve(results);
            }

            reject(error);
        });
    });
}

const queues = [];

const getQueue = message => {

    for (let i = 0; i < queues.length; i++) {

        if (queues[i].guildId === message.guild.id) {

            return queues[i];
        }
    }

    return null;
}

const pushQueue = (message, options) => {

    let found = false;
    for (let i = 0; i < queues.length; i++) {

        if (queues[i].guildId === message.guild.id) {

            found = true;

            queues[i].list.push(options);

            message.reply(`added ${options.title} to the queue`);

            break;
        }
    }

    if (found === false) {

        const queue = {
            guildId: message.guild.id,
            list: [options],
            current: null,
            dispatcher: null
        };

        queues.push(queue);

        message.reply(`added ${options.title} to the queue`);

        playQueue(message, queue);
    }
}

const playQueue = (message, queue) => {

    queue.current = queue.list.shift();
    message.channel.send(`now playing: '${queue.current.title}'`);

    queue.dispatcher = message.guild.voiceConnection.playStream(yt(queue.current.url, { audioonly: true }), { passes: 2 });

    queue.dispatcher.on("end", () => {

        if (queue.list.length === 0) {

            queue.current = null;
            queue.dispatcher = null;

            for (let i = 0; i < queues.length; i++) {

                if (queues[i].guildId === queue.guildId) {

                    queues.splice(i, 1);

                    break;
                }
            }

            message.channel.send("there is nothing left in the queue, disconnecting...");
            return message.guild.voiceConnection.disconnect();
        }

        playQueue(message, queue);
    });

    queue.dispatcher.on("error", error => {

        message.channel.send(`queue oof: ${error}`);
    });
}

const wink = new Command({
    
    name: "AWESOM-O Music",
    description: "*temp*",
    thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/487658989069402112/pjiicjez.png",
    marketplace_enabled: true,

    type: "js",
    match_type: "command",
    match: "play;leave;np;skip;seek;remove;loopqueue;search;loop;join;resume;move;forward;skipto;clear;replay;clean;pause;removedupes;volume;rewind;playtop;playskip;shuffle;queue",

    featured: false,

    cb: function(client, message, guild, user, script, match) {

        //* 0 - play
        //* 1 - leave
        //* 2 - np
        //* 3 - skip
        // 4 - seek
        // 5 - remove
        // 6 - loopqueue
        // 7 - search
        // 8 - loop
        //* 9 - join
        // 10 - resume
        // 11 - move
        // 12 - forward
        // 13 - skipto
        // 14 - clear
        // 15 - replay
        // 16 - clean
        // 17 - pause
        // 18 - removedupes
        // 19 - volume
        // 20 - rewind
        // 21 - playtop
        // 22 - playskip
        // 23 - shuffle
        // 24 - queue
        // 25 - (lyrics)

        const args = message.content.split(" ");

        if (match === 0) {

            if (message.member.voiceChannel === undefined) {

                return message.reply("you need to be in a voice channel");
            }

            if (message.guild.voiceConnection === null) {

                return message.reply("the bot is not in a voice channel");
            }

            if (message.member.voiceChannel.id !== message.guild.voiceConnection.channel.id) {

                return message.reply("you need to be in the same voice channel as the bot");
            }

            if (args[1] === undefined) {

                return message.reply("you need to specify a url");
            }

            if (args[1].startsWith("https://")) {

                ytGetInfo(args[1])
                    .then(info => {

                        pushQueue(message, {
                            url: info.video_url,
                            title: info.title,
                            requester: message.author.id
                        });
                    })
                    .catch(error => {

                        message.reply(`error getting youtube song info: ${error}`);
                    });
            } else {

                args.shift();

                ytSearch(args.join(" "))
                    .then(results => {

                        pushQueue(message, {
                            url: results[0].link,
                            title: results[0].title,
                            requester: message.author.id
                        });
                    })
                    .catch(error => {

                        message.reply(`error searching youtube api: ${error}`);
                    });
            }
        }

        if (match === 1) {

            if (message.guild.voiceConnection === null) {

                return message.reply("the bot is not in a voice channel");
            }

            message.guild.voiceConnection.disconnect();

            message.reply("successfully left the voice channel");
        }

        if (match === 2) {

            if (message.guild.voiceConnection === null) {

                return message.reply("the bot is not in a voice channel");
            }

            const queue = getQueue(message);

            if (queue.current === null) {

                return message.reply("the bot is not playing anything");
            }

            message.reply(`currently playing: '${queue.current.title}'`);
        }

        if (match === 3) {

            if (message.guild.voiceConnection === null) {

                return message.reply("the bot is not in a voice channel");
            }

            const queue = getQueue(message);

            if (queue.current === null) {

                return message.reply("the bot is not playing anything");
            }

            message.reply(`skipping: '${queue.current.title}'`);

            queue.dispatcher.end();
        }

        if (match === 4) {

        }

        if (match === 5) {

        }

        if (match === 6) {

        }

        if (match === 7) {

        }

        if (match === 8) {

        }

        if (match === 9) {

            if (message.member.voiceChannel === undefined) {

                return message.reply("you need to be in a voice channel");
            }

            if (message.guild.voiceConnection !== null) {

                return message.reply("the bot is already in a voice channel");
            }

            message.member.voiceChannel
                .join()
                .then(() => {

                    message.reply("successfully joined the voice channel");
                })
                .catch(error => {

                    message.reply(`could not join the voice channel: ${error}`);
                });
        }

        if (match === 10) {

        }

        if (match === 11) {

        }

        if (match === 12) {

        }

        if (match === 13) {

        }

        if (match === 14) {

        }

        if (match === 15) {

        }

        if (match === 16) {

        }

        if (match === 17) {

        }

        if (match === 18) {

        }

        if (match === 19) {

        }

        if (match === 20) {

        }

        if (match === 21) {

        }

        if (match === 22) {

        }

        if (match === 23) {

        }

        if (match === 24) {

        }

        if (match === 25) {

        }
    }
});

module.exports = wink;
