const tap = require('tap');

const mock = tap.mock('../src/mock.js', {
    '../src/utils/getProjectRoot.js': () => __dirname,
    '../src/utils/log.js': {
        info: () => {},
        error: (msg) => process.send('error: ' + msg),
    },
});

mock()
    .then(() => process.send('started'))
    .then(() => {
        /**
         * Windows platform does not have signal machanism. 'assist' will exit
         * by self after some delaying time.
         * @zhaoxuxu @2022-2-9
         */
        if (process.platform === 'win32') {
            setTimeout(process.exit, 800);
        }
    });
