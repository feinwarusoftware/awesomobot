var exec = require('child_process').exec;

/**
 * Runs the IIS appcmd utility
 * @param args Arguments for appcmd
 * @param callback Callback
 */
function appcmd(args, callback) {
    if (!args) throw new Error('args');
    if (!callback) callback = _defaultCallback;
  
    console.log("appcmd " + args);
    exec("%systemroot%\\system32\\inetsrv\\appcmd " + args, function (err, stdout, stderr) {
        console.info(stdout);
        console.error(stderr);

        if (err) {
            console.error('appcmd ' + args + ' failed:', err);
        }

        callback(err, stdout, stderr);
    });
}

exports.appcmd = appcmd;

/**
 * Adds a site to IIS
 * @param name The name of the site
 * @param id Unique id of the new site
 * @param bindings HTTP bindings
 * @param path Physical path
 * @param callback Callback
 */
function addSite(name, id, bindings, path, callback) {
    if (!name) throw new Error('name is required');
    if (!id) throw new Error('id is required');
    if (!bindings) throw new Error('bindings is required');
    if (!path) throw new Error('path is required');
    if (!callback) callback = _defaultCallback;
    
    appcmd('add site /name:"' + name + '" /id:' + id + ' /bindings:' + bindings + ' /physicalPath:"' + path + '"', callback);
}

exports.addSite = addSite;

/**
 * Lists the VDIRs in IIS
 * @param callback Callback
 */
function vdirs(callback) {
    if (!callback) callback = _defaultCallback;
    appcmd("list vdir", function (err, stdout, stderr) {
        if (err) {
            callback({ err: err, stderr: stderr, stdout: stdout });
            return;
        }

        var sites = {};
        stdout.split('\n').forEach(function (line) {
            if (!line) return;
            var re = /\"(.+)\"\W+\(physicalPath\:(.+)\)/;
            var ree = re.exec(line);
            sites[ree[1]] = { path: ree[2] };
        });

        callback(null, sites);
    });
}

exports.vdirs = vdirs;

/**
 * Adds a VDIR to IIS
 * @param site The site to add the VDIR to
 * @param vdir The name fo the VDIR to add
 * @param path The physical path the VDIR points to
 * @param callback Callback
 */
function addVdir(site, vdir, path, callback) {
    if (!site) throw new Error('site is required');
    if (!vdir) throw new Error('vdir is required');
    if (!path) throw new Error('path is required');
    if (!callback) callback = _defaultCallback;
    appcmd('add vdir /app.name:"' + site + '" /path:"' + vdir + '" /physicalPath:"' + path + '"', callback);
}

exports.addVdir = addVdir;

/**
 * Returns all the VDIRs in IIS keyed by their physical path
 * @param callback function(err, vdirsByPath)
 */
function vdirsByPath(callback) {
    if (!callback) callback = _defaultCallback;
    vdirs(function (err, vdirs) {
        if (err) {
            callback(err);
            return;
        }

        var paths = {};
        for (var vdir in vdirs) {
            paths[vdirs[vdir].path.toLowerCase()] = vdir;
        }

        callback(null, paths);
    });
}

exports.vdirsByPath = vdirsByPath;

/**
 * Sets the physical path of a VDIR
 * @param vdir The VDIR to change
 * @param newPath the new path
 * @param callback Callback
 */
function setPath(vdir, newPath, callback) {
    if (!vdir) throw new Error('vdir is required');
    if (!newPath) throw new Error('newPath is required');
    if (!callback) callback = _defaultCallback;

    appcmd('set vdir ' + vdir + ' -physicalPath:"' + newPath + '"', function (err, stdout, stderr) {
        if (err) {
            callback({ err: err, stderr: stderr, stdout: stdout });
            return;
        }

        callback();
    });
}

exports.setPath = setPath;

/**
 * Starts an IIS site
 * @param site The site to start
 * @param callback Callback
 */
function startSite(site, callback) {
    if (!site) throw new Error('site is required');
    if (!callback) callback = _defaultCallback;
    appcmd('start site ' + site, callback);
}

exports.startSite = startSite;

// -------------------------------------------------------------------------------

function _defaultCallback(err, result) {
    if (err) console.error("Error:", err);
    else console.info(result);
}
