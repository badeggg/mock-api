const tap = require('tap');
const WebSocket = require('ws');
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
                    module.exports = () => '你好👋，websocket.';
                `,
            },
            'action': {
                'ws-response.js': `
                    let count = 0;
                    module.exports = () => {
                        switch (count++) {
                            case 0:
                                return 'default action "SEND"';
                            case 1:
                                return {
                                    isMetaBox: true,
                                    action: 'send',
                                    response: 'send',
                                };
                            case 2:
                                return {
                                    isMetaBox: true,
                                    action: 'SEND',
                                    response: 'SEND',
                                };
                            case 3:
                                return {
                                    isMetaBox: true,
                                    action: 'ping',
                                    response: 'ping',
                                };
                            case 4:
                                return {
                                    isMetaBox: true,
                                    action: 'PING',
                                    response: 'PING',
                                };
                            case 5:
                                return {
                                    isMetaBox: true,
                                    action: 'pong',
                                    response: 'pong',
                                };
                            case 6:
                                return {
                                    isMetaBox: true,
                                    action: 'PONG',
                                    response: 'PONG',
                                };
                            case 7:
                                return {
                                    isMetaBox: true,
                                    action: 'close',
                                    response: {
                                        code: 3333,
                                        reason: 'close',
                                    },
                                };
                        }
                    };
                `,
            },
            'pingEmpty': {
                'ws-response.js': `
                    let count = 0;
                    module.exports = () => {
                        switch (count++) {
                            case 0:
                                return {
                                    isMetaBox: true,
                                    action: 'ping',
                                    response: 0,
                                };
                            case 1:
                                return {
                                    isMetaBox: true,
                                    action: 'ping',
                                    response: null,
                                };
                            case 2:
                                return {
                                    isMetaBox: true,
                                    action: 'ping',
                                    response: undefined,
                                };
                            case 3:
                                return {
                                    isMetaBox: true,
                                    action: 'ping',
                                    response: false,
                                };
                            case 4:
                                return {
                                    isMetaBox: true,
                                    action: 'ping',
                                    response: '',
                                };
                            case 5:
                                return {
                                    isMetaBox: true,
                                    action: 'ping',
                                    response: Symbol('12'),
                                };
                            case 6:
                                return {
                                    isMetaBox: true,
                                    action: 'ping',
                                    response: () => {},
                                };
                            case 7:
                                return {
                                    isMetaBox: true,
                                    action: 'ping',
                                    response: Buffer.from([]),
                                };
                        }
                    };
                `,
            },
            'pongEmpty': {
                'ws-response.js': `
                    let count = 0;
                    module.exports = () => {
                        switch (count++) {
                            case 0:
                                return {
                                    isMetaBox: true,
                                    action: 'pong',
                                    response: 0,
                                };
                            case 1:
                                return {
                                    isMetaBox: true,
                                    action: 'pong',
                                    response: null,
                                };
                            case 2:
                                return {
                                    isMetaBox: true,
                                    action: 'pong',
                                    response: undefined,
                                };
                            case 3:
                                return {
                                    isMetaBox: true,
                                    action: 'pong',
                                    response: false,
                                };
                            case 4:
                                return {
                                    isMetaBox: true,
                                    action: 'pong',
                                    response: '',
                                };
                            case 5:
                                return {
                                    isMetaBox: true,
                                    action: 'pong',
                                    response: Symbol('12'),
                                };
                            case 6:
                                return {
                                    isMetaBox: true,
                                    action: 'pong',
                                    response: () => {},
                                };
                            case 7:
                                return {
                                    isMetaBox: true,
                                    action: 'pong',
                                    response: Buffer.from([]),
                                };
                        }
                    };
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
            wsc.on('message', (msg, isBin) => {
                tap.equal(isBin, true, 'should be a binary message');
                tap.equal(msg.toString(), '你好👋，websocket.');
                wsc.close();
                resolve(msg);
            });
        }),
        new Promise(resolve => {
            const wsc = new WebSocket(mockingLocation + '/func');
            wsc.on('message', (msg, isBin) => {
                tap.equal(isBin, false, 'should not be a binary message');
                tap.equal(msg.toString(), '你好👋，websocket.');
                wsc.close();
                resolve(msg);
            });
        }),
        new Promise(resolve => {
            const wsc = new WebSocket(mockingLocation + '/action');
            let count = 0;
            wsc.on('message', (msg) => {
                if (count === 0)
                    tap.equal(msg.toString(), 'default action "SEND"');
                if (count === 1)
                    tap.equal(msg.toString(), 'send');
                if (count === 2)
                    tap.equal(msg.toString(), 'SEND');
                wsc.send();
                count++;
            });
            wsc.on('ping', (msg) => {
                if (count === 3)
                    tap.equal(msg.toString(), 'ping');
                if (count === 4)
                    tap.equal(msg.toString(), 'PING');
                wsc.send();
                count++;
            });
            wsc.on('pong', (msg) => {
                if (count === 5)
                    tap.equal(msg.toString(), 'pong');
                if (count === 6)
                    tap.equal(msg.toString(), 'PONG');
                wsc.send();
                count++;
            });
            wsc.on('close', (code, reason) => {
                tap.equal(count, 7);
                tap.equal(code, 3333);
                tap.equal(reason.toString(), 'close');
                resolve();
            });
        }),
        new Promise(resolve => {
            const wsc = new WebSocket(mockingLocation + '/pingEmpty');
            let count = 0;
            wsc.on('ping', (msg) => {
                tap.equal(msg instanceof Buffer, true, 'ping msg is Buffer type');
                tap.matchSnapshot(msg, `ping empty msg ${count}`);
                count++;
                if (count <= 7) {
                    wsc.send();
                } else {
                    wsc.close();
                    resolve()
                }
            });
        }),
        new Promise(resolve => {
            const wsc = new WebSocket(mockingLocation + '/pongEmpty');
            let count = 0;
            wsc.on('pong', (msg) => {
                tap.equal(msg instanceof Buffer, true, 'pong msg is Buffer type');
                tap.matchSnapshot(msg, `pong empty msg ${count}`);
                count++;
                if (count <= 7) {
                    wsc.send();
                } else {
                    wsc.close();
                    resolve()
                }
            });
        }),
    ]);

    tap.matchSnapshot(infoMsgs, 'log infos');
    tap.matchSnapshot(warningMsgs, 'log warnings');
    tap.matchSnapshot(errorMsgs, 'log errors');

    mockServer.close();
});
