"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const defaultScriptLimit = 10;
const defaultPage = 0;
const getOneById = (id) => models_1.ScriptModel
    .findById(id)
    .select({ __v: 0 });
exports.getOneById = getOneById;
const getOne = (filters) => models_1.ScriptModel
    .findOne(filters)
    .select({ __v: 0 });
exports.getOne = getOne;
const getMany = (filters, sortField, sortDirection, limit = defaultScriptLimit, page = defaultPage) => models_1.ScriptModel
    .find(filters)
    .sort(sortField == null ? {} : { [sortField]: sortDirection })
    .skip(page * limit)
    .limit(limit)
    .select({ __v: 0 });
exports.getMany = getMany;
const saveOne = (props) => new models_1.ScriptModel(props)
    .save();
exports.saveOne = saveOne;
const updateOne = (id, props) => models_1.ScriptModel
    .updateOne({ _id: id }, props)
    .select({ __v: 0 });
exports.updateOne = updateOne;
const deleteOne = (id) => models_1.ScriptModel
    .deleteOne({ _id: id })
    .select({ __v: 0 });
exports.deleteOne = deleteOne;
//# sourceMappingURL=script.js.map