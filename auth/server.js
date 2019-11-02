"use strict";

const fastify = require("fastify")({ logger: true });

const globalSessions = [];

// get all the cookies
fastify.addHook("preHandler", async (request, response) => {
  const cookieHeader = request.headers.cookie;
  if (cookieHeader == null) {
    request.cookies = [];
    return;
  }

  request.cookies = cookieHeader.split("; ").reduce((a, b) => {
    const keyVal = b.split("=");
    return [
      ...a,
      {
        name: keyVal[0],
        value: keyVal[1]
      }
    ];
  }, []);
});

// get our session
fastify.addHook("preHandler", async (request, response) => {
  const sessionCookie = request.cookies.find(e => e.name === "session");
  if (sessionCookie == null) {
    request.session = null;
    return;
  }

  // laying it out like this as well need to do more with
  // the session cookie value when doing this properly
  request.session = sessionCookie.value;
});

// called by the individual services
fastify.post("/verifySession", async (request, response) => {
  if (request.query.globalSession == null) {
    return {
      error: "server: globalSession not set"
    };
  }

  const currentGlobalSession = globalSessions.find(e => e.id === request.query.globalSession);
  if (currentGlobalSession == null) {
    return {
      error: "server: globalSession invalid"
    };
  }

  return {
    info: "ok",
    code: currentGlobalSession.code
  };
});

// called by the user
fastify.get("/login", async (request, response) => {
  // set up in this way as well be adding more login options,
  // for example a user and pass combo

  // check if global session already exists
  // if so, no need to log in again
  console.log(request.session);
  console.log(globalSessions);
  const existingGlobalSession = globalSessions.find(e => e.id === request.session);
  if (existingGlobalSession != null) {
    return response.redirect(`http://localhost:5000/login?globalSession=${existingGlobalSession.id}`);
  }

  return response.redirect(`https://discordapp.com/api/v6/oauth2/authorize?client_id=${"372462428690055169"}&redirect_uri=${encodeURIComponent("http://qa-dragon.feinwaru.com/redirect")}&response_type=code&scope=guilds.join%20identify`);
});

fastify.get("/redirect", async (request, response) => {
  // get login info either from the 

  // dont kill me pls
  const globalSessionId = String(Math.random()).slice(2, 8);
  globalSessions.push({
    id: globalSessionId,
    code: request.query.code
  });

  response.header("Set-Cookie", `session=${globalSessionId}`);

  return response.redirect(`http://localhost:5000/login?globalSession=${globalSessionId}`);
});

(async () => {
  try {
    await fastify.listen(80, "0.0.0.0");
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
