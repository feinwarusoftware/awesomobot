const defaults = {
  author_id: "feinwaru-devs",

  name: "placeholder_name",
  description: "placeholder_description",
  help: "placeholder help",
  thumbnail: "https://cdn.discordapp.com/attachments/209040403918356481/528275650809823233/nekololi.png",
  marketplace_enabled: false,

  type: "js",
  match_type: "command",
  match: "placeholder_match",

  featured: false,

  preload: false,

  cb: function(client, message) {

    message.channel.send("wip_command");
  },
  load: function() {
    return new Promise(resolve => resolve());
  },

  weight: 0
};

class Script {
  constructor(options) {
    // js note: this.prop = options.prop || default;
    // if there is no default, prop is required.

    this.author_id = options.author_id || defaults.author_id;

    this.name = options.name || defaults.name;
    this.description = options.description || defaults.description;
    this.help = options.help || defaults.help;
    this.thumbnail = options.thumbnail || defaults.thumbnail;
    this.marketplace_enabled = options.marketplace_enabled
      || defaults.marketplace_enabled;

    this.type = options.type || defaults.type;
    this.match_type = options.match_type || defaults.match_type;
    this.match = options.match || defaults.match;

    this.featured = options.featured || defaults.featured;

    this.preload = options.preload || defaults.preload;

    this.cb = options.cb || defaults.cb;
    this.load = options.load || defaults.load;

    this.weight = options.weight || defaults.weight;

    // warn if certain info isn't provided.
    if (options.name == null) {
      console.warn(`Script name is not set, defaulting to: ${defaults.name}. Having multiple scripts with this name may trigger undefined database behaviour. If you can see this warning in production then i truly feel sorry for you.`);
    }
    if (options.match == null) {
      console.warn(`Script match is not set, defaulting to: ${defaults.match}. Having multiple scripts with the same match will result in only one getting called, which might make it seem like one of them isn't working.`);
    }
  }

  run(client, message, guild, user, script, match) {
    this.cb(client, message, guild, user, script, match);
  }

  startup() {
    return new Promise((resolve, reject) => {
      if (this.load != null) {
        this.load()
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      }
      resolve();
    });
  }
}

module.exports = Script;
