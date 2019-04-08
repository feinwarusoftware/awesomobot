"use strict";

class Drop {
  constructor(mode) {
    this.mode = mode;
  }
}

class Discord extends Drop {
  constructor(mode) {
    super(mode);
  }
  sendMessage(content) {
    console.log(content);
  }
}


