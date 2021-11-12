const tap = require('tap');

tap.test('basic', async tap => {
    const isPortInUse = tap.mock('../../src/utils/isPortInUse.js', {
        'tcp-port-used': {
            check: (port) => {
                if (port === 3000)
                    return Promise.reject(true);
                else if (port === 3001)
                    return Promise.resolve(true);
                else
                    return Promise.resolve(false);
            },
        },
    });

    tap.equal(await isPortInUse(3000), true);
    tap.equal(await isPortInUse(3001), true);
    tap.equal(await isPortInUse(3002), false);
});
