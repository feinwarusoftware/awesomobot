import { Schema } from "mongoose";

import { SessionModel } from "../models";

const defaultSessionLimit = 10;
const defaultPage = 0;

const getOneById = (id: Schema.Types.ObjectId) => SessionModel
  .findById(id)
  .select({ __v: 0 });

const getOne = (filters: object) => SessionModel
  .findOne(filters)
  .select({ __v: 0 });

const getMany = (filters: object, sortField: string, sortDirection: number, limit = defaultSessionLimit, page = defaultPage) => SessionModel
  .find(filters)
  .sort(sortField == null ? {} : { [sortField]: sortDirection })
  .skip(page * limit)
  .limit(limit)
  .select({ __v: 0 });

const saveOne = (props: object) => new SessionModel(props)
  .save();

const updateOne = (id: Schema.Types.ObjectId, props: object) => SessionModel
  .updateOne({ _id: id }, props);

const deleteOne = (id: Schema.Types.ObjectId) => SessionModel
  .deleteOne({ _id: id });

export {
  getOneById,
  getOne,
  getMany,
  saveOne,
  updateOne,
  deleteOne,
};
