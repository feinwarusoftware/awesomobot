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
const db_1 = require("../../../../lib/db");
exports.default = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get("/", () => __awaiter(void 0, void 0, void 0, function* () {
        const scripts = yield db_1.scriptService.getMany();
        return {
            success: true,
            data: scripts,
        };
    }));
    fastify.post("/", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const script = yield db_1.scriptService.saveOne(request.body);
        return {
            success: true,
            data: script,
        };
    }));
    fastify.get("/:scriptId", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const script = yield db_1.scriptService.getOneById(request.params.userId);
        return {
            success: true,
            data: script,
        };
    }));
    fastify.patch("/:scriptId", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const info = yield db_1.scriptService.updateOne(request.params.userId, request.body);
        return {
            success: true,
            data: info,
        };
    }));
    fastify.delete("/:scriptId", (request) => __awaiter(void 0, void 0, void 0, function* () {
        const info = yield db_1.scriptService.deleteOne(request.params.userId);
        return {
            success: true,
            data: info,
        };
    }));
});
//# sourceMappingURL=scripts.js.map