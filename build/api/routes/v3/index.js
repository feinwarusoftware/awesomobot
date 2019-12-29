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
const fastify_gql_1 = __importDefault(require("fastify-gql"));
const handlers_1 = require("./handlers");
const graphql_1 = require("./graphql");
const resolvers = {
    Query: {
        test: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () { return input; }),
    },
    Mutation: {
        test: (_, { input }) => __awaiter(void 0, void 0, void 0, function* () { return input; }),
    },
};
exports.default = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.register(handlers_1.guildHandler, { prefix: "/guilds" });
    fastify.register(handlers_1.guildScriptHandler, { prefix: "/guilds/:guildId/scripts" });
    fastify.register(handlers_1.scriptHandler, { prefix: "/scripts" });
    fastify.register(handlers_1.userHandler, { prefix: "/users" });
    fastify.register(fastify_gql_1.default, { schema: graphql_1.schema, resolvers });
    fastify.post("/gql", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = request.body;
        return reply.graphql(query);
    }));
    fastify.get("/test", () => __awaiter(void 0, void 0, void 0, function* () { return ({ urma: true }); }));
});
//# sourceMappingURL=index.js.map