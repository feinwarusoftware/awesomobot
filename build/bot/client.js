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
const discord_js_1 = require("discord.js");
// import uuidv4 from "uuid/v4";
// TODO: Rewrite everything here lol
// temp
const kDiscordBotToken = process.env.DISCORD_BOT_TOKEN;
// temp
const stdCmp = (a, b) => {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
};
const discordClient = new discord_js_1.Client({
    fetchAllMembers: true,
});
// return the client instance afterwards so all the other
// functions dont have to access the global variable
const clientPromise = discordClient
    .login(kDiscordBotToken)
    .then(() => discordClient);
const fetchUser = (discordId, cache = true) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield clientPromise;
    const user = yield client.fetchUser(discordId, cache);
    return user;
});
exports.fetchUser = fetchUser;
// TODO: make limit actually do something lmao, also add a sort order
const fetchMembers = (guildId, query = "", limit = 0) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const client = yield clientPromise;
    const guild = yield ((_a = client.guilds.get(guildId)) === null || _a === void 0 ? void 0 : _a.fetchMembers(query, limit));
    return _c = (_b = guild) === null || _b === void 0 ? void 0 : _b.members.filter(e => e.user.username.toLowerCase().includes(query.toLowerCase()) || (e.nickname == null ? false : e.nickname.toLowerCase().includes(query.toLowerCase()))).array(), (_c !== null && _c !== void 0 ? _c : []);
});
exports.fetchMembers = fetchMembers;
// TODO: make limit actually do something lmao, also add a sort order
const kTempGuildLimit = 20;
const fetchGuilds = (query = "", /* sortField = "name", sortOrder: "ascending" | "descending" = "ascending", */ limit = kTempGuildLimit) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield clientPromise;
    const filteredGuilds = client.guilds.filter(e => e.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => stdCmp(a.name, b.name)).array().slice(0, Math.min(limit, kTempGuildLimit));
    return filteredGuilds;
});
exports.fetchGuilds = fetchGuilds;
//# sourceMappingURL=client.js.map