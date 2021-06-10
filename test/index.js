const tap = require('tap');

tap.test('loading the bin calls the implementation', tap => {
    tap.mock('../src/index.js', {
        '../src/mock.js': () => {
            tap.ok(true);
            tap.end();
        },
    });
});
