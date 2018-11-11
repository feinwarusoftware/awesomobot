"use strict";

const { ScriptSchema } = require("../db");

const { getFilePathsInDir } = require("./misc");

const loadGuildScripts = guild => {
    return new Promise(async (resolve, reject) => {

        let guildScripts;
        try {
            guildScripts = await ScriptSchema.find({ _id: { $in: guild.scripts.map(e => e.object_id) } });

        } catch(err) {

            reject(err);
        }

        resolve(guildScripts);
    });
}

const loadLocalScripts = dir => {
    return new Promise(async (resolve, reject) => {

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

        let dbScripts;
        try {

            dbScripts = await ScriptSchema.find({ local: true, name: { $in: scripts.map(e => e.name) } });

        } catch(err) {

            return reject(err);
        }

        const promises = [];

        for (let script of scripts) {

            const dbScript = dbScripts.find(e => e.name === script.name);
            if (dbScript == null) {

                const newScript = new ScriptSchema({

                    ...script,
                    
                    author_id: "feinwaru-devs",

                    code: null,
                    data: null,

                    local: true,
                    verified: true,
                    likes: 0,
                    guild_count: 0,
                    use_count: 0,

                    created_with: "vscode"
                });

                dbScripts.push(newScript);

                return promises.push(newScript.save());
            }

            let options = {};
            for (let prop in script) {

                if (dbScript[prop] !== script[prop]) {

                    options[prop] = script[prop];
                }
            }

            if (Object.keys(options).length !== 0) {

                promises.push(dbScript.updateOne(options));
            }

            promises.push(script.startup());
        }

        try {
            await Promise.all(promises);

        } catch(err) {

            reject(err);
        }

        resolve(scripts, dbScripts);
    });
}

module.exports = {

    loadGuildScripts,
    loadLocalScripts
};
