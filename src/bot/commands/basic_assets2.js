const fs = require("fs");
const path = require("path");

const Command = require("../command");

const json = JSON.parse(fs.readFileSync(path.join(__dirname, "assets", "basic2.json")));

const basic_assets2 = new Command("dragon1320", "basic_assets2", "basic mem asset loading command example for the new awesomo backend", "js" /* currently unused */, 0 /* currently unused */, "basic_assets2", "command", { json }, (client, message, guildDoc) => {

    message.reply(this.assets.json);
});

module.exports = basic_assets2;
