"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const defaultSessionLimit = 10;
const defaultPage = 0;
const getOneById = (id) => models_1.SessionModel
    .findById(id)
    .select({ __v: 0 });
exports.getOneById = getOneById;
const getOne = (filters) => models_1.SessionModel
    .findOne(filters)
    .select({ __v: 0 });
exports.getOne = getOne;
const getMany = (filters, sortField, sortDirection, limit = defaultSessionLimit, page = defaultPage) => models_1.SessionModel
    .find(filters)
    .sort(sortField == null ? {} : { [sortField]: sortDirection })
    .skip(page * limit)
    .limit(limit)
    .select({ __v: 0 });
exports.getMany = getMany;
const saveOne = (props) => new models_1.SessionModel(props)
    .save()
    .then(guild => {
    if (guild !== null) {
        Reflect.deleteProperty(guild, "__v");
    }
    return guild;
});
exports.saveOne = saveOne;
const updateOne = (id, props) => models_1.SessionModel
    .updateOne({ _id: id }, props)
    .then(({ n: matched, nModified: modified, ok }) => {
    if (ok !== 1) {
        throw `'ok' (current: ${ok}) was not set to 1 in mongodb response, idk what that means, but it cant be good, right? No but rly, it means theres an error somewhere...`;
    }
    return {
        matched,
        modified,
    };
});
exports.updateOne = updateOne;
const deleteOne = (id) => models_1.SessionModel
    .deleteOne({ _id: id })
    .then(({ n: matched, deletedCount: deleted, ok }) => {
    if (ok !== 1) {
        throw `'ok' (current: ${ok}) was not set to 1 in mongodb response, idk what that means, but it cant be good, right? No but rly, it means theres an error somewhere...`;
    }
    return {
        matched,
        deleted,
    };
});
exports.deleteOne = deleteOne;
//# sourceMappingURL=session.js.map