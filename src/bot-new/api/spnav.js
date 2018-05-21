"use strict";

const wikia = require("./wikia");
const wiki = require("./wikipedia");

const utils = require("../utils");

function wikiaSearch(query) {
    return new Promise((resolve, reject) => {
        wikia.search({
            query: query,
            limit: 5
        }).then(page => {
            if (page === undefined || page.exception !== undefined) {
                //message.reply(`the wikia api shit itself at 'search' trying to look up: ${query}`);
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
                    //message.reply(`the wikia api shit itself at 'simpleJson' trying to look up: ${query}`);
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
                        //message.reply(`the wikia api shit itself at 'articleDetails' trying to look up: ${query}`);
                        reject(`the wikia api shit itself at 'articleDetails' trying to look up: ${query}`);
                    }
    
                    let thumbnail = detail.items[id].thumbnail;

                    if (thumbnail === null) {
                        thumbnail = "https://media.tenor.com/images/1317831d21cd4cf6e57f34a86b46a821/tenor.gif";
                    }

                    resolve({title, url, desc, thumbnail});
    
                }).catch(error => {
                    //message.reply(`error searching wikia 'articleDetails' for: ${query}, throwing error: ${error}`);
                    reject(`error searching wikia 'articleDetails' for: ${query}, throwing error: ${error}`);
                });
    
            }).catch(error => {
                //message.reply(`error searching wikia at 'simpleJson' for: ${query}, throwing error: ${error}`);
                reject(`error searching wikia at 'simpleJson' for: ${query}, throwing error: ${error}`);
            });
    
        }).catch(error => {
            //message.reply(`error searching wikia at 'search' for: ${query}, throwing error: ${error}`);
            reject(`error searching wikia at 'search' for: ${query}, throwing error: ${error}`);
        });
    });
}

function getEpList() {
    return new Promise((resolve, reject) => {
        wiki.pageAsJson({
            titles: "List_of_South_Park_episodes"
        }).then(data => {
            data = JSON.stringify(data);

            let spos = utils.allIndicesOf(data, "[[#Season ");
            let seasons = [];
            for (let i = 0; i < spos.length; i++) {
                spos[i] += 10;
                seasons[i] = data.substring(spos[i], spos[i] + (data.substring(spos[i] + 1, spos[i] + 2) == " " ? 1 : 2));
            }

            let pagePromises = [];
            for (let i = 0; i < seasons.length; i++) {
                pagePromises.push(wiki.pageAsJson({ titles: ("South_Park_(season_" + seasons[i] + ")") }));
            }

            Promise.all(pagePromises).then(data => {
                let hopefulleAllEpisodes = [];

                for (let i = 0; i < data.length; i++) {
                    data[i] = JSON.stringify(data[i]);

                    let epos = utils.allIndicesOf(data[i], "|Title = [[");
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
                            if (episodes[j].substring(0, Math.floor(episodes[j].length / 2)) == episodes[j].substring(Math.ceil(episodes[j].length / 2), episodes[j].length)) {
                                episodes[j] = episodes[j].substring(0, Math.floor(episodes[j].length / 2));
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
}

module.exports = {
    wikiaSearch,
    getEpList
}
