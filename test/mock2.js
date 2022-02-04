const pathUtil = require('path');
const tap = require('tap');
const axios = require('axios');
const removePathPrefix = require('./testUtils/removePathPrefix.js');
const obscureErrorStack = require('./testUtils/obscureErrorStack.js');
const _  = require('lodash');

tap.test('response js result as a whole', { timeout: 60 * 1000 }, async tap => {
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
                'exportNum.js': `
                    module.exports = 1;
                `,
                'exportStr.js': `
                    module.exports = 'str';
                `,
                'exportObj.js': `
                    module.exports = {a: 12};
                `,
                'exportArr.js': `
                    module.exports = [1, null, {a: 56}];
                `,
                'exportNull.js': `
                    module.exports = null;
                `,
                'exportSymbol.js': `
                    module.exports = Symbol();
                `,
                'exportObjHasFunc.js': `
                    module.exports = {fn: () => {}};
                `,
                map: `
                    GET ?name=badeggg   -r ./ok.js
                    GET ?name=badeggg1  -r ./undefined.js
                    GET ?name=badeggg2  -r ./string.js
                    GET ?name=badeggg3  -r ./number.js
                    GET ?name=badeggg4  -r ./null.js
                    GET ?name=badeggg5  -r ./function.js
                    GET ?name=badeggg6  -r ./exportNum.js
                    GET ?name=badeggg7  -r ./exportStr.js
                    GET ?name=badeggg8  -r ./exportObj.js
                    GET ?name=badeggg9  -r ./exportArr.js
                    GET ?name=badeggg10 -r ./exportNull.js
                    GET ?name=badeggg11 -r ./exportSymbol.js
                    GET ?name=badeggg12 -r ./exportObjHasFunc.js
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
                + removePathPrefix(msg, fakeServicesDir)
            ),
            error: (msg) => errorMsgs.push(
                'error: ' + removePathPrefix(
                    obscureErrorStack(msg),
                    pathUtil.resolve(fakeServicesDir, '../../')
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
            options.params.name = 'badeggg6';
            return axios.request(options);
        })(),
        (() => {
            const options = _.cloneDeep(optionsTemplate);
            options.params.name = 'badeggg7';
            return axios.request(options);
        })(),
        (() => {
            const options = _.cloneDeep(optionsTemplate);
            options.params.name = 'badeggg8';
            return axios.request(options);
        })(),
        (() => {
            const options = _.cloneDeep(optionsTemplate);
            options.params.name = 'badeggg9';
            return axios.request(options);
        })(),
        (() => {
            const options = _.cloneDeep(optionsTemplate);
            options.params.name = 'badeggg10';
            return axios.request(options);
        })(),
        (() => {
            const options = _.cloneDeep(optionsTemplate);
            options.params.name = 'badeggg11';
            return axios.request(options);
        })(),
        (() => {
            const options = _.cloneDeep(optionsTemplate);
            options.params.name = 'badeggg12';
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
    tap.matchSnapshot(responses[6].data, 'js export number');
    tap.matchSnapshot(responses[7].data, 'js export string');
    tap.matchSnapshot(responses[8].data, 'js export object');
    tap.matchSnapshot(responses[9].data, 'js export array');
    tap.matchSnapshot(responses[10].data, 'js export null');
    tap.matchSnapshot(responses[11].data, 'js export symbol');
    tap.matchSnapshot(responses[12].data, 'js export objHasFunc');
    tap.matchSnapshot(
        removePathPrefix(
            obscureErrorStack(responses[13].data),
            pathUtil.resolve(fakeServicesDir, '../../')
        ),
        'bad.js result'
    );

    tap.matchSnapshot(warningMsgs, 'log warnings');
    tap.matchSnapshot(errorMsgs, 'log errors');

    mockServer.close();
});

tap.test('no fake servives folder', async tap => {
    const projectRoot = tap.testdir({});
    let errorMsgs = [];
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => projectRoot,
        '../src/utils/log.js': {
            info: () => {},
            warn: () => {},
            error: (msg) => errorMsgs.push(
                'error: ' + removePathPrefix(msg, projectRoot),
            ),
        },
    });

    const mockServer = await mock(3060);

    const mockingLocation = `http://localhost:${mockServer.address().port}`;

    const options = {
        url: mockingLocation,
        method: 'GET',
    };
    try {
        await axios.request(options);
    } catch (err) {
        tap.equal(
            removePathPrefix(err.response.data, projectRoot),
            '\'fake-services\' folder does not exist in your project.\n'
                + '\'/fake-services\' does not exist.\n'
        );
        tap.equal(err.response.status, 404);
    }
    tap.match(errorMsgs, [
        '\'fake-services\' folder does not exist in your project.\n'
            + '\'/fake-services\' does not exist.\n',
    ]);

    mockServer.close();
});
