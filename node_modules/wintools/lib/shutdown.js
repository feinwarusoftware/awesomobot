var spawn = require('child_process').spawn;
var path = require('path');

/**
 * Shuts down the machine, now!
 */
exports.poweroff = function(callback) {
	return exec([ '/s', '/d', 'u:4:5', '/f', '/t', '0' ], callback);
};

/**
 * Restarts the machine, now!
 */
exports.restart = function(callback) {
	return exec([ '/r', '/d', 'u:4:5', '/f', '/t', '0' ], callback);
};

// -- private

var exec = spawnShutdown;

function spawnShutdown(args, callback) {
	if (typeof args === 'string') args = [ args ];

	callback = callback || function(err) {
		if (err) console.error('shutdown error:', err);
	};

	var prog = path.join(process.env.SystemRoot, 'System32', 'shutdown.exe');
	var child = spawn(prog, args, {});
	child.on('error', function(err) {
		return callback(err);
	});

	child.on('exit', function(code) {
		console.info('Exit code:', code);
		return callback(null, code);
	});

	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);

	return child;
}