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
Object.defineProperty(exports, "__esModule", { value: true });
// import { userService } from "../../../../lib/db";
const client_1 = require("../../../../bot/client");
exports.default = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get("/", () => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            info: "awesomo next:tm: api (hence vn)",
        });
    }));
    fastify.get("/guilds", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const { query, limit } = request.query;
        const guilds = yield client_1.fetchGuilds(query, limit);
        return guilds.map(e => ({
            id: e.id,
            name: e.name,
        }));
    }));
    fastify.get("/guilds/:guildId/members", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const { guildId } = request.params;
        const { query, limit } = request.query;
        const members = yield client_1.fetchMembers(guildId, query, limit);
        return members.map(e => ({
            id: e.id,
            nickname: e.nickname,
            user: {
                username: e.user.username,
                displayAvatarURL: e.user.displayAvatarURL,
            },
        }));
    }));
    fastify.get("/guilds/:guildId/channels/:channelId/messages/fetch", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const { guildId, channelId } = request.params;
        const { count } = request.query;
        client_1.fetchMessages(guildId, channelId, count);
        return {
            ok: true,
        };
    }));
    fastify.get("/guilds/:guildId/channels/:channelId/messages/status", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const { guildId, channelId } = request.params;
        return {
            ok: true,
        };
    }));
    fastify.get("/guilds/:guildId/channels/:channelId/messages", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const { guildId, channelId } = request.params;
        const messages = yield client_1.retrieveMessages(guildId, channelId);
        return messages.map(e => ({
            id: e.id,
            createdAt: e.createdAt,
        }));
    }));
});
//# sourceMappingURL=index.js.map