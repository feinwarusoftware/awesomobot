const config = {
  webServerSettings: {
    logger: true,
  },
  port: 80,
};

const fastify = require("fastify")(config.webServerSettings);

fastify.register(require("./routes"), { prefix: "/" });

const start = async () => {
  try {
    await fastify.listen(config.port);
    fastify.log.info(`magic happens on port ${config.webServerSettings}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(-1);
  }
};

start();
