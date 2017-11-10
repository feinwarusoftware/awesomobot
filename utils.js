module.exports = {
    opt: function(options, name, def) {
        return options && options[name]!==undefined ? options[name] : def;
    }
}