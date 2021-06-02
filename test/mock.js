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
