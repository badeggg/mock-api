const fs = require('fs');
const net = require('net');
const pathUtil = require('path');
const tap = require('tap');
const axios = require('axios');
const tcpPortUsed = require('tcp-port-used');
const removePathPrefix = require('./testUtils/removePathPrefix.js');

tap.test('basic general function', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'fake-api-path': {
                response: 'Some response content.',
            },
        },
    });
    let infoMsgs = [];
    let warningMsgs = [];
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => fakeServicesDir,
        '../src/utils/log.js': {
            info: (msg) => infoMsgs.push('info: ' + removePathPrefix(msg, fakeServicesDir)),
            warn: (msg) => warningMsgs.push('warning: ' + removePathPrefix(msg, fakeServicesDir)),
        },
    });

    const mockServer = await mock(process);
    tap.type(mockServer, require('http').Server,
        'mock function should return a nodejs http.Server');
    tap.type(mockServer.address().port, 'number',
        'mock function should return a nodejs http.Server with a port number');

    const mockingLocationPath = pathUtil.resolve(fakeServicesDir, './.mockingLocation');
    tap.ok(fs.existsSync(mockingLocationPath),
        '.mockingLocation file should exist');
    tap.ok(fs.statSync(mockingLocationPath).isFile(),
        '.mockingLocation shoule be a file');
    tap.equal(
        fs.readFileSync(mockingLocationPath, 'utf-8'),
        `http://localhost:${mockServer.address().port}`,
        'text content in .mockingLocation file'
    );

    const options = {
        url: fs.readFileSync(mockingLocationPath, 'utf-8') + '/fake-api-path',
        method: 'GET',
    };
    const response = await axios.request(options);
    tap.equal(response.data, 'Some response content.');

    tap.matchSnapshot(infoMsgs, 'log infos');
    tap.matchSnapshot(warningMsgs, 'log warnings');

    mockServer.close();
    tap.end();
});

tap.test('try next plus one port when current port is not available', async tap => {
    let infoMsgs = [];
    const inUsePort = 3000;
    const isInUse = await tcpPortUsed.check(inUsePort, '127.0.0.1');
    let portHolderServer;
    if (!isInUse) {
        await new Promise(resolve => {
            portHolderServer = net.createServer();
            portHolderServer.listen(inUsePort, () => {
                resolve();
            });
        });
    }
    let availablePort = inUsePort + 1;
    while(true) {
        const isAvailable = !(await tcpPortUsed.check(availablePort, '127.0.0.1'));
        if (isAvailable) {
            break;
        }
        availablePort++;
    }
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/log.js': {
            info: (msg) => infoMsgs.push('info: ' + msg),
        },
    });
    const mockServer = await mock(process);
    tap.equal(mockServer.address().port, availablePort,
        'should try next one port');
    if (portHolderServer)
        portHolderServer.close();
    mockServer.close();
    tap.matchSnapshot(infoMsgs, 'log infos');
    tap.end();
});

tap.test('doubt cases & completion test of src/middlewares/mapToRes/index.js', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'general': {
                response: '["implicit response"]',
                specifiedResponse: '["specified response"]',
                'picture.png': 'picture(text here is fine)',
                map: `
                    OPTIONS # should use implicit response file
                    GET ?whatname= ./specifiedResponse
                    GET ?give-me-a-pic&forceHeaderJpg&causual-header ./picture.png \\
                        --res-headers 'content-type: image/jpeg' \\
                        -h 'a-casual-header: a casual header'
                    GET ?give-me-a-pic ./picture.png
                `,
                '__address__': {
                    specifiedResponse: '["china", "beijing"]',
                    map: `
                        get _address={^\\w+$} ./specifiedResponse
                    `,
                },
            },
            'delay': {
                response: '["i am late"]',
                map: `GET -t 300`,
            },
            response: '["fake service root"]',
            proxy404: '', // todo to continue
        },
    });
    let infoMsgs = [];
    let warnMsgs = [];
    let errorMsgs = [];
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => fakeServicesDir,
        '../src/utils/log.js': {
            info: (msg) => infoMsgs.push('info: ' + msg),
            warn: (msg) => warnMsgs.push('warn: ' + msg),
            error: (msg) => errorMsgs.push('error: ' + msg),
        },
    });
    const mockServer = await mock(process);
    const mockingLocation = `http://localhost:${mockServer.address().port}`;

    let response;
    response = await axios.request({
        url: mockingLocation,
        method: 'GET',
    });
    tap.equal(response.data[0], 'fake service root', 'should in fake service root');

    response = await axios.request({
        url: mockingLocation + '/general',
        method: 'OPTIONS',
    });
    tap.equal(response.data[0], 'implicit response', 'should use implicit response file');

    response = await axios.request({
        url: mockingLocation + '/general',
        method: 'GET',
        params: { whatname: 'badeggg' },
    });
    tap.equal(response.data[0], 'specified response', 'basic case');

    response = await axios.request({
        url: mockingLocation + '/general',
        method: 'GET',
        params: { 'give-me-a-pic': '' },
    });
    tap.equal(response.headers['content-type'], 'image/png',
        'header content-type should be image type');
    tap.equal(response.data, 'picture(text here is fine)',
        'should give response a picture file');

    response = await axios.request({
        url: mockingLocation + '/general',
        method: 'GET',
        params: {
            'give-me-a-pic': '',
            forceHeaderJpg: '',
            'causual-header': 'feel free here',
        },
    });
    tap.equal(response.headers['content-type'], 'image/jpeg',
        'header content-type should be overridden');
    tap.equal(response.headers['a-casual-header'], 'a casual header',
        'a random custom header should be ok');
    tap.equal(response.data, 'picture(text here is fine)',
        'should give response a picture file');

    response = await axios.request({
        url: mockingLocation + '/general/askAddress',
        method: 'GET',
    });
    tap.equal(response.data[0], 'china', 'path params should be ok');

    response = null;
    const testDelayResponsed = axios.request({
        url: mockingLocation + '/delay',
        method: 'GET',
    })
    .then((resp) => {
        response = resp;
    });
    tap.equal(response, null, 'delayed response not ok yet');
    tap.resolveMatch(
        new Promise(resolve => {
            setTimeout(() => {
                resolve(response.data[0]);
            }, 600);
        }),
        'i am late',
        'delayed response content',
    );

    await testDelayResponsed;
    mockServer.close();
    tap.matchSnapshot(infoMsgs, 'log infos');
    tap.matchSnapshot(warnMsgs, 'log warnings');
    tap.matchSnapshot(errorMsgs, 'log errors');
});
