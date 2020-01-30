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
        guilds: () => __awaiter(void 0, void 0, void 0, function* () {
            const guilds = yield db_1.guildService.getMany();
            return guilds;
        }),
        guild: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const guildId = (_a = context.reply.request.body.variables.guildId, (_a !== null && _a !== void 0 ? _a : variables.guildId));
            const guild = yield db_1.guildService.getOneById(guildId);
            return guild;
        })
    },
    Mutation: {
        addGuild: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const guildData = (_b = context.reply.request.body.variables.guildData, (_b !== null && _b !== void 0 ? _b : variables.guildData));
            const guild = yield db_1.guildService.saveOne(guildData);
            return guild;
        }),
        updateGuild: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            const guildId = (_c = context.reply.request.body.variables.guildId, (_c !== null && _c !== void 0 ? _c : variables.guildId));
            const guildData = (_d = context.reply.request.body.variables.guildData, (_d !== null && _d !== void 0 ? _d : variables.guildData));
            const info = yield db_1.guildService.updateOne(guildId, guildData);
            return info;
        }),
        deleteGuild: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _e;
            const guildId = (_e = context.reply.request.body.variables.guildId, (_e !== null && _e !== void 0 ? _e : variables.guildId));
            const info = yield db_1.guildService.deleteOne(guildId);
            return info;
        })
    }
};
//# sourceMappingURL=guild.js.map