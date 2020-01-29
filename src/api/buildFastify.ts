import Fastify from "fastify";
import fastifyCookie from "fastify-cookie";

import routes from "./routes";

const cookieSecret = process.env.COOKIE_SECRET;

const buildFastify = (settings = {}) => {
  const fastify = Fastify(settings);

  fastify.register(fastifyCookie, {
    secret: cookieSecret,
  });
  fastify.register(routes, { prefix: "/" });

  return fastify;
};

export default buildFastify;
