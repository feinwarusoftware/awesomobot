"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guild_1 = __importDefault(require("./guild"));
const guildScript_1 = __importDefault(require("./guildScript"));
const script_1 = __importDefault(require("./script"));
const user_1 = __importDefault(require("./user"));
exports.default = {
    Query: Object.assign(Object.assign(Object.assign(Object.assign({}, guild_1.default.Query), guildScript_1.default.Query), script_1.default.Query), user_1.default.Query),
    Mutation: Object.assign(Object.assign(Object.assign(Object.assign({}, guild_1.default.Mutation), guildScript_1.default.Mutation), script_1.default.Mutation), user_1.default.Mutation),
};
//# sourceMappingURL=index.js.map