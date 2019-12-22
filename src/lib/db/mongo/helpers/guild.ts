"use strict";

const { GuildModel } = require("../models");

const defaultGuildLimit = 10;
const defaultPage = 0;

const getOneById = id => {
  return GuildModel
    .findById(id)
    .select({ __v: 0 });
};

const getOne = filters => {
  return GuildModel
    .findOne(filters)
    .select({ __v: 0 });
};

const getMany = (filters, sortField, sortDirection, limit = defaultGuildLimit, page = defaultPage) => {
  return GuildModel
    .find(filters)
    .sort(sortField == null ? {} : { [sortField]: sortDirection })
    .skip(page * limit)
    .limit(limit)
    .select({ __v: 0 });
};

const saveOne = props => {
  return GuildModel
    .save(new GuildModel(props))
    .select({ __v: 0 });
};

const updateOne = (id, props) => {
  return GuildModel
    .updateOne({ _id: id }, props)
    .select({ __v: 0 });
};

const deleteOne = id => {
  return GuildModel
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
