const pathUtil = require('path');
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
                                    action: 'senD',
                                    response: 'bad action',
                                };
                            case 8:
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
            'actionByteLengthLimit': {
                'ws-response.js': `
                    let count = 0;
                    module.exports = () => {
                        switch (count++) {
                            case 0:
                                return {
                                    isMetaBox: true,
                                    action: 'ping',
                                    response: new ArrayBuffer(125),
                                };
                            case 1:
                                return {
                                    isMetaBox: true,
                                    action: 'ping',
                                    response: new ArrayBuffer(126),
                                };
                            case 2:
                                return {
                                    isMetaBox: true,
                                    action: 'pong',
                                    response: new ArrayBuffer(125),
                                };
                            case 3:
                                return {
                                    isMetaBox: true,
                                    action: 'pong',
                                    response: new ArrayBuffer(126),
                                };
                            case 4:
                                return {
                                    isMetaBox: true,
                                    action: 'send',
                                    response: new ArrayBuffer(126),
                                };
                            case 5:
                                return {
                                    isMetaBox: true,
                                    action: 'send',
                                    response: new ArrayBuffer(1 * 1024 * 1024),
                                };
                            case 6:
                                return {
                                    isMetaBox: true,
                                    action: 'close',
                                    response: {
                                        code: 3334,
                                        reason: '旭'.repeat(41),
                                    },
                                };
                        }
                    };
                `,
            },
            'closeByteLengthLimit': {
                'ws-response.js': `
                    module.exports = {
                        isMetaBox: true,
                        action: 'CLOSE',
                        response: {
                            code: 3335,
                            reason: '旭'.repeat(41) + '1',
                        },
                    };
                `,
            },
            'isMetaBox': {
                'ws-response.js': `
                    let count = 0;
                    module.exports = () => {
                        switch (count++) {
                            case 0:
                                return {
                                    isMetaBox: true,
                                    response: 'isMetaBox true',
                                };
                            case 1:
                                return {
                                    isMetaBox: false,
                                    response: 'isMetaBox false',
                                };
                            case 2:
                                return {
                                    isMetaBox: 0,
                                    response: 'isMetaBox 0',
                                };
                            case 3:
                                return {
                                    isMetaBox: null,
                                    response: 'isMetaBox null',
                                };
                            case 4:
                                return {
                                    isMetaBox: 1,
                                    response: 'isMetaBox 1',
                                };
                        }
                    };
                `,
            },
            'insistSendEmpty': {
                'ws-response.js': `
                    module.exports = (triggerInfo) => {
                        if (triggerInfo.currentMessage === 'get send empty') {
                            return null;
                        }
                        if (triggerInfo.currentMessage === 'get send insist empty') {
                            return {
                                isMetaBox: true,
                                insistSendEmpty: true,
                                response: undefined,
                            };
                        }
                    };
                `,
            },
            'badJs': {
                'ws-response.js': `
                    const a = 90;
                    a = 99;
                    module.exports = a;
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
                        pathUtil.resolve(fakeServicesDir, '../../')
                    )
                )
            ),
            warn: (msg) => warningMsgs.push('warning: '
                + transWindowsPath(
                    removePathPrefix(
                        msg,
                        pathUtil.resolve(fakeServicesDir, '../../')
                    )
                )
            ),
            error: (msg) => warningMsgs.push('error: '
                + transWindowsPath(
                    removePathPrefix(
                        msg,
                        pathUtil.resolve(fakeServicesDir, '../../')
                    )
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
                if (count === 7)
                    tap.equal(msg.toString(), 'bad action');
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
                tap.equal(count, 8);
                tap.equal(code, 3333, 'close code 3333');
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
                    resolve();
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
                    resolve();
                }
            });
        }),
        new Promise(resolve => {
            const wsc = new WebSocket(mockingLocation + '/actionByteLengthLimit');
            let count = 0;
            wsc.on('ping', (msg) => {
                if (count === 0)
                    tap.equal(msg.byteLength, 125, 'ping byte length 125');
                if (count === 1)
                    tap.equal(msg.byteLength, 0, 'ping byte length 126');
                wsc.send();
                count++;
            });
            wsc.on('pong', (msg) => {
                if (count === 2)
                    tap.equal(msg.byteLength, 125, 'pong byte length 125');
                if (count === 3)
                    tap.equal(msg.byteLength, 0, 'pong byte length 126');
                wsc.send();
                count++;
            });
            wsc.on('message', (msg) => {
                if (count === 4)
                    tap.equal(msg.byteLength, 126, 'send byte length 126');
                if (count === 5)
                    tap.equal(msg.byteLength, 1 * 1024 * 1024, 'send byte length 1m');
                wsc.send();
                count++;
            });
            wsc.on('close', (code, reason) => {
                tap.equal(count, 6);
                tap.equal(code, 3334, 'close code 3334');
                tap.equal(reason.toString(), '旭'.repeat(41), 'close reason byte length 123');
                resolve();
            });
        }),
        new Promise(resolve => {
            const wsc = new WebSocket(mockingLocation + '/closeByteLengthLimit');
            wsc.on('close', (code, reason) => {
                tap.equal(code, 3335, 'close code 3335');
                tap.equal(reason.toString(), '', 'close reason byte length 124');
                resolve();
            });
        }),
        new Promise(resolve => {
            const wsc = new WebSocket(mockingLocation + '/isMetaBox');
            let count = 0;
            wsc.on('message', (msg) => {
                tap.matchSnapshot(msg, `isMetaBox ${count}`);
                count++;
                if (count <= 4) {
                    wsc.send();
                } else {
                    wsc.close();
                    resolve();
                }
            });
        }),
        new Promise(resolve => {
            const wsc = new WebSocket(mockingLocation + '/insistSendEmpty');
            wsc.on('open', () => {
                wsc.send('get send insist empty');
            });
            wsc.on('message', (msg) => {
                tap.equal(msg.toString(), '', 'insistSendEmpty');
                wsc.send();
                setTimeout(() => {
                    wsc.close();
                    resolve();
                }, 500);
            });
        }),
        new Promise(resolve => {
            const wsc = new WebSocket(mockingLocation + '/badJs');
            wsc.on('message', (msg, isBin) => {
                tap.equal(isBin, false, 'JS-SCRIPT-ERROR message is text string');
                tap.match(msg.toString(), 'Failed to execute js script',
                    'JS-SCRIPT-ERROR message string brief');
                tap.matchSnapshot(
                    transWindowsPath(
                        removePathPrefix(
                            msg.toString(),
                            pathUtil.resolve(fakeServicesDir, '../../')
                        )
                    ),
                    'JS-SCRIPT-ERROR detail'
                );
            });
            wsc.on('close', (code, reason) => {
                tap.equal(code, 3998, 'JS-SCRIPT-ERROR close code');
                tap.equal(reason.toString(),
                    'JS-SCRIPT-ERROR. Failed to execute ./ws-response.js.');
                tap.equal(reason instanceof Buffer, true, 'reason is Buffer type');
                wsc.close();
                resolve();
            });
        }),
    ]);

    tap.matchSnapshot(infoMsgs.sort(), 'log infos');
    tap.matchSnapshot(warningMsgs.sort(), 'log warnings');
    tap.matchSnapshot(errorMsgs.sort(), 'log errors');

    mockServer.close();
});
