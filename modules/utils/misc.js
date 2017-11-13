"use strict"

function opt(options, name, def) {
    return options && options[name]!==undefined ? options[name] : def;
}

function messageIncludes(message, blacklist, whitelist) {
    var indices = [];

    for (var i = 0; i < blacklist.length; i++) {
        const occ = allIndicesOf(message.content, blacklist[i]);
        indices = indices.concat(occ);
    }

    if (indices.length > 0) {
        for (var i = 0; i < indices.length; i++) {
            for (var j = 0; j < whitelist.length; j++) {
                if (message.content.substring(indices[i], message.content.length).startsWith(whitelist[j])) {

                    return false;
                }
            }
        }

        return true;
    }
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
    messageIncludes,
    allIndicesOf,

};