const tap = require('tap');
const index = require('../../src/index');

// todo to complete

tap.test('basic general function', { saveFixture: true }, async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'fake-api-path': {
                response: 'Some response content.',
            },
        },
    });
});
