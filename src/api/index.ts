import fastify from "fastify";

import { connect as connectDb } from "../lib/db";
import routes from "./routes";

const config = {
  webServerSettings: {
    logger: true,
  },
  port: 80,
  database: "awnext",
};

const server = fastify(config.webServerSettings);

server.register(routes, { prefix: "/" });

const start = async () => {
  try {
    await connectDb(config.database);
    await server.listen(config.port);
    server.log.info(`magic happens on port ${config.webServerSettings}`);
  } catch (error) {
    server.log.error(error);
    process.exit(-1);
  }
};

start();
