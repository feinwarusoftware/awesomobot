"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guilds_1 = __importDefault(require("./guilds"));
exports.guildHandler = guilds_1.default;
const guildScripts_1 = __importDefault(require("./guildScripts"));
exports.guildScriptHandler = guildScripts_1.default;
const scripts_1 = __importDefault(require("./scripts"));
exports.scriptHandler = scripts_1.default;
const users_1 = __importDefault(require("./users"));
exports.userHandler = users_1.default;
//# sourceMappingURL=index.js.map