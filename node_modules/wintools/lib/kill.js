var exec = require('child_process').exec;

/**
 * Kills a process by PID.
 * @param pid Required. Process ID.
 * @param callback Optional.
 * @remarks Windows only
 */
exports.pid = function(pid, callback) {
    if (!pid) throw new Error('pid is required');
    if (!callback) callback = function() {};
    
    exec('taskkill /t /f /pid ' + pid.toString(), function (err, stdout, stderr) {
        if (err) {
            callback({ msg: "unable to kill " + pid, err: err, stdout: stdout, stderr: stderr });
            return;
        }
        
        callback();
    });
};

/**
 * Kills all the processes with the specified image name
 * @param imageName Required. The name of the image (e.g. 'node.exe')
 * @param callback Optional.
 */
exports.image = function(imageName, callback) {
    if (!imageName) throw new Error('imageName is required');
    if (!callback) callback = function() {};
        
    exec('taskkill /t /f /im ' + imageName, function (err, stdout, stderr) {
        if (err) {
            callback({ msg: "unable to kill " + imageName, err: err, stdout: stdout, stderr: stderr });
            return;
        }
        
        callback();
    });
}
