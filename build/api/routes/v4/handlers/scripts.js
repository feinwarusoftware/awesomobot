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
exports.default = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get("/", () => __awaiter(void 0, void 0, void 0, function* () { return ({ urma: "get scripts" }); }));
    fastify.post("/", () => __awaiter(void 0, void 0, void 0, function* () { return ({ urma: "post script" }); }));
    fastify.get("/:scriptId", () => __awaiter(void 0, void 0, void 0, function* () { return ({ urma: "get script by id" }); }));
    fastify.patch("/:scriptId", () => __awaiter(void 0, void 0, void 0, function* () { return ({ urma: "patch script" }); }));
    fastify.delete("/:scriptId", () => __awaiter(void 0, void 0, void 0, function* () { return ({ urma: "delete script" }); }));
});
