"use strict";

const { UserSchema } = require("../db");

const loadUser = id => {
    return new Promise(async (resolve, reject) => {

        let dbUser;
        try {
            dbUser = await UserSchema.findOne({ discord_id: id });

        } catch(err) {

            return reject(err);
        }

        if (dbUser == null) {

            const newUser = new UserSchema({
                
                discord_id: id
            });

            dbUser = newUser;

            try {
                await newUser.save();

            } catch(err) {

                return reject(err);
            }
        }

        resolve(dbUser);
    });
}

module.exports = {

    loadUser
};
