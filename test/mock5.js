const tap = require('tap');
const WebSocket = require('ws');
const _  = require('lodash');
const transWindowsPath = require('./testUtils/transWindowsPath.js');
const removePathPrefix = require('./testUtils/removePathPrefix.js');
const removeEscapeSGR = require('./testUtils/removeEscapeSGR.js');

tap.test('websocket general cases', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'ws-response.js': `
                module.exports = Buffer.from('你好👋，websocket.');
            `,
            'func': {
                'ws-response.js': `
                    module.exports = Buffer.from('你好👋，websocket.');
                `,
            },
        },
    });
    let infoMsgs = [];
    let warningMsgs = [];
    let errorMsgs = [];
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => fakeServicesDir,
        '../src/utils/log.js': {
            info: (msg) => infoMsgs.push('info: '
                + transWindowsPath(
                    removePathPrefix(
                        removeEscapeSGR(msg),
                        fakeServicesDir
                    )
                )
            ),
            warn: (msg) => warningMsgs.push('warning: '
                + transWindowsPath(
                    removePathPrefix(msg, fakeServicesDir)
                )
            ),
            error: (msg) => warningMsgs.push('error: '
                + transWindowsPath(
                    removePathPrefix(msg, fakeServicesDir)
                )
            ),
        },
    });

    const mockServer = await mock(3070);
    const mockingLocation = `ws://localhost:${mockServer.address().port}`;

    await Promise.all([
        new Promise(resolve => {
            const wsc = new WebSocket(mockingLocation);
            wsc.on('message', (msg) => {
                tap.equal(msg.toString(), '你好👋，websocket.')
                wsc.close();
                resolve(msg);
            });
        }),
    ]);

    tap.matchSnapshot(infoMsgs, 'log infos');
    tap.matchSnapshot(warningMsgs, 'log warnings');
    tap.matchSnapshot(errorMsgs, 'log errors');

    mockServer.close();
});
