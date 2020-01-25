import { Types } from "mongoose";

import { GuildScriptModel } from "../models";
import { IGuild, IGuildScript } from "../types";
import * as guildHelpers from "./guild";

const defaultGuildScriptLimit = 10;
const defaultPage = 0;

const getOneById = (guildId: Types.ObjectId, id: Types.ObjectId) => guildHelpers
  .getOneById(guildId)
  .then((guild: IGuild | null) => {
    if (guild == null) {
      return null;
    }

    return guild.scripts.find(e => e.object_id.equals(id));
  });

const getOne = (guildId: Types.ObjectId, filters?: IGuildScript) => guildHelpers
  .getOneById(guildId)
  .then((guild: IGuild | null) => {
    if (guild == null) {
      return null;
    }
    return guild.scripts.find(e => Object.entries(filters ?? {}).reduce((a: boolean, c) => a && c[1] === e.get(c[0]), true));
  });

const getMany = (guildId: Types.ObjectId, filters?: IGuildScript, sortField?: string, sortDirection?: number, limit = defaultGuildScriptLimit, page = defaultPage) => guildHelpers
  .getOneById(guildId)
  .then((guild: IGuild | null) => {
    if (guild == null) {
      return [];
    }

    // Filter guild scripts based on 'filters' props
    let filteredScripts = guild.scripts.filter(e => Object.entries(filters ?? {}).reduce((a: boolean, c) => a && c[1] === e.get(c[0]), true));

    // Sort filtered scripts if 'sortField' specified
    // Note: sort: a - b, (1) => ascending
    if (sortField != null) {
      filteredScripts.sort((a, b) => {
        switch (sortDirection) {
        // ascending
        case 1: {
          return a.get(sortField) - b.get(sortField);
        }
        // descending
        case -1: {
          return b.get(sortField) - a.get(sortField);
        }
        // dont sort
        default: {
          return 0;
        }
        }
      });
    }

    // get 'paginated' slice
    filteredScripts = filteredScripts.slice(page * limit, Math.min(page * limit + limit, filteredScripts.length - 1));

    return filteredScripts;
  });

const saveOne = (guildId: Types.ObjectId, props: IGuildScript) => guildHelpers
  .getOneById(guildId)
  .then((guild: IGuild | null) => {
    if (guild == null) {
      return null;
    }

    const guildScript = new GuildScriptModel(props);

    guild.scripts.push(guildScript);

    return guild
      .save()
      .then(() => guildScript);
  });

const updateOne = (guildId: Types.ObjectId, id: Types.ObjectId, props: IGuildScript) => guildHelpers
  .getOneById(guildId)
  .then((guild: IGuild | null) => {
    if (guild == null) {
      return null;
    }

    // delete it if it exists, just in case
    Reflect.deleteProperty(props, "object_id");

    // TODO: figure out a way to set this to an actual type instead of being a lazy shit
    // Since were doing a search by a unique id field, this will never return more than one
    let script: any = guild.scripts.find(e => e.object_id.equals(id));
    if (script == null) {
      // dont save the guild if theres no need to
      return {
        matched: 0,
        modified: 0,
      };
    }

    // this should work? cos copy by reference?... unless mongo does some gay shit ofc
    script = { ...script, ...props };

    return guild
      .save()
      .then(() => ({
        matched: 1,
        modified: 1,
      }));
  });

const deleteOne = (guildId: Types.ObjectId, id: Types.ObjectId) => guildHelpers
  .getOneById(guildId)
  .then((guild: IGuild | null) => {
    if (guild == null) {
      return null;
    }

    // Since were doing a search by a unique id field, this will never return more than one
    const scriptIndex = guild.scripts.findIndex(e => e.object_id.equals(id));
    if (scriptIndex === -1) {
      return {
        matched: 0,
        deleted: 0,
      };
    }

    guild.scripts.splice(scriptIndex, 1);

    return guild
      .save()
      .then(() => ({
        matched: 1,
        deleted: 1,
      }));
  });

export {
  getOneById,
  getOne,
  getMany,
  saveOne,
  updateOne,
  deleteOne,
};
