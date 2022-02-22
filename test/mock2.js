/**
 * Separate test suit for src/mock.js in multiple files, because executing a big collection
 * of test suits take longer time, plus tapjs's timeout setting seems not working.
 * @zhaoxuxu @2022-2-7
 */

const pathUtil = require('path');
const tap = require('tap');
const axios = require('axios');
const removePathPrefix = require('./testUtils/removePathPrefix.js');
const transWindowsPath = require('./testUtils/transWindowsPath.js');
const obscureErrorStack = require('./testUtils/obscureErrorStack.js');
const _  = require('lodash');

/**
 * Spawning child process may consume considerable more time and resource when together in
 * a single subtest.
 * @zhaoxuxu @2022-2-7
 */
tap.test('response js result 1, export a function', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'fake-api-path': {
                'ok.js': `
                    const obj1 = {a: 1};
                    const obj2 = {a: 2};
                    module.exports = (req) => {
                        return {
                            ...obj1,
                            name: req.query.name,
                        };
                    };
                `,
                'bad.js': `
                    const a = 90;
                    module.exports = () => {
                        a = 8;
                        return a;
                    };
                `,
                'undefined.js': `
                    module.exports = () => {
                        return;
                    };
                `,
                'string.js': `
                    module.exports = () => {
                        return 'string';
                    };
                `,
                'number.js': `
                    module.exports = () => {
                        return 123;
                    };
                `,
                'null.js': `
                    module.exports = () => {
                        return null;
                    };
                `,
                'function.js': `
                    module.exports = () => {
                        return () => {console.log('foo')};
                    };
                `,
                map: `
                    GET ?name=badeggg   -r ./ok.js
                    GET ?name=badeggg1  -r ./undefined.js
                    GET ?name=badeggg2  -r ./string.js
                    GET ?name=badeggg3  -r ./number.js
                    GET ?name=badeggg4  -r ./null.js
                    GET ?name=badeggg5  -r ./function.js
                    GET ?name=badegggXX -r ./bad.js
                `,
            },
        },
    });
    let warningMsgs = [];
    let errorMsgs = [];
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => fakeServicesDir,
        '../src/utils/log.js': {
            info: () => {},
            warn: (msg) => warningMsgs.push('warning: '
                + transWindowsPath(
                    removePathPrefix(msg, fakeServicesDir)
                )
            ),
            error: (msg) => errorMsgs.push(
                'error: ' + transWindowsPath(
                    removePathPrefix(
                        obscureErrorStack(msg),
                        pathUtil.resolve(fakeServicesDir, '../../')
                    )
                )
            ),
        },
    });

    const mockServer = await mock(3050);

    const mockingLocation = `http://localhost:${mockServer.address().port}`;

    const optionsTemplate = {
        url: mockingLocation + '/fake-api-path',
        params: {name: 'badeggg'},
        method: 'GET',
    };

    const responses = await Promise.all([
        (() => {
            const options = _.cloneDeep(optionsTemplate);
            return axios.request(options);
        })(),
        (() => {
            const options = _.cloneDeep(optionsTemplate);
            options.params.name = 'badeggg1';
            return axios.request(options);
        })(),
        (() => {
            const options = _.cloneDeep(optionsTemplate);
            options.params.name = 'badeggg2';
            return axios.request(options);
        })(),
        (() => {
            const options = _.cloneDeep(optionsTemplate);
            options.params.name = 'badeggg3';
            return axios.request(options);
        })(),
        (() => {
            const options = _.cloneDeep(optionsTemplate);
            options.params.name = 'badeggg4';
            return axios.request(options);
        })(),
        (() => {
            const options = _.cloneDeep(optionsTemplate);
            options.params.name = 'badeggg5';
            return axios.request(options);
        })(),
        (() => {
            const options = _.cloneDeep(optionsTemplate);
            options.params.name = 'badegggXX';
            return axios.request(options);
        })(),
    ]);
    tap.matchSnapshot(responses[0].data, 'ok.js result');
    tap.equal(responses[1].data, '');
    tap.equal(responses[2].data, 'string');
    tap.equal(responses[3].data, 123);
    tap.equal(responses[4].data, null);
    tap.matchSnapshot(responses[5].data, 'function.js result');
    tap.matchSnapshot(
        transWindowsPath(
            removePathPrefix(
                obscureErrorStack(responses[6].data),
                pathUtil.resolve(fakeServicesDir, '../../')
            )
        ),
        'bad.js result'
    );

    tap.matchSnapshot(warningMsgs, 'log warnings');
    tap.matchSnapshot(errorMsgs, 'log errors');

    mockServer.close();
});
