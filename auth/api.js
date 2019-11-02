"use strict";

const { sessions } = require("./store");

module.exports = function (fastify, options, next) {
  fastify.addHook("preHandler", async (request, response) => {
    // needs callback function as request.session can be null
    // will throw an error otherwise as it thinks the null is a cb
    if (sessions.find(e => e === request.session) == null) {
      return response.send({
        error: "not logged in or invalid session",
        sessions,
        current: request.session,
        cookies: request.cookies
      });
    }
  });

  fastify.get("/", async (request, response) => {
    return {
      info: "ok",
      ver: "4"
    };
  });

  return next();
};
