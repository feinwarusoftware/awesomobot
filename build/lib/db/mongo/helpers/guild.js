"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const defaultGuildLimit = 10;
const defaultPage = 0;
const getOneById = id => models_1.GuildModel
    .findById(id)
    .select({ __v: 0 });
exports.getOneById = getOneById;
const getOne = filters => models_1.GuildModel
    .findOne(filters)
    .select({ __v: 0 });
exports.getOne = getOne;
const getMany = (filters, sortField, sortDirection, limit = defaultGuildLimit, page = defaultPage) => models_1.GuildModel
    .find(filters)
    .sort(sortField == null ? {} : { [sortField]: sortDirection })
    .skip(page * limit)
    .limit(limit)
    .select({ __v: 0 });
exports.getMany = getMany;
const saveOne = props => models_1.GuildModel
    .save(new models_1.GuildModel(props))
    .select({ __v: 0 });
exports.saveOne = saveOne;
const updateOne = (id, props) => models_1.GuildModel
    .updateOne({ _id: id }, props)
    .select({ __v: 0 });
exports.updateOne = updateOne;
const deleteOne = id => models_1.GuildModel
    .deleteOne({ _id: id })
    .select({ __v: 0 });
exports.deleteOne = deleteOne;
