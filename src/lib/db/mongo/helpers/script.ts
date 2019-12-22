import { Schema } from "mongoose";

import { ScriptModel } from "../models";

const defaultScriptLimit = 10;
const defaultPage = 0;

const getOneById = (id: Schema.Types.ObjectId) => ScriptModel
  .findById(id)
  .select({ __v: 0 });

const getOne = (filters: object) => ScriptModel
  .findOne(filters)
  .select({ __v: 0 });

const getMany = (filters: object, sortField: string, sortDirection: number, limit = defaultScriptLimit, page = defaultPage) => ScriptModel
  .find(filters)
  .sort(sortField == null ? {} : { [sortField]: sortDirection })
  .skip(page * limit)
  .limit(limit)
  .select({ __v: 0 });

const saveOne = (props: object) => new ScriptModel(props)
  .save();

const updateOne = (id: Schema.Types.ObjectId, props: object) => ScriptModel
  .updateOne({ _id: id }, props)
  .select({ __v: 0 });

const deleteOne = (id: Schema.Types.ObjectId) => ScriptModel
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
