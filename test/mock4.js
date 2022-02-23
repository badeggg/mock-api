const tap = require('tap');
const axios = require('axios');
const _  = require('lodash');

tap.test('response js result 3, buffer | log | metaBox', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'fake-api-path': {
                'buffer.js': `
                    module.exports = Buffer.from('你好');
                `,
                'bufferFunc.js': `
                    module.exports = () => {
                        return Buffer.from('你好');
                    };
                `,
                'metaBox.js': `
                    module.exports = {
                        isMetaBox: true,
                        responseShouldEscapeBufferRecover: true,
                        response: Buffer.from([1,2,3]),
                    };
                `,
                'bufferLog.js': `
                    module.exports = () => {
                        console.log('debug log');
                        setTimeout(() => {
                            console.log('delay debug log');
                        }, 500);
                        return Buffer.from([1,2,3]);
                    };
                `,
                map: `
                    GET ?name=badeggg  -r ./buffer.js
                    GET ?name=badeggg1 -r ./bufferFunc.js
                    GET ?name=badeggg2 -r ./metaBox.js
                    GET ?name=badeggg3 -r ./bufferLog.js
                `,
            },
        },
    });
    let stdouts = [];
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => fakeServicesDir,
        process: {
            ...process,
            stdout: {
                write: (out) => {
                    if (out && out.byteLength)
                        stdouts.push('stdouts: ' + out);
                },
            },
        },
        '../src/utils/log.js': {
            info: () => {},
            warn: () => {},
            error: () => {},
        },
    });

    const mockServer = await mock(3052);

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
    ]);
    tap.matchSnapshot(responses[0].data, 'js export buffer');
    tap.matchSnapshot(responses[1].data, 'js export func which return buffer');
    tap.matchSnapshot(responses[2].data, 'js export buffer with debug log');
    tap.matchSnapshot(responses[3].data, 'js export metaBox');

    tap.matchSnapshot(stdouts, 'log stdout');

    mockServer.close();
});
