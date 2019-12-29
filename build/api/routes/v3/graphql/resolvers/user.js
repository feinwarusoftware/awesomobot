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
        users: () => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield db_1.userService.getMany();
            return users;
        }),
        user: (_, { userId }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield db_1.userService.getOneById(userId);
            return user;
        })
    },
    Mutation: {
        addUser: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const userData = (_a = context.reply.request.body.variables.userData, (_a !== null && _a !== void 0 ? _a : variables.userData));
            const user = yield db_1.userService.saveOne(userData);
            return user;
        }),
        updateUser: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _b, _c;
            const userId = (_b = context.reply.request.body.variables.userId, (_b !== null && _b !== void 0 ? _b : variables.userId));
            const userData = (_c = context.reply.request.body.variables.userData, (_c !== null && _c !== void 0 ? _c : variables.userData));
            const user = yield db_1.userService.updateOne(userId, userData);
            return user;
        }),
        deleteUser: (_, variables, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _d;
            const userId = (_d = context.reply.request.body.variables.userId, (_d !== null && _d !== void 0 ? _d : variables.userId));
            const user = yield db_1.userService.deleteOne(userId);
            return user;
        })
    }
};
//# sourceMappingURL=user.js.map