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

const getMany = (filters?: IGuild, sortField?: string, sortDirection?: number, limit = defaultGuildLimit, page = defaultPage) => GuildModel
  .find(filters)
  .sort(sortField == null ? {} : { [sortField]: sortDirection })
  .skip(page * limit)
  .limit(limit)
  .select({ __v: 0 });

const saveOne = (props: IGuild) => new GuildModel(props)
  .save()
  .then(guild => {
    if (guild !== null) {
      Reflect.deleteProperty(guild, "__v");
    }

    return guild;
  });

const updateOne = (id: Types.ObjectId, props: IGuild) => GuildModel
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

const deleteOne = (id: Types.ObjectId) => GuildModel
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
