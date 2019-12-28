"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GuildScriptPermsSchema = __importStar(require("./guildScriptPerms"));
const GuildScriptSchema = new mongoose_1.Schema({
    object_id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    permissions: GuildScriptPermsSchema
}, {
    _id: false
});
exports.default = GuildScriptSchema;
//# sourceMappingURL=guildScript.js.map