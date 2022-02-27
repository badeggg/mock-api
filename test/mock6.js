const pathUtil = require('path');
const tap = require('tap');
const WebSocket = require('ws');
const transWindowsPath = require('./testUtils/transWindowsPath.js');
const removePathPrefix = require('./testUtils/removePathPrefix.js');
const removeEscapeSGR = require('./testUtils/removeEscapeSGR.js');
const obscureErrorStack = require('./testUtils/obscureErrorStack.js');

tap.test('websocket self trigger cases', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'selfTrigger': {
                'ws-response.js': `
                    module.exports = (triggerInfo) => {
                        if (triggerInfo.triggerName === 'WS-OPEN') {
                            return {
                                isMetaBox: true,
                                response: 'ws open response',
                                selfTrigger: {
                                    lineageArg: 'string',
                                },
                            };
                        } else if (triggerInfo.triggerName === 'SELF-TRIGGER'
                            && triggerInfo.lineageArg === 'string') {
                            return {
                                isMetaBox: true,
                                response: {
                                    lineageArg: triggerInfo.lineageArg,
                                },
                                selfTrigger: {
                                    lineageArg: Buffer.from('buffer'),
                                },
                            };
                        } else if (triggerInfo.triggerName === 'SELF-TRIGGER'
                            && triggerInfo.lineageArg instanceof Buffer
                            && triggerInfo.lineageArg.toString() === 'buffer') {
                            return {
                                isMetaBox: true,
                                response: {
                                    lineageArg: triggerInfo.lineageArg,
                                    lineageArgIsBuffer: triggerInfo.lineageArg instanceof Buffer,
                                },
                                selfTrigger: {
                                    lineageArg: Buffer.from('buffer'),
                                    lineageArgEscapeBufferRecover: true,
                                },
                            };
                        } else if (triggerInfo.triggerName === 'SELF-TRIGGER'
                            && !(triggerInfo.lineageArg instanceof Buffer)
                            && Buffer.from(triggerInfo.lineageArg).toString() === 'buffer') {
                            return {
                                isMetaBox: true,
                                response: {
                                    lineageArg: triggerInfo.lineageArg,
                                    lineageArgIsBuffer: triggerInfo.lineageArg instanceof Buffer,
                                },
                            };
                        }
                    };
                `,
            },
            'selfTriggerDelay': {
                'ws-response.js': `
                    module.exports = (triggerInfo) => {
                        if (triggerInfo.triggerName === 'WS-OPEN') {
                            return {
                                isMetaBox: true,
                                response: 'ws open response',
                                selfTrigger: {
                                    triggerDelay: '33ss',
                                    lineageArg: 'no delay trigger'
                                },
                            };
                        } else if (triggerInfo.triggerName === 'SELF-TRIGGER'
                            && triggerInfo.lineageArg === 'no delay trigger') {
                            return {
                                isMetaBox: true,
                                response: 'no delay self triggered',
                                selfTrigger: {
                                    triggerDelay: 1000,
                                    lineageArg: 'delay 1000ms trigger',
                                },
                            };
                        } else if (triggerInfo.triggerName === 'SELF-TRIGGER'
                            && triggerInfo.lineageArg === 'delay 1000ms trigger') {
                            return {
                                isMetaBox: true,
                                response: 'delay 1000ms self triggered',
                                selfTrigger: {
                                    lineageArg: 'close',
                                },
                            };
                        } else if (triggerInfo.triggerName === 'SELF-TRIGGER'
                            && triggerInfo.lineageArg === 'close') {
                            return {
                                isMetaBox: true,
                                action: 'close',
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
                        pathUtil.resolve(fakeServicesDir, '../../')
                    )
                )
            ),
            warn: (msg) => warningMsgs.push('warning: '
                + transWindowsPath(
                    removePathPrefix(
                        obscureErrorStack(msg),
                        pathUtil.resolve(fakeServicesDir, '../../')
                    )
                )
            ),
            error: (msg) => warningMsgs.push('error: '
                + transWindowsPath(
                    removePathPrefix(
                        obscureErrorStack(msg),
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
            const wsc = new WebSocket(mockingLocation + '/selfTrigger');
            let count = 0;
            wsc.on('message', (msg, isBin) => {
                if (count === 0) {
                    tap.equal(isBin, false, 'ws open response is a string');
                    tap.equal(msg.toString(), 'ws open response', 'ws open response');
                    count++;
                    return;
                }
                if (count === 1) {
                    tap.equal(JSON.parse(msg.toString()).lineageArg, 'string',
                        'self trigger received a string response');
                    count++;
                    return;
                }
                if (count === 2) {
                    tap.equal(JSON.parse(msg.toString()).lineageArgIsBuffer, true,
                        'self trigger received a Buffer');
                    tap.matchSnapshot(JSON.parse(msg.toString()),
                        'self trigger received a Buffer response');
                    count++;
                    return;
                }
                if (count === 3) {
                    tap.equal(JSON.parse(msg.toString()).lineageArgIsBuffer, false,
                        'self trigger received a non-recovered Buffer obj');
                    tap.matchSnapshot(JSON.parse(msg.toString()),
                        'self trigger received a non-recovered Buffer obj response');
                    wsc.close();
                    resolve();
                }
            });
        }),
        new Promise(resolve => {
            const wsc = new WebSocket(mockingLocation + '/selfTriggerDelay');
            let obj = {};
            wsc.on('message', (msg) => {
                obj[msg.toString()] = new Date().getTime();
            });
            wsc.on('close', () => {
                tap.equal(
                    Math.abs(obj['no delay self triggered'] - obj['ws open response']) < 100,
                    true, 'bad self trigger delay');
                tap.equal(
                    Math.abs(obj['delay 1000ms self triggered'] - 1000
                        - obj['ws open response']) < 100,
                    true, 'delay 1000ms self triggered');
                resolve();
            });
        }),
    ]);

    tap.matchSnapshot(infoMsgs.sort(), 'log infos');
    tap.matchSnapshot(warningMsgs.sort(), 'log warnings');
    tap.matchSnapshot(errorMsgs.sort(), 'log errors');

    mockServer.close();
});
