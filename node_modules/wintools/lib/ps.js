var exec = require('child_process').exec;

/**
 * Returns all the system processes
 * @param callback {function(err, list)} Called with the list of all processes.
 * @remarks Runs only on Windows (uses WMI)
 */
module.exports = function(callback) {
    if (!callback) callback = function(err, list) { };

    exec('wmic process list /format:csv', function (err, stdout, stderr) {
        if (err) {
            callback({ err: err, msg: "unable to enumerate processes" });
            return;
        }
        
        stdout = stdout.replace(/\r/g, '').split('\n').slice(1);
        fields = stdout.shift().split(',');

        var output = {};
        stdout.forEach(function (line) {

            var parts = line.split(',');
            var entry = {};
            for (var i = 0; i < fields.length; ++i) {
                entry[fields[i]] = parts[i];
            }

            var e = {
                pid: entry.Handle,
                desc: entry.Description,
                cmd: entry.CommandLine,
                prog: entry.ExecutablePath,
                workingSet: entry.WorkingSetSize,
            };

            // remove some empty stuff
            if (!e.cmd) delete e.cmd;
            if (!e.prog) delete e.prog;

            if (e.pid) {
                output[e.pid] = e;
            }
        });

        callback(null, output);
    });
}