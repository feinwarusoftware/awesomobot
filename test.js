/**
 * Testing without using the discord.js api.
 */

const log = require("./log");
const debug = require("./debug");

log.setLogLevel(log.DEBUG | log.ERROR | log.FILEDUMP);

log.write(log.DEBUG, "a thing did a thing", __function, __line);
log.write(log.ERROR, "well, something went wrong", __function, __line);
log.write(log.WARNING, "this shouldnt happed", __function, __line);
log.write(log.INFO, "something happened", __function, __line);