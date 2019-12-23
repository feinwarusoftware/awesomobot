import { Types } from "mongoose";

import { GuildModel } from "../models";
import { IGuild } from "../../types";

const defaultGuildLimit = 10;
const defaultPage = 0;

const getOneById = (id: Types.ObjectId) => GuildModel
  .findById(id)
  .select({ __v: 0 });

const getOne = (filters: IGuild) => GuildModel
  .findOne(filters)
  .select({ __v: 0 });

const getMany = (filters: IGuild, sortField: string, sortDirection: number, limit = defaultGuildLimit, page = defaultPage) => GuildModel
  .find(filters)
  .sort(sortField == null ? {} : { [sortField]: sortDirection })
  .skip(page * limit)
  .limit(limit)
  .select({ __v: 0 });

const saveOne = (props: IGuild) => new GuildModel(props)
  .save();

const updateOne = (id: Types.ObjectId, props: IGuild) => GuildModel
  .updateOne({ _id: id }, props)
  .select({ __v: 0 });

const deleteOne = (id: Types.ObjectId) => GuildModel
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
