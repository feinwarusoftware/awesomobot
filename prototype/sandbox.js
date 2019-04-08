"use strict";

const Emitter = require("events");

const Executor = require("./executor");

// optimisation: cache script execution time
// and assign an executor based on that

// optimisation: executor specialisation

class Sandbox extends Emitter {
  constructor() {
    super();

    this.scriptQueue = [];
    this.executorPool = [];

    this.executing = false;
    this.executorCallback = script => {
      this.emit("finished", script);

      if (!this.executing) this.executeScripts();
    };
  }
  createExecutor() {
    if (this.executorPool.length >= 200) return;

    const executor = new Executor();
    executor.on("finished", this.executorCallback);

    this.executorPool.push(executor);
  }
  destroyExecutor(executorId) {
    const executor = this.executorPool.find(e => e === executorId);
    if (executor == null) return;

    executor.removeListener("finished", this.executorCallback);
    this.executorPool.splice(executorId, 1);
  }
  queueScript(script) {
    this.scriptQueue.push(script);

    // build the sandbox
    // - include all the functions from depped libs based on perms set
    // - include the correct functions based on script type
    // - include the correct functions based on script lang
    // - include the correct lib version if trusted/verified

    // Issue: if queue is full, doesn't execute.

    if (this.executorPool.find(e => e.available) == null
          && this.executorPool.length < 20) {

      this.createExecutor();
    }

    if (!this.executing) this.executeScripts();
  }
  executeScripts() {
    this.executing = true;

    for (let executor of this.executorPool) {
      if (executor.available) {
        const nextScript = this.scriptQueue.shift();
        if (nextScript == null) break;

        executor.executeScript(nextScript);
      }
    }

    this.executing = false;
  }
}

module.exports = Sandbox;
