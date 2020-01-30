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
const path_1 = __importDefault(require("path"));
const fastify_1 = __importDefault(require("fastify"));
const fastify_cookie_1 = __importDefault(require("fastify-cookie"));
const fastify_nextjs_1 = __importDefault(require("fastify-nextjs"));
const routes_1 = __importDefault(require("./routes"));
const cookieSecret = process.env.COOKIE_SECRET;
const buildFastify = (settings = {}) => {
    const fastify = fastify_1.default(settings);
    fastify.register(fastify_cookie_1.default, {
        secret: cookieSecret,
    });
    fastify.register(fastify_nextjs_1.default, {
        dir: path_1.default.resolve(__dirname, "..", "..", "src", "web"),
    }).after(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("***********************???");
    }));
    fastify.register(routes_1.default, { prefix: "/" });
    return fastify;
};
exports.default = buildFastify;
//# sourceMappingURL=buildFastify.js.map