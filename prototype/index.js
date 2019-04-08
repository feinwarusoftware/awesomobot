"use strict";



// Accepts all scripts for execution.
// Contains a pool of 'executors'.
class Sandbox {
  constructor() {
    this.queue = [];
    this.pool = [];
  }
  exec(script) {
    this.queue.push(new Executor(script));
  }
}

// Executes script code locally or
// communicates with a container.
class Executor {
  constructor(script) {
    this.tree = new Tree(script);
  }
}

// Represents the execution flow
// of scripts and their dependencies.
class Tree {
  constructor(script) {
    this.list = this.builTree(script);
  }
  buildTree() {

  }
}

// Code that can be executed by
// the sandbox.
class Executable {
  constructor() {
  }
}


class Script extends Executable {
  constructor() {
    super();
  }
}

class Lib extends Executable {
  constructor() {
    super();
  }
}

class Filter extends Executable {
  constructor() {
    super();
  }
}
