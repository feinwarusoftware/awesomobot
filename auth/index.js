"use strict";

const fastify = require("fastify")({ logger: true });
const fetch = require("node-fetch");

const api = require("./api")

const { sessions } = require("./store");

const authServerAddr = "http://qa-dragon.feinwaru.com";

// decorators
fastify.decorateRequest("cookies", []);
fastify.decorateRequest("session", null);

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

// api routes
fastify.register(api, {
  prefix: "/api/v4"
});

// test route
fastify.get("/", async (request, response) => {
  return {
    info: "ok",
    cookies: request.cookies,
    session: request.session
  };
});

// login route
fastify.get("/login", async (request, response) => {
  if (request.query.globalSession != null) {
    // check global session validity
    // establish local session
    try {
      const authRes = fetch(`${authServerAddr}/verifySession`, {
          method: "post"
        })
        .then(res => res.json())

      if (authRes.error != null) {
        return {
          error: "invalid global token"
        }
      }
    } catch(error) {
      return {
        error: "something went fucky wucky while verifying the global token"
      }
    }

    // the global session is ok
    // create the local session
    sessions.push(request.query.globalSession + "123");

    response.header("Set-Cookie", `session=${request.query.globalSession + "123"}`);

    response.redirect("/api/v4");
  }

  return response.redirect(`${authServerAddr}/login`);
});

(async () => {
  try {
    await fastify.listen(5000);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
