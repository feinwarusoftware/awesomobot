import Fastify from "fastify";
import fastifyCookie from "fastify-cookie";

import routes from "./routes";

const kTempCookieSecret = "rawrxd";

const buildFastify = (settings = {}) => {
  const fastify = Fastify(settings);

  fastify.register(fastifyCookie, {
    secret: kTempCookieSecret,
  });
  fastify.register(routes, { prefix: "/" });

  return fastify;
};

export default buildFastify;
