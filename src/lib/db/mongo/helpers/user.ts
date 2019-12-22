import { Schema } from "mongoose";

import { UserModel } from "../models";

const defaultUserLimit = 10;
const defaultPage = 0;

const getOneById = (id: Schema.Types.ObjectId) => UserModel
  .findById(id)
  .select({ __v: 0 });

const getOne = (filters: object) => UserModel
  .findOne(filters)
  .select({ __v: 0 });

const getMany = (filters: object, sortField: string, sortDirection: number, limit = defaultUserLimit, page = defaultPage) => UserModel
  .find(filters)
  .sort(sortField == null ? {} : { [sortField]: sortDirection })
  .skip(page * limit)
  .limit(limit)
  .select({ __v: 0 });

const saveOne = (props: object) => new UserModel(props)
  .save();

const updateOne = (id: Schema.Types.ObjectId, props: object) => UserModel
  .updateOne({ _id: id }, props);

const deleteOne = (id: Schema.Types.ObjectId) => UserModel
  .deleteOne({ _id: id });

export {
  getOneById,
  getOne,
  getMany,
  saveOne,
  updateOne,
  deleteOne,
};
