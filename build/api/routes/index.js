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
const middleware_1 = require("../middleware");
const v3_1 = __importDefault(require("./api/v3"));
const discord_1 = __importDefault(require("./auth/discord"));
exports.default = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.register(fastify_cookie_1.default, { secret: "rawrxd" });
    fastify.register(v3_1.default, { prefix: "/api/v3" });
    fastify.register(discord_1.default, { prefix: "/auth/discord" });
    fastify.get("/", () => __awaiter(void 0, void 0, void 0, function* () { return "rawrxd"; }));
    fastify.get("/p", { preHandler: middleware_1.verifyDiscordAuth }, function () {
        return __awaiter(this, void 0, void 0, function* () {
            return this.session;
        });
    });
});
//# sourceMappingURL=index.js.map