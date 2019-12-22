"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema_1 = require("../schema");
exports.default = mongoose_1.model("GuildScript", schema_1.GuildScriptSchema);
