"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../lib/db");
const kTempJwtSecret = "rawrxd";
const jwtVerify = (token, secret) => new Promise((resolve, reject) => {
    jsonwebtoken_1.default.verify(token, secret, (error, decoded) => {
        if (error == null) {
            return resolve(decoded);
        }
        return reject(error);
    });
});
const fetchSession = (token) => {
    jwtVerify(token, kTempJwtSecret)
        .then((decoded) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield db_1.sessionService
            .getOne({
            discord: {
                id: decoded.id
            }
        });
        return session;
    }));
};
exports.fetchSession = fetchSession;
const fetchDiscordUser = (accessToken) => {
    node_fetch_1.default("https://discordapp.com/api/v6/users/@me", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }).then(response => response.json());
};
exports.fetchDiscordUser = fetchDiscordUser;
//# sourceMappingURL=index.js.map