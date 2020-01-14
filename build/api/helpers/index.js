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
// import { sessionService } from "../../lib/db";
const kTempJwtSecret = "rawrxd";
const kDiscordUserUrl = "https://discordapp.com/api/v6/users/@me";
const isString = (toCheck) => Object.prototype.toString.call(toCheck) === "[object String]";
//
const jwtSign = (payload, secret = kTempJwtSecret) => jsonwebtoken_1.default.sign(payload, secret);
exports.jwtSign = jwtSign;
const jwtVerify = (token, secret = kTempJwtSecret) => new Promise((resolve, reject) => {
    jsonwebtoken_1.default.verify(token, secret, (error, decoded) => {
        if (error == null) {
            return resolve(decoded);
        }
        return reject(error);
    });
});
exports.jwtVerify = jwtVerify;
// const fetchSession = (token: string, secret: string = kTempJwtSecret) => {
//   jwtVerify(token, secret)
//     .then(async decoded => {
//       if (isString("string")) {
//         throw new Error("session was a string, should be an object");
//       }
//       const decodedSession = decoded as ISession;
//       const session = await sessionService
//         .getOne({
//           discord: {
//             id: decodedSession.id,
//           },
//         });
//         return session;
//     });
// };
const decodeSession = (token, secret = kTempJwtSecret) => jwtVerify(token, secret)
    .then((decoded) => __awaiter(void 0, void 0, void 0, function* () {
    if (isString(decoded)) {
        throw new Error("session was a string, should be an object");
    }
    return decoded;
}));
exports.decodeSession = decodeSession;
const fetchDiscordUser = (accessToken) => {
    if (accessToken == null) {
        // fetch using client
        throw new Error("TODO: implement this!");
    }
    return node_fetch_1.default(kDiscordUserUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }).then(response => response.json());
};
exports.fetchDiscordUser = fetchDiscordUser;
//# sourceMappingURL=index.js.map