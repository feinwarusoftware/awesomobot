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
const db_1 = require("../../../../../../lib/db");
exports.default = {
    Query: {
        users: () => __awaiter(void 0, void 0, void 0, function* () {
            const scripts = yield db_1.scriptService.getMany();
            return scripts;
        }),
        user: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const scriptId = (_a = context.reply.request.body.variables.scriptId, (_a !== null && _a !== void 0 ? _a : variables.scriptId));
            const script = yield db_1.scriptService.getOneById(scriptId);
            return script;
        })
    },
    Mutation: {
        addUser: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const scriptData = (_b = context.reply.request.body.variables.scriptData, (_b !== null && _b !== void 0 ? _b : variables.scriptData));
            const script = yield db_1.scriptService.saveOne(scriptData);
            return script;
        }),
        updateUser: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            const scriptId = (_c = context.reply.request.body.variables.scriptId, (_c !== null && _c !== void 0 ? _c : variables.scriptId));
            const scriptData = (_d = context.reply.request.body.variables.scriptData, (_d !== null && _d !== void 0 ? _d : variables.scriptData));
            const info = yield db_1.scriptService.updateOne(scriptId, scriptData);
            return info;
        }),
        deleteUser: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _e;
            const scriptId = (_e = context.reply.request.body.variables.scriptId, (_e !== null && _e !== void 0 ? _e : variables.scriptId));
            const info = yield db_1.scriptService.deleteOne(scriptId);
            return info;
        })
    }
};
//# sourceMappingURL=script.js.map