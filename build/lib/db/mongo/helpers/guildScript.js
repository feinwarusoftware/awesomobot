"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const guildHelpers = __importStar(require("./guild"));
const defaultGuildScriptLimit = 10;
const defaultPage = 0;
const getOneById = (guildId, id) => guildHelpers
    .getOneById(guildId)
    .then((guild) => {
    if (guild == null) {
        return null;
    }
    return guild.scripts.find(e => e.object_id.equals(id));
});
exports.getOneById = getOneById;
const getOne = (guildId, filters) => guildHelpers
    .getOneById(guildId)
    .then((guild) => {
    if (guild == null) {
        return null;
    }
    return guild.scripts.find(e => Object.entries((filters !== null && filters !== void 0 ? filters : {})).reduce((a, c) => a && c[1] === e.get(c[0]), true));
});
exports.getOne = getOne;
const getMany = (guildId, filters, sortField, sortDirection, limit = defaultGuildScriptLimit, page = defaultPage) => guildHelpers
    .getOneById(guildId)
    .then((guild) => {
    if (guild == null) {
        return [];
    }
    // Filter guild scripts based on 'filters' props
    let filteredScripts = guild.scripts.filter(e => Object.entries((filters !== null && filters !== void 0 ? filters : {})).reduce((a, c) => a && c[1] === e.get(c[0]), true));
    // Sort filtered scripts if 'sortField' specified
    // Note: sort: a - b, (1) => ascending
    if (sortField != null) {
        filteredScripts.sort((a, b) => {
            switch (sortDirection) {
                // ascending
                case 1: {
                    return a.get(sortField) - b.get(sortField);
                }
                // descending
                case -1: {
                    return b.get(sortField) - a.get(sortField);
                }
                // dont sort
                default: {
                    return 0;
                }
            }
        });
    }
    // get 'paginated' slice
    filteredScripts = filteredScripts.slice(page * limit, Math.min(page * limit + limit, filteredScripts.length - 1));
    return filteredScripts;
});
exports.getMany = getMany;
const saveOne = (guildId, props) => guildHelpers
    .getOneById(guildId)
    .then((guild) => {
    if (guild == null) {
        return null;
    }
    const guildScript = new models_1.GuildScriptModel(props);
    guild.scripts.push(guildScript);
    return guild
        .save()
        .then(() => guildScript);
});
exports.saveOne = saveOne;
const updateOne = (guildId, id, props) => guildHelpers
    .getOneById(guildId)
    .then((guild) => {
    if (guild == null) {
        return null;
    }
    // delete it if it exists, just in case
    Reflect.deleteProperty(props, "object_id");
    // TODO: figure out a way to set this to an actual type instead of being a lazy shit
    // Since were doing a search by a unique id field, this will never return more than one
    let script = guild.scripts.find(e => e.object_id.equals(id));
    if (script == null) {
        // dont save the guild if theres no need to
        return {
            matched: 0,
            modified: 0,
        };
    }
    // this should work? cos copy by reference?... unless mongo does some gay shit ofc
    script = Object.assign(Object.assign({}, script), props);
    return guild
        .save()
        .then(() => ({
        matched: 1,
        modified: 1,
    }));
});
exports.updateOne = updateOne;
const deleteOne = (guildId, id) => guildHelpers
    .getOneById(guildId)
    .then((guild) => {
    if (guild == null) {
        return null;
    }
    // Since were doing a search by a unique id field, this will never return more than one
    const scriptIndex = guild.scripts.findIndex(e => e.object_id.equals(id));
    if (scriptIndex === -1) {
        return {
            matched: 0,
            deleted: 0,
        };
    }
    guild.scripts.splice(scriptIndex, 1);
    return guild
        .save()
        .then(() => ({
        matched: 1,
        deleted: 1,
    }));
});
exports.deleteOne = deleteOne;
//# sourceMappingURL=guildScript.js.map