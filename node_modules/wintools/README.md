# wintools - Some windows tools for node.js

## Installation

```bash
npm install wintools
```

```javascript
var wintools = require('wintools');
```

## API

 * `wintools.ps(callback)` where callback is `function(err, list)` returns a list of running processes.
 * `wintools.kill.pid(pid, callback)` kills a process by PID.
 * `wintools.kill.image(imageName, callback)` kills a process by image name (e.g. `node.exe`).
 * `wintools.shutdown.poweroff([callback])` turns of off the machine immediately.
 * `wintools.shutdown.restart([callback])` rstarts the machine immediately.

## License

MIT