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
const db_1 = require("../../../../../lib/db");
const helpers_1 = require("../../../../helpers");
const middleware_1 = require("../../../../middleware");
exports.default = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get("/", () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield db_1.userService.getMany();
        return {
            success: true,
            data: users,
        };
    }));
    fastify.post("/", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield db_1.userService.saveOne(request.body);
        reply.code(201);
        return {
            success: true,
            data: user,
        };
    }));
    fastify.get("/:userId", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield db_1.userService.getOneById(request.params.userId);
        return {
            success: true,
            data: user,
        };
    }));
    fastify.patch("/:userId", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const info = yield db_1.userService.updateOne(request.params.userId, request.body);
        return {
            success: true,
            data: info,
        };
    }));
    fastify.delete("/:userId", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const info = yield db_1.userService.deleteOne(request.params.userId);
        return {
            success: true,
            data: info,
        };
    }));
    // temp
    fastify.get("/@me", { preHandler: middleware_1.verifyDiscordAuth }, function () {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.userService.getOne({
                discord_id: this.session.id,
            });
            const discordUserData = yield helpers_1.fetchDiscordUser(this.session.access_token);
            // Remove the 'id' property as were calling it 'discord_id' instead
            Reflect.deleteProperty(discordUserData, "id");
            return {
                success: true,
                data: Object.assign(Object.assign({}, user), discordUserData),
            };
        });
    });
});
//# sourceMappingURL=users.js.map