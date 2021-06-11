const fs = require('fs');
const tap = require('tap');
const pathUtil = require('path');

const mock = tap.mock('../src/mock.js', {
    '../src/utils/getProjectRoot.js': () => __dirname,
    '../src/utils/log.js': {
        info: () => {},
    },
});

mock()
.then(() => process.send('started'));
