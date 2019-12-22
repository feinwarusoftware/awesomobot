"use strict";

const { SessionModel } = require("../models");

const defaultSessionLimit = 10;
const defaultPage = 0;

const getOneById = id => {
  return SessionModel
    .findById(id)
    .select({ __v: 0 });
};

const getOne = filters => {
  return SessionModel
    .findOne(filters)
    .select({ __v: 0 });
};

const getMany = (filters, sortField, sortDirection, limit = defaultSessionLimit, page = defaultPage) => {
  return SessionModel
    .find(filters)
    .sort(sortField == null ? {} : { [sortField]: sortDirection })
    .skip(page * limit)
    .limit(limit)
    .select({ __v: 0 });
};

const saveOne = props => {
  return SessionModel
    .save(new SessionModel(props))
    .select({ __v: 0 });
};

const updateOne = (id, props) => {
  return SessionModel
    .updateOne({ _id: id }, props)
    .select({ __v: 0 });
};

const deleteOne = id => {
  return SessionModel
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
