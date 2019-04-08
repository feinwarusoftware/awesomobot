"use strict";

/*
class Executable {
  constructor(code) {

  }
}

class Script extends Executable {

}

class Cache {

}

class BotCache extends Cache {

}

class ScriptCache extends BotCache {

}

class DataCache extends BotCache {

}

class Tree {

}

class TreeCache extends Cache {

}

class ExecCache extends TreeCache {

}

class GlobCache extends TreeCache {

}

class Glob {

}

class Drop extends Executable {

}

class ExecChain {

}

class Branch extends Executable {

}

class VM {

*/

// leaf
// - can use all drops
// - glob read access only
// filter
// - can use some drops
// - stop execution
// - read/write glob
// - event access
// drop
// - can use all other drops
// - provide extra functionality
// hook
// - can use some drops
// - stop execution
// - read/write glob
// - event access
// - script data access

// drops
// - db
// - http
// - sharp
// - discord

// filter vs hook - data persistence
// - filter data persists throughout chain
// - hook data dropped after each script

// temp debug
const panic = (error = "rawrxd") => {
  throw error;
};

const uniq = a => {
  return Array.from(new Set(a));
};

// temp db

// NOTE: schema level validation will probably only check data integrity
// ALSO NOTE: the above statemet is no longer the case
const mongoose = require("mongoose");

// TODO: better error messages
const scriptOptsSchema = new mongoose.Schema({
  req_data: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v != null;
      },
      message: () => "array value cannot be null"
    }
  },
  hook_type: {
    type: String,
    enum: ["pre-run", "post-run", "success", "failure", null],
    default: null
  },
  allowed_types: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        if (v == null) return false;

        const enumValues = ["leaf", "branch", "drop", "hook"];
        return v.reduce((a, c) => a && enumValues.includes(c), true);
      },
      message: () => "allowed_types is set incorrectly"
    }
  }
}, {
  _id: false
});

// TODO: better error messages
const scriptVersionSchema = new mongoose.Schema({
  // TODO: validate semver
  version: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return true;
      },
      message: () => "version set incorrectly"
    }
  },
  // Get the fleg!
  flag: {
    type: String,
    enum: ["release", "beta", "alpha"],
    required: true
  },
  opts: {
    type: scriptOptsSchema,
    default: {},
    validate: {
      validator: function(v) {
        return v != null;
      },
      message: () => "opts cannot be null"
    }
  },
  code: {
    type: String,
    required: true
  }
}, {
  _id: false
});

// TODO: better error messages
const scriptSchema = new mongoose.Schema({
  // _id: ObjectId,

  name: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["leaf", "branch", "drop", "hook"],
    required: true,
    validate: {
      validator: function() {
        // drop:
        // this.versions[].opts.req_data.length == 0
        // this.versions[].opts.hook_type == null
        // this.versions[].opts.allowed_types != null
        if (this.type === "drop") {
          return this.versions.reduce((a, c) => a
            && c.opts.req_data.length == 0
            && c.opts.hook_type == null
            && c.opts.allowed_types != null,
          true);
        }

        // hook:
        // this.versions[].opts.req_data != null
        // this.versions[].opts.hook_type != null
        // this.versions[].opts.allowed_types.length == 0
        if (this.type === "hook") {
          return this.versions.reduce((a, c) => a
            && c.opts.req_data != null
            && c.opts.hook_type != null
            && c.opts.allowed_types.length == 0,
          true);
        }

        return true;
      },
      message: () => "version opts not set correctly"
    }
  },
  versions: {
    type: [scriptVersionSchema],
    default: [],
    validate: {
      validator: function(v) {
        if (v == null) return false;

        return v.length > 0;
      },
      message: () => "There needs to be at least 1 version present."
    }
  },

  // if this is set to null, it means root
  branch: {
    type: mongoose.Schema.Types.ObjectId
  },
  pre: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    validate: {
      validator: function(v) {
        if (v == null || this.type === "hook") return false;

        // unique
        if (v.length !== uniq(v).length) return false;

        return true;
      },
      message: () => "pre not set correctly"
    }
  },
  post: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    validate: {
      validator: function(v) {
        if (v == null) return false;

        // unique
        if (v.length !== uniq(v).length) return false;

        return true;
      },
      message: () => "post not set correctly"
    }
  },
  drops: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    validate: {
      validator: function(v) {
        if (v == null) return false;

        // unique
        if (v.length !== uniq(v).length) return false;

        return true;
      },
      message: () => "drops not set correctly"
    }
  },

  data: {
    type: Map,
    of: [String, Number, Boolean],
    default: {},
    validate: {
      validator: function(v) {
        if (v == null) return false;

        return true;
      },
      message: () => "data not set correctly"
    }
  }
});

