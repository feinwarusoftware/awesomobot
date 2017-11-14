/**
 * utils.js
 * Desc: General utility commands for use in other modules.
 * Deps: If this requires deps, youre doing something wrong!
 */

"use strict"

function opt(options, name, def) {
    return options && options[name]!==undefined ? options[name] : def;
}

function allIndicesOf(string, search) {
    var indices = [];
    for(var pos = string.indexOf(search); pos !== -1; pos = string.indexOf(search, pos + 1)) {
        indices.push(pos);
    }
    return indices;
}

module.exports = {
    opt,
    allIndicesOf,

};