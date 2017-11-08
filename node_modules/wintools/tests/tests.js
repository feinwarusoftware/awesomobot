var wintools = require('../main');

exports.ps = function(test) {
    wintools.ps(function(err, ps) {
        test.ok(!err, err);
        test.ok(ps);
        test.ok(ps && Object.keys(ps).length > 0);
        test.done();
    });
};

exports.killByPID = function(test) {
    wintools.kill.pid(77777, function(err) {
        test.ok(err);
        test.done();
    });
};

exports.killByImage = function(test) {
    wintools.kill.image('bla.exe', function(err) {
        test.ok(err);
        test.done();
    });
};

exports.shutdown = function(test) {
    // only check that api exists
    test.ok(wintools.shutdown.poweroff);
    test.ok(wintools.shutdown.restart);
    test.done();
};