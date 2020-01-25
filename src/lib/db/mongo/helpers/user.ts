import { Types } from "mongoose";

import { UserModel } from "../models";
import { IUser } from "../types";
import { IUserInput } from "../../types";

const defaultUserLimit = 10;
const defaultPage = 0;

const getOneById = (id: Types.ObjectId) => UserModel
  .findById(id)
  .select({ __v: 0 });

const getOne = (filters: IUserInput) => UserModel
  .findOne(filters)
  .select({ __v: 0 });

const getMany = (filters?: IUserInput, sortField?: string, sortDirection?: number, limit = defaultUserLimit, page = defaultPage) => UserModel
  .find(filters)
  .sort(sortField == null ? {} : { [sortField]: sortDirection })
  .skip(page * limit)
  .limit(limit)
  .select({ __v: 0 });

const saveOne = (props: IUserInput): Promise<IUser> => new UserModel(props)
  .save()
  .then(user => {
    if (user !== null) {
      Reflect.deleteProperty(user, "__v");
    }

    return user;
  });

const updateOne = (id: Types.ObjectId, props: IUserInput) => UserModel
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

const deleteOne = (id: Types.ObjectId) => UserModel
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
