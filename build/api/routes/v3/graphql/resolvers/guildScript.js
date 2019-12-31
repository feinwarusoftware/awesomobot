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
exports.default = {
    Query: {
        guildScripts: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const guildId = (_a = context.reply.request.body.variables.guildId, (_a !== null && _a !== void 0 ? _a : variables.guildId));
            const guildScripts = yield db_1.guildScriptService.getMany(guildId);
            return guildScripts;
        }),
        guildScript: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _b, _c;
            const guildId = (_b = context.reply.request.body.variables.guildId, (_b !== null && _b !== void 0 ? _b : variables.guildId));
            const guildScriptId = (_c = context.reply.request.body.variables.guildScriptId, (_c !== null && _c !== void 0 ? _c : variables.guildScriptId));
            const guildScript = yield db_1.guildScriptService.getOneById(guildId, guildScriptId);
            return guildScript;
        })
    },
    Mutation: {
        addguildScript: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _d, _e;
            const guildId = (_d = context.reply.request.body.variables.guildId, (_d !== null && _d !== void 0 ? _d : variables.guildId));
            const guildScriptData = (_e = context.reply.request.body.variables.guildScriptData, (_e !== null && _e !== void 0 ? _e : variables.guildScriptData));
            const guildScript = yield db_1.guildScriptService.saveOne(guildId, guildScriptData);
            return guildScript;
        }),
        updateguildScript: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _f, _g, _h;
            const guildId = (_f = context.reply.request.body.variables.guildId, (_f !== null && _f !== void 0 ? _f : variables.guildId));
            const guildScriptId = (_g = context.reply.request.body.variables.guildScriptId, (_g !== null && _g !== void 0 ? _g : variables.guildScriptId));
            const guildScriptData = (_h = context.reply.request.body.variables.guildScriptData, (_h !== null && _h !== void 0 ? _h : variables.guildScriptData));
            const info = yield db_1.guildScriptService.updateOne(guildId, guildScriptId, guildScriptData);
            return info;
        }),
        deleteguildScript: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _j, _k;
            const guildId = (_j = context.reply.request.body.variables.guildId, (_j !== null && _j !== void 0 ? _j : variables.guildId));
            const guildScriptId = (_k = context.reply.request.body.variables.guildScriptId, (_k !== null && _k !== void 0 ? _k : variables.guildScriptId));
            const info = yield db_1.guildScriptService.deleteOne(guildId, guildScriptId);
            return info;
        })
    }
};
//# sourceMappingURL=guildScript.js.map