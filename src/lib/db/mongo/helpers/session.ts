import { Types } from "mongoose";

import { SessionModel } from "../models";
import { ISession } from "../../types";

const defaultSessionLimit = 10;
const defaultPage = 0;

const getOneById = (id: Types.ObjectId) => SessionModel
  .findById(id)
  .select({ __v: 0 });

const getOne = (filters: ISession) => SessionModel
  .findOne(filters)
  .select({ __v: 0 });

const getMany = (filters: ISession, sortField: string, sortDirection: number, limit = defaultSessionLimit, page = defaultPage) => SessionModel
  .find(filters)
  .sort(sortField == null ? {} : { [sortField]: sortDirection })
  .skip(page * limit)
  .limit(limit)
  .select({ __v: 0 });

const saveOne = (props: ISession) => new SessionModel(props)
  .save();

const updateOne = (id: Types.ObjectId, props: ISession) => SessionModel
  .updateOne({ _id: id }, props);

const deleteOne = (id: Types.ObjectId) => SessionModel
  .deleteOne({ _id: id });

export {
  getOneById,
  getOne,
  getMany,
  saveOne,
  updateOne,
  deleteOne,
};
