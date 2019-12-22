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
    .then(guild => {
    if (guild == null) {
        return null;
    }
    return guild.scripts.find(e => e.object_id.equals(id));
});
exports.getOneById = getOneById;
const getOne = (guildId, filters) => guildHelpers
    .getOneById(guildId)
    .then(guild => {
    if (guild == null) {
        return null;
    }
    return guild.scripts.find(e => filters.reduce((a, c) => a && filters[c] === e[c], true));
});
exports.getOne = getOne;
const getMany = (guildId, filters, sortField, sortDirection, limit = defaultGuildScriptLimit, page = defaultPage) => guildHelpers
    .getOneById(guildId)
    .then(guild => {
    if (guild == null) {
        return [];
    }
    // Filter guild scripts based on 'filters' props
    let filteredScripts = guild.scripts.filter(e => filters.reduce((a, c) => a && filters[c] === e[c], true));
    // Sort filtered scripts if 'sortField' specified
    // Note: sort: a - b, (1) => ascending
    if (sortField != null) {
        filteredScripts.sort((a, b) => {
            switch (sortDirection) {
                // ascending
                case 1: {
                    return a[sortField] - b[sortField];
                }
                // descending
                case -1: {
                    return b[sortField] - a[sortField];
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
    .then(guild => {
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
    .then(guild => {
    if (guild == null) {
        return null;
    }
    // delete it if it exists, just in case
    Reflect.deleteProperty(props.object_id);
    let script = guild.scripts.find(e => e.object_id.equals(id));
    script = Object.assign(Object.assign({}, script), props);
    return guild
        .save()
        .then(() => script);
});
exports.updateOne = updateOne;
const deleteOne = (guildId, id) => guildHelpers
    .getOneById(guildId)
    .then(guild => {
    if (guild == null) {
        return null;
    }
    const scriptIndex = guild.scripts.findIndex(e => e.object_id.equals(id));
    if (scriptIndex === -1) {
        return null;
    }
    // Used to return what was deleted
    const scriptCopy = JSON.parse(JSON.stringify(guild[scriptIndex]));
    guild.scripts.splice(scriptIndex, 1);
    return guild
        .save()
        .then(() => scriptCopy);
});
exports.deleteOne = deleteOne;
