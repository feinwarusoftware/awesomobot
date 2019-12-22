"use strict";

const { UserModel } = require("../models");

const defaultUserLimit = 10;
const defaultPage = 0;

const getOneById = id => {
  return UserModel
    .findById(id)
    .select({ __v: 0 });
};

const getOne = filters => {
  return UserModel
    .findOne(filters)
    .select({ __v: 0 });
};

const getMany = (filters, sortField, sortDirection, limit = defaultUserLimit, page = defaultPage) => {
  return UserModel
    .find(filters)
    .sort(sortField == null ? {} : { [sortField]: sortDirection })
    .skip(page * limit)
    .limit(limit)
    .select({ __v: 0 });
};

const saveOne = props => {
  return UserModel
    .save(new UserModel(props))
    .select({ __v: 0 });
};

const updateOne = (id, props) => {
  return UserModel
    .updateOne({ _id: id }, props)
    .select({ __v: 0 });
};

const deleteOne = id => {
  return UserModel
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
