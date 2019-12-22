"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SessionSchema = new mongoose_1.Schema({
    //  _id: ObjectId,
    nonce: { type: String, default: null },
    complete: { type: Boolean, default: false },
    discord: {
        id: { type: String, default: null },
        access_token: { type: String, default: null },
        token_type: { type: String, default: null },
        expires_in: { type: String, default: null },
        refresh_token: { type: String, default: null },
        scope: { type: String, default: null }
    }
});
exports.default = SessionSchema;
