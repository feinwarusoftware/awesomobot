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
const helpers_1 = require("../helpers");
const verifyDiscordAuth = function (request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        // On why this shouldnt redirect if the session doesnt exist or is invalid;
        // This is the api only, as so, the fetch requests will expect json responses.
        // In that case, a 403 response will suffice.
        console.log(request.cookies);
        const jwt = request.headers["xxx-access-token"] || request.cookies.session;
        if (jwt == null) {
            return reply
                .code(403)
                .send({
                success: false,
                error: "You are not authorised to access this path."
            });
        }
        const session = yield helpers_1.decodeSession(jwt);
        this.session = session;
    });
};
exports.verifyDiscordAuth = verifyDiscordAuth;
//# sourceMappingURL=index.js.map