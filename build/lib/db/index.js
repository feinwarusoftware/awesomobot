"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo = __importStar(require("./mongo"));
// const databaseType = process.env.DATABASE_TYPE;
// const services = {
//   guildService: {},
//   guildScriptService: {},
//   scriptService: {},
//   sessionService: {},
//   userService: {},
// };
// switch (databaseType) {
// case "MONGODB": {
//   services.guildService = mongo.helpers.guildHelpers;
//   services.guildScriptService = mongo.helpers.guildScriptHelpers;
//   services.scriptService = mongo.helpers.scriptHelpers;
//   services.sessionService = mongo.helpers.sessionHelpers;
//   services.userService = mongo.helpers.userHelpers;
//   break;
// }
// default: {
//   console.error(`Unsupported or unspecified database type: ${databaseType}`);
//   process.exit(-1);
// }
// }
// export default services;
// TODO: make the above this work instead of this shitty temp workaround
const guildService = mongo.helpers.guildHelpers;
exports.guildService = guildService;
const guildScriptService = mongo.helpers.guildScriptHelpers;
exports.guildScriptService = guildScriptService;
const scriptService = mongo.helpers.scriptHelpers;
exports.scriptService = scriptService;
const sessionService = mongo.helpers.sessionHelpers;
exports.sessionService = sessionService;
const userService = mongo.helpers.userHelpers;
exports.userService = userService;
