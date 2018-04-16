"use strict";

const fs = require("fs");

class Config {
    constructor(filepath) {
        this.data = JSON.parse(fs.readFileSync(filepath))
    }
}

module.exports = {
    Config,
}
