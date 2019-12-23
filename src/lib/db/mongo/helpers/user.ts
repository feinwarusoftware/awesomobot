import { Types } from "mongoose";

import { UserModel } from "../models";
import { IUser } from "../../types";

const defaultUserLimit = 10;
const defaultPage = 0;

const getOneById = (id: Types.ObjectId) => UserModel
  .findById(id)
  .select({ __v: 0 });

const getOne = (filters: IUser) => UserModel
  .findOne(filters)
  .select({ __v: 0 });

const getMany = (filters?: IUser, sortField?: string, sortDirection?: number, limit = defaultUserLimit, page = defaultPage) => UserModel
  .find(filters)
  .sort(sortField == null ? {} : { [sortField]: sortDirection })
  .skip(page * limit)
  .limit(limit)
  .select({ __v: 0 });

const saveOne = (props: IUser) => new UserModel(props)
  .save();

const updateOne = (id: Types.ObjectId, props: IUser) => UserModel
  .updateOne({ _id: id }, props);

const deleteOne = (id: Types.ObjectId) => UserModel
  .deleteOne({ _id: id });

export {
  getOneById,
  getOne,
  getMany,
  saveOne,
  updateOne,
  deleteOne,
};
