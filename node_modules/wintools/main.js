var os = require('os');
if (os.platform() !== 'win32') {
	throw new Error('This module only runs on Windows (wintools, dah)');
}

exports.ps = require('./lib/ps');
exports.kill = require('./lib/kill');
exports.iis = require('./lib/iis');
exports.shutdown = require('./lib/shutdown');