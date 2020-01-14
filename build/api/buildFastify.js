"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_cookie_1 = __importDefault(require("fastify-cookie"));
const routes_1 = __importDefault(require("./routes"));
const kTempCookieSecret = "rawrxd";
const buildFastify = (settings = {}) => {
    const fastify = fastify_1.default(settings);
    fastify.register(fastify_cookie_1.default, {
        secret: kTempCookieSecret,
    });
    fastify.register(routes_1.default, { prefix: "/" });
    return fastify;
};
exports.default = buildFastify;
//# sourceMappingURL=buildFastify.js.map