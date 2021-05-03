const tap = require('tap');
// const mock = require('../../src/mock');

// todo to complete

tap.test('basic general function', { saveFixture: true }, async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'fake-api-path': {
                response: 'Some response content.',
            },
        },
    });
    console.log(fakeServicesDir);
});