scriptSchema.methods.findPreHooks = function() {
  return new Promise((resolve, reject) => {
    if (this.pre.length === 0) return resolve([]);

    this.model("Script").find({ _id: { $in: this.pre } }).then(resolve).catch(reject);
  });
};

scriptSchema.methods.findPostHooks = function() {
  return new Promise((resolve, reject) => {
    if (this.post.length === 0) return resolve([]);

    this.model("Script").find({ _id: { $in: this.post } }).then(resolve).catch(reject);
  });
};

scriptSchema.methods.findDrops = function() {
  return new Promise((resolve, reject) => {
    if (this.drops.length === 0) return resolve([]);

    this.model("Script").find({ _id: { $in: this.drops } }).then(resolve).catch(reject);
  });
};

// TODO: validation
// - special validation if branch is null
// - the drop can be used in this script type
// - all necessary data is set
// - all necessary libs are included
// - no undefined glob is accessed
// - all tests pass
// - all _id references are valid
// - opts for each script type

// What might change/break after schema validation:
// - pre, post, and drops ids

// What can still go wrong after validation:
// - someone changes something in the db
// (should re-check data validity on Script object creation)
// - any script references could point to incorrect scripts or be invalid
// - required data might not be set

const ScriptModel = mongoose.model("Script", scriptSchema);

mongoose.connect("mongodb://localhost/rawryd", {
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", error => {
  panic(error);
});
db.on("open", () => {
  console.log("db conn");
});

/*
const newScript = new ScriptModel({
  name: "command",
  type: "branch",
  versions: [{
    version: "0.0.1",
    flag: "alpha",
    opts: {},
    code: "some shitty code goes here"
  }],
  branch: "5c840542d5338125e4fadf95",
  pre: [
    "5c84166b6a9fcb33d00d917b",
    "5c841b26a63ad21124d798de"
  ],
  post: [],
  drops: [],
  data: {}
});

newScript.save().then(console.log).catch(console.error);
*/
//

class DbController {
  constructor() {

  }
  findScriptById(id) {
    return ScriptModel.findById(id);
  }
}

// ISSUE: how do we clear the cache when someone wants to update a script?
class ScriptCache {
  constructor(size) {
    this.size = size;
    this.cache = [];
  }
  add(script) {
    this.remove(script.id);
    this.cache.push(script);

    if (this.cache.length > this.size) this.cache.shift();
  }
  remove(scriptId) {
    const index = this.cache.findIndex(e => e.id === scriptId);
    if (index != null) this.cache.splice(index, 1);
  }
  find(scriptId) {
    const script = this.cache.find(e => e.id === scriptId);
    if (script != null) return script;

    return null;
  }
  clear() {
    this.cache = [];
  }
}

class ScriptManager {
  constructor(cacheSize) {
    this.cache = new ScriptCache(cacheSize);
    this.db = new DbController();
  }
  findById(id) {
    return new Promise((resolve, reject) => {
      const cached = this.cache.find(id);
      if (cached != null) return resolve(cached);

      this.db.findScriptById(id)
        .then(dbScript => {
          if (dbScript == null) return reject("script is null");

          this.cache.add(dbScript);
          resolve(dbScript);
        })
        .catch(reject);
    });
  }
}

const scriptManager = new ScriptManager(1000);

const testScript = scriptManager.findById("5c841be443ca95161818d36e").then(doc => {
  console.log(doc);

  const testScript2 = scriptManager.findById("5c841be443ca95161818d36e").then(console.log).catch(console.error);

}).catch(console.error);

/*
class Event {
  constructor(type, data = {}) {
    this.type = type;
    this.data = data;
  }

}

class Sandbox {
  constructor(event) {
    if (!(event instanceof Event)) panic();
    this.event = event;

    this.execChain = this._buildExecChain();
  }
  _buildExecChain() {

  }
  fetchNextDep() {

  }
  reserveVM(VMPool) {

  }
}
*/
