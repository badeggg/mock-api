const tap = require('tap');

const mock = tap.mock('../src/mock.js', {
    '../src/utils/getProjectRoot.js': () => __dirname,
    '../src/utils/log.js': {
        info: () => {},
    },
});

mock()
    .then(() => process.send('started'));
