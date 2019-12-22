"use strict";

const mongoose = require("mongoose");

const { UserSchema } = require("../schema");
// why? - so the imported objects' names actually make sense
const UserModel = UserSchema;

module.exports = mongoose.model("Guild", UserModel);
