import { connect as connectDb } from "../lib/db";
import buildFastify from "./buildFastify";

const port = process.env.WEBSERVER_PORT;

const config = {
  webServerSettings: {
    logger: true,
  },
  port,
  address: "0.0.0.0",
  database: "awnext",
};

const start = async () => {
  const server = buildFastify(config.webServerSettings);

  try {
    await connectDb(config.database);
    await server.listen(config.port, config.address);
    server.log.info(`magic happens on port ${config.webServerSettings}`);
  } catch (error) {
    server.log.error(error);
    process.exit(-1);
  }
};

start();
