"use strict";

const Sandbox = require("./sandbox");

const sb = new Sandbox();
sb.on("finished", script => {

  console.log(`script finished: ${script}`);
});

for (let i = 0; i < 1000; i++) {
  sb.queueScript(`scp_${i}`);
}
