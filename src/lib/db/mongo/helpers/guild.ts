import { Schema } from "mongoose";

import { GuildModel } from "../models";

const defaultGuildLimit = 10;
const defaultPage = 0;

const getOneById = (id: Schema.Types.ObjectId) => GuildModel
  .findById(id)
  .select({ __v: 0 });

const getOne = (filters: object) => GuildModel
  .findOne(filters)
  .select({ __v: 0 });

const getMany = (filters: object, sortField: string, sortDirection: number, limit = defaultGuildLimit, page = defaultPage) => GuildModel
  .find(filters)
  .sort(sortField == null ? {} : { [sortField]: sortDirection })
  .skip(page * limit)
  .limit(limit)
  .select({ __v: 0 });

const saveOne = (props: object) => new GuildModel(props)
  .save();

const updateOne = (id: Schema.Types.ObjectId, props: object) => GuildModel
  .updateOne({ _id: id }, props)
  .select({ __v: 0 });

const deleteOne = (id: Schema.Types.ObjectId) => GuildModel
  .deleteOne({ _id: id })
  .select({ __v: 0 });

export {
  getOneById,
  getOne,
  getMany,
  saveOne,
  updateOne,
  deleteOne,
};
