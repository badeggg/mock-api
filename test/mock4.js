const tap = require('tap');
const axios = require('axios');
const _  = require('lodash');

tap.test('response js result 3, buffer | log | metaBox', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'fake-api-path': {
                'Buffer.js': `
                    module.exports = Buffer.from('你好');
                `,
                'BufferFunc.js': `
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
                'TypedArray.js': `
                    const float32 = new Float32Array(2);
                    float32[0] = 42;
                    module.exports = float32;
                `,
                'ArrayBuffer.js': `
                    const float32 = new Float32Array(2);
                    float32[0] = 42;
                    module.exports = float32.buffer;
                `,
                'DataView.js': `
                    const float32 = new Float32Array(2);
                    float32[0] = 42;
                    module.exports = new DataView(float32.buffer);
                `,
                'BufferLog.js': `
                    module.exports = () => {
                        console.log('debug log');
                        setTimeout(() => {
                            console.log('delay debug log');
                        }, 500);
                        return Buffer.from([1,2,3]);
                    };
                `,
                map: `
                    GET ?name=badeggg  -r ./Buffer.js
                    GET ?name=badeggg1 -r ./BufferFunc.js
                    GET ?name=badeggg2 -r ./metaBox.js
                    GET ?name=badeggg3 -r ./TypedArray.js
                    GET ?name=badeggg4 -r ./ArrayBuffer.js
                    GET ?name=badeggg5 -r ./DataView.js
                    GET ?name=badegggx -r ./BufferLog.js # better at last
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
            options.params.name = 'badegggx';
            return axios.request(options);
        })(),
    ]);
    tap.matchSnapshot(responses[0].data, 'js export Buffer');
    tap.matchSnapshot(responses[1].data, 'js export func which return Buffer');
    tap.matchSnapshot(responses[2].data, 'js export metaBox');
    tap.matchSnapshot(Buffer.from(responses[3].data), 'js export TypedArray');
    tap.matchSnapshot(Buffer.from(responses[4].data), 'js export ArrayBuffer');
    tap.matchSnapshot(Buffer.from(responses[5].data), 'js export DataView');
    tap.matchSnapshot(Buffer.from(responses[6].data), 'js export Buffer with debug log');

    tap.matchSnapshot(stdouts, 'log stdout');

    mockServer.close();
});
