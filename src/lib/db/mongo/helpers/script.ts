import { Types } from "mongoose";

import { ScriptModel } from "../models";
import { IScript } from "../types";

const defaultScriptLimit = 10;
const defaultPage = 0;

const getOneById = (id: Types.ObjectId) => ScriptModel
  .findById(id)
  .select({ __v: 0 });

const getOne = (filters: IScript) => ScriptModel
  .findOne(filters)
  .select({ __v: 0 });

// TODO: remove this!!! (temp shitty filters)
interface ScriptFilters {
  author_id?: string,
  name?: string,
  featured?: boolean,
  marketplace_enabled?: boolean,
  verified?: boolean,
}

const getMany = (filters?: ScriptFilters, sortField?: string, sortDirection?: number, limit = defaultScriptLimit, page = defaultPage) => ScriptModel
  .find({
    ...(filters == null ? {} : {
      ...(filters.author_id == null ? {} : { author: filters.author_id }),
      ...(filters.name == null ? {} : { name: { $regex: `.*${filters.name}.*`, $options: "i" } }),
      ...(filters.featured == null ? {} : { featured: filters.featured }),
      ...(filters.marketplace_enabled == null ? {} : { marketplace_enabled: filters.marketplace_enabled }),
      ...(filters.verified == null ? {} : { verified: filters.verified }),
    }),
  })
  .sort(sortField == null ? {} : { [sortField]: sortDirection })
  .skip(page * limit)
  .limit(limit)
  .select({ __v: 0 });

const saveOne = (props: IScript) => new ScriptModel(props)
  .save()
  .then(guild => {
    if (guild !== null) {
      Reflect.deleteProperty(guild, "__v");
    }

    return guild;
  });

const updateOne = (id: Types.ObjectId, props: IScript) => ScriptModel
  .updateOne({ _id: id }, props)
  .then(({n: matched, deletedCount: deleted, ok}) => {
    if (ok !== 1) {
      throw `'ok' (current: ${ok}) was not set to 1 in mongodb response, idk what that means, but it cant be good, right? No but rly, it means theres an error somewhere...`;
    }

    return {
      matched,
      deleted,
    };
  });

const deleteOne = (id: Types.ObjectId) => ScriptModel
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
