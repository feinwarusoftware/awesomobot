"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const permNodeSchema = new mongoose_1.Schema({
    whitelist: { type: Boolean, default: false },
    list: [String]
}, {
    _id: false
});
const ScriptPermSchema = new mongoose_1.Schema({
    enabled: { type: Boolean, default: false },
    members: permNodeSchema,
    channels: permNodeSchema,
    roles: permNodeSchema
}, {
    _id: false
});
exports.default = ScriptPermSchema;
//# sourceMappingURL=guildScriptPerms.js.map