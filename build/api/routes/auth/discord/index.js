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
const fastify_oauth2_1 = __importDefault(require("fastify-oauth2"));
const helpers_1 = require("../../../helpers");
const discordId = process.env.DISCORD_BOT_ID;
const discordSecret = process.env.DISCORD_BOT_SECRET;
const discordCallback = process.env.DISCORD_BOT_CALLBACK;
exports.default = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.register(fastify_oauth2_1.default, {
        name: "discordOAuth2",
        credentials: {
            client: {
                id: discordId,
                secret: discordSecret,
            },
            auth: {
                authorizeHost: "https://discordapp.com",
                authorizePath: "/api/v6/oauth2/authorize",
                tokenHost: "https://discordapp.com",
                tokenPath: "/api/v6/oauth2/token",
            }
        },
        startRedirectPath: "/",
        callbackUri: discordCallback,
        scope: "guilds.join identify",
    });
    fastify.get("/callback", function (request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.discordOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
            Reflect.deleteProperty(token, "iat");
            const user = yield helpers_1.fetchDiscordUser(token.access_token);
            // For maxAge; use the discord expires_in date (provided in seconds)
            // and take an hour away just to be sure (discord doesnt document
            // how strict they are with this)
            response.setCookie("session", helpers_1.jwtSign(Object.assign({ id: user.id }, token)), {
                maxAge: token.expires_in - 60,
                httpOnly: true,
                sameSite: true,
                path: "/",
            });
            response.redirect("/");
        });
    });
});
//# sourceMappingURL=index.js.map