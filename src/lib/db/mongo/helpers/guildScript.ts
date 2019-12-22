"use strict";

const { GuildScriptModel } = require("../models");
const guildHelpers = require("./guild");

const defaultGuildScriptLimit = 10;
const defaultPage = 0;

const getOneById = (guildId, id) => {
  return guildHelpers
    .getOne(guildId)
    .then(guild => {
      if (guild == null) {
        return null;
      }
      return guild.scripts.find(e => e.object_id.equals(id));
    });
};

const getOne = (guildId, filters) => {

};

const getMany = (guildId, filters, sortField, sortDirection, limit = defaultGuildScriptLimit, page = defaultPage) => {

};

const saveOne = (guildId, props) => {

};

const updateOne = (guildId, id, props) => {

};

const deleteOne = (guildId, id) => {

};

module.exports = {
  getOneById,
  getOne,
  getMany,
  saveOne,
  updateOne,
  deleteOne,
};
