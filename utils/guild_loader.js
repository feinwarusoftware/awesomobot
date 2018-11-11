"use strict";

const { GuildSchema, ScriptSchema } = require("../db");

const loadGuilds = ids => {
    return new Promise(async (resolve, reject) => {

        const promises = [];

        let dbGuilds;
        try {
            dbGuilds = await GuildSchema.find({ discord_id: { $in: ids } });
    
        } catch(err) {
    
            return reject(err);
        }

        let dbScripts;

        for (let id of ids) {

            const dbGuild = dbGuilds.find(e => e.discord_id === id);
            if (dbGuild == null) {

                if (dbScripts == null) {

                    try {
                        dbScripts = await ScriptSchema.find({ preload: true });
            
                    } catch(err) {
            
                        return reject(err);
                    }
                }

                const newGuild = new GuildSchema({
                
                    discord_id: id,
                    scripts: {
                        
                        object_id: dbScripts.map(e => e._id)
                    }
                });

                dbGuilds.push(dbGuild);

                promises.push(newGuild.save());

                for (let dbScript of dbScripts) {

                    dbScript.guild_count++;
    
                    promises.push(dbScript.updateOne({ $inc: { guild_count: 1 } }));
                }
            }
        }

        try {
            await Promise.all(promises);

        } catch(err) {

            reject(err);
        }

        resolve(dbGuilds);
    });
}

const loadGuild = id => {
    return new Promise(async (resolve, reject) => {

        const promises = [];

        let dbGuild;
        try {
            dbGuild = await GuildSchema.findOne({ discord_id: id });
    
        } catch(err) {
    
            return reject(err);
        }

        let dbScripts;

        if (dbGuild == null) {

            try {
                dbScripts = await ScriptSchema.find({ preload: true });
    
            } catch(err) {
    
                return reject(err);
            }

            const newGuild = new GuildSchema({
                
                discord_id: id,
                scripts: {
                    
                    object_id: dbScripts.map(e => e._id)
                }
            });

            dbGuild = newGuild;

            promises.push(newGuild.save());

            for (let dbScript of dbScripts) {

                dbScript.guild_count++;

                promises.push(dbScript.updateOne({ $inc: { guild_count: 1 } }));
            }
        }

        try {
            await Promise.all(promises);

        } catch(err) {

            reject(err);
        }

        resolve(dbGuild);
    });
}

module.exports = {

    loadGuilds,
    loadGuild
};
