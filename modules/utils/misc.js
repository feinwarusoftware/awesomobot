"use strict"

function opt(options, name, def) {
    return options && options[name]!==undefined ? options[name] : def;
}

function messageIncludes(message, blacklist, whitelist) {
    for (var i = 0; i < blacklist.length; i++) {
        if (message.content.toLowerCase().includes(blacklist[i])) {
            
            for (var j = 0; j < whitelist.length; j++) {
                if (whitelist[j].includes(blacklist[i])) {

                    return false;
                }
            }

            return true;
        }
    }
}

module.exports = {
    opt,
    messageIncludes,

};