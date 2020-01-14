"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const guildScriptPerms_1 = __importDefault(require("./guildScriptPerms"));
const GuildScriptSchema = new mongoose_1.Schema({
    object_id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    permissions: guildScriptPerms_1.default
}, {
    _id: false
});
exports.default = GuildScriptSchema;
//# sourceMappingURL=guildScript.js.map