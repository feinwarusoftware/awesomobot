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

const getMany = (filters?: ISession, sortField?: string, sortDirection?: number, limit = defaultSessionLimit, page = defaultPage) => SessionModel
  .find(filters)
  .sort(sortField == null ? {} : { [sortField]: sortDirection })
  .skip(page * limit)
  .limit(limit)
  .select({ __v: 0 });

const saveOne = (props: ISession) => new SessionModel(props)
  .save()
  .then(guild => {
    if (guild !== null) {
      Reflect.deleteProperty(guild, "__v");
    }

    return guild;
  });

const updateOne = (id: Types.ObjectId, props: ISession) => SessionModel
  .updateOne({ _id: id }, props)
  .then(({n: matched, nModified: modified, ok}) => {
    if (ok !== 1) {
      throw `'ok' (current: ${ok}) was not set to 1 in mongodb response, idk what that means, but it cant be good, right? No but rly, it means theres an error somewhere...`;
    }

    return {
      matched,
      modified,
    };
  });

const deleteOne = (id: Types.ObjectId) => SessionModel
  .deleteOne({ _id: id })
  .then(({n: matched, deletedCount: deleted, ok}) => {
    if (ok !== 1) {
      throw `'ok' (current: ${ok}) was not set to 1 in mongodb response, idk what that means, but it cant be good, right? No but rly, it means theres an error somewhere...`;
    }

    return {
      matched,
      deleted,
    };
  });

export {
  getOneById,
  getOne,
  getMany,
  saveOne,
  updateOne,
  deleteOne,
};
