const tap = require('tap');

tap.test('loading the bin calls the implementation', tap => {
    tap.mock('../src/index.js', {
        '../src/mock.js': proc => {
            tap.equal(proc, process, 'called implementation with process object');
            tap.end();
        },
    });
});
