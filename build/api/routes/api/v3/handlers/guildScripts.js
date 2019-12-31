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
exports.default = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get("/", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const guildScripts = yield db_1.guildScriptService.getMany(request.params.guildId);
        return {
            success: true,
            data: guildScripts,
        };
    }));
    fastify.post("/", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const guildScript = yield db_1.guildScriptService.saveOne(request.params.guildId, request.body);
        return {
            success: true,
            data: guildScript,
        };
    }));
    fastify.get("/:scriptId", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const guildScript = yield db_1.guildScriptService.getOneById(request.params.guildId, request.params.scriptId);
        return {
            success: true,
            data: guildScript,
        };
    }));
    fastify.patch("/:scriptId", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const info = yield db_1.guildScriptService.updateOne(request.params.guildId, request.params.scriptId, request.body);
        return {
            success: true,
            data: info,
        };
    }));
    fastify.delete("/:scriptId", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const info = yield db_1.guildScriptService.deleteOne(request.params.guildId, request.params.scriptId);
        return {
            success: true,
            data: info,
        };
    }));
});
//# sourceMappingURL=guildScripts.js.map