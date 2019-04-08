"use strict";

const Emitter = require("events");
const { fork } = require("child_process");

// basic executor:
// global scope reset every time
// can execute any script type

// later optimisations...
// caching
// preset scope + changable/uncgangable
// trusted/non-trusted only
// dedicated script
// dedicated script type
// editable timeout, timeout conditions

class Executor extends Emitter {
  constructor() {
    super();

    this.fork = fork();

    this.available = true;
  }
  executeScript(script) {
    this.available = false;

    // do stuff...

    // testing
    const timeout = Math.floor(Math.random() * 5000);

    setTimeout(() => {
      this.available = true;
      this.emit("finished", script);
    }, timeout);
  }
}

module.exports = Executor;
