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
const fastify_cookie_1 = __importDefault(require("fastify-cookie"));
const fastify_static_1 = __importDefault(require("fastify-static"));
const path_1 = __importDefault(require("path"));
const middleware_1 = require("../middleware");
const v3_1 = __importDefault(require("./api/v3"));
const vn_1 = __importDefault(require("./api/vn"));
const discord_1 = __importDefault(require("./auth/discord"));
exports.default = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.register(fastify_cookie_1.default, { secret: "rawrxd" });
    fastify.register(fastify_static_1.default, {
        root: path_1.default.join(__dirname, "..", "temp"),
    });
    fastify.register(v3_1.default, { prefix: "/api/v3" });
    fastify.register(vn_1.default, { prefix: "/api/vn" });
    fastify.register(discord_1.default, { prefix: "/auth/discord" });
    fastify.get("/", (request, reply) => __awaiter(void 0, void 0, void 0, function* () { return reply.sendFile("index.html"); }));
    fastify.get("/p", { preHandler: middleware_1.verifyDiscordAuth }, function () {
        return __awaiter(this, void 0, void 0, function* () {
            return this.session;
        });
    });
});
//# sourceMappingURL=index.js.map