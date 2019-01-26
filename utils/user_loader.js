"use strict";

const { UserSchema } = require("../db");

const loadUser = id => {
  return new Promise((resolve, reject) => {

    UserSchema.findOne({ discord_id: id })
      .then(dbUser => {
        if (dbUser == null) {
          const newUser = new UserSchema({
            discord_id: id
          });
          newUser.save()
            .then(() => {
              resolve(newUser);
            })
            .catch(error => {
              reject(error);
            });
        }
        resolve(dbUser);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {

  loadUser
};
