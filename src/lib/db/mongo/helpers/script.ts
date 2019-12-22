"use strict";

const { ScriptModel } = require("../models");

const defaultScriptLimit = 10;
const defaultPage = 0;

const getOneById = id => {
  return ScriptModel
    .findById(id)
    .select({ __v: 0 });
};

const getOne = filters => {
  return ScriptModel
    .findOne(filters)
    .select({ __v: 0 });
};

const getMany = (filters, sortField, sortDirection, limit = defaultScriptLimit, page = defaultPage) => {
  return ScriptModel
    .find(filters)
    .sort(sortField == null ? {} : { [sortField]: sortDirection })
    .skip(page * limit)
    .limit(limit)
    .select({ __v: 0 });
};

const saveOne = props => {
  return ScriptModel
    .save(new ScriptModel(props))
    .select({ __v: 0 });
};

const updateOne = (id, props) => {
  return ScriptModel
    .updateOne({ _id: id }, props)
    .select({ __v: 0 });
};

const deleteOne = id => {
  return ScriptModel
    .deleteOne({ _id: id })
    .select({ __v: 0 });
};

module.exports = {
  getOneById,
  getOne,
  getMany,
  saveOne,
  updateOne,
  deleteOne,
};
