import * as mongo from "./mongo";

const databaseType = process.env.DATABASE_TYPE;

const services = {
  guildService: {},
  guildScriptService: {},
  scriptService: {},
  sessionService: {},
  userService: {},
};

switch (databaseType) {
case "MONGODB": {
  services.guildService = mongo.helpers.guildHelpers;
  services.guildScriptService = mongo.helpers.guildScriptHelpers;
  services.scriptService = mongo.helpers.scriptHelpers;
  services.sessionService = mongo.helpers.sessionHelpers;
  services.userService = mongo.helpers.userHelpers;
  break;
}
default: {
  console.error(`Unsupported or unspecified database type: ${databaseType}`);
  process.exit(-1);
}
}

export default services;
