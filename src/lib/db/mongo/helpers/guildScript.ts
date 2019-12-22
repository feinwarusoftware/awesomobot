import { Schema } from "mongoose";

import { GuildScriptModel } from "../models";
import { GuildScriptSchema } from "../schema";
import * as guildHelpers from "./guild";

const defaultGuildScriptLimit = 10;
const defaultPage = 0;

const getOneById = (guildId: Schema.Types.ObjectId, id: Schema.Types.ObjectId) => guildHelpers
  .getOneById(guildId)
  .then(guild => {
    if (guild == null) {
      return null;
    }
    return guild.scripts.find(e => e.object_id.equals(id));
  });

const getOne = (guildId: Schema.Types.ObjectId, filters) => guildHelpers
  .getOneById(guildId)
  .then(guild => {
    if (guild == null) {
      return null;
    }
    return guild.scripts.find(e => filters.reduce((a, c) => a && filters[c] === e[c], true));
  });

const getMany = (guildId: Schema.Types.ObjectId, filters: object, sortField: string, sortDirection: number, limit = defaultGuildScriptLimit, page = defaultPage) => guildHelpers
  .getOneById(guildId)
  .then(guild => {
    if (guild == null) {
      return [];
    }

    // Filter guild scripts based on 'filters' props
    let filteredScripts = guild.scripts.filter(e => filters.reduce((a, c) => a && filters[c] === e[c], true));

    // Sort filtered scripts if 'sortField' specified
    // Note: sort: a - b, (1) => ascending
    if (sortField != null) {
      filteredScripts.sort((a, b) => {
        switch (sortDirection) {
        // ascending
        case 1: {
          return a[sortField] - b[sortField];
        }
        // descending
        case -1: {
          return b[sortField] - a[sortField];
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

const saveOne = (guildId: Schema.Types.ObjectId, props: object) => guildHelpers
  .getOneById(guildId)
  .then(guild => {
    if (guild == null) {
      return null;
    }

    const guildScript = new GuildScriptModel(props);

    guild.scripts.push(guildScript);

    return guild
      .save()
      .then(() => guildScript);
  });

const updateOne = (guildId: Schema.Types.ObjectId, id: Schema.Types.ObjectId, props: object) => guildHelpers
  .getOneById(guildId)
  .then(guild => {
    if (guild == null) {
      return null;
    }

    // delete it if it exists, just in case
    Reflect.deleteProperty(props.object_id);

    let script = guild.scripts.find(e => e.object_id.equals(id));

    script = { ...script, ...props };

    return guild
      .save()
      .then(() => script);
  });

const deleteOne = (guildId: Schema.Types.ObjectId, id: Schema.Types.ObjectId) => guildHelpers
  .getOneById(guildId)
  .then(guild => {
    if (guild == null) {
      return null;
    }

    const scriptIndex = guild.scripts.findIndex(e => e.object_id.equals(id));
    if (scriptIndex === -1) {
      return null;
    }

    // Used to return what was deleted
    const scriptCopy = JSON.parse(JSON.stringify(guild[scriptIndex]));

    guild.scripts.splice(scriptIndex, 1);

    return guild
      .save()
      .then(() => scriptCopy);
  });

export {
  getOneById,
  getOne,
  getMany,
  saveOne,
  updateOne,
  deleteOne,
};
