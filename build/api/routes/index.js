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
const v3_1 = __importDefault(require("./api/v3"));
// import apiVN from "./api/vn";
const discord_1 = __importDefault(require("./auth/discord"));
// const cookieSecret = process.env.COOKIE_SECRET;
exports.default = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    // doing cookie stuff in buildFastify.ts instead
    // fastify.register(fastifyCookie, { secret: cookieSecret });
    // fastify.register(fastifyStatic, {
    //   root: path.join(__dirname, "..", "temp"),
    // });
    fastify.register(v3_1.default, { prefix: "/api/v3" });
    // temp disabled for securoty reasons
    // fastify.register(apiVN, { prefix: "/api/vn" });
    fastify.register(discord_1.default, { prefix: "/auth/discord" });
    // fastify.get("/", async (request, reply) => reply.sendFile("index.html"));
    // fastify.get("/p", { preHandler: verifyDiscordAuth }, async function () {
    //   return this.session;
    // });
});
//# sourceMappingURL=index.js.map