const pathUtil = require('path');
const tap = require('tap');
const axios = require('axios');
const removePathPrefix = require('./testUtils/removePathPrefix.js');
const transWindowsPath = require('./testUtils/transWindowsPath.js');
const obscureErrorStack = require('./testUtils/obscureErrorStack.js');
const _  = require('lodash');

tap.test('response js result 2, export the response', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'fake-api-path': {
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
                'exportEmptyStr.js': `
                    module.exports = '';
                `,
                'exportUndefined.js': `
                    module.exports = undefined;
                `,
                map: `
                    GET ?name=badeggg  -r ./exportNum.js
                    GET ?name=badeggg1 -r ./exportStr.js
                    GET ?name=badeggg2 -r ./exportObj.js
                    GET ?name=badeggg3 -r ./exportArr.js
                    GET ?name=badeggg4 -r ./exportNull.js
                    GET ?name=badeggg5 -r ./exportSymbol.js
                    GET ?name=badeggg6 -r ./exportObjHasFunc.js
                    GET ?name=badeggg7 -r ./exportEmptyStr.js
                    GET ?name=badeggg8 -r ./exportUndefined.js
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

    const mockServer = await mock(3051);

    const mockingLocation = `http://localhost:${mockServer.address().port}`;

    const optionsTemplate = {
        url: mockingLocation + '/fake-api-path',
        params: {name: 'badeggg'},
        method: 'GET',
    };

    const responses = await Promise.all([
        (() => {
            const options = _.cloneDeep(optionsTemplate);
            options.params.name = 'badeggg';
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
    ]);
    tap.matchSnapshot(responses[0].data, 'js export number');
    tap.matchSnapshot(responses[1].data, 'js export string');
    tap.matchSnapshot(responses[2].data, 'js export object');
    tap.matchSnapshot(responses[3].data, 'js export array');
    tap.matchSnapshot(responses[4].data, 'js export null');
    tap.matchSnapshot(responses[5].data, 'js export symbol');
    tap.matchSnapshot(responses[6].data, 'js export objHasFunc');
    tap.matchSnapshot(responses[7].data, 'js export empty string');
    tap.matchSnapshot(responses[8].data, 'js export undefined');

    tap.matchSnapshot(warningMsgs, 'log warnings');
    tap.matchSnapshot(errorMsgs, 'log errors');

    mockServer.close();
});
