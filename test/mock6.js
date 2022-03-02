const fs = require('fs');
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
                                    lineageArg: new Uint8Array([21,31]),
                                },
                            };
                        } else if (triggerInfo.triggerName === 'SELF-TRIGGER'
                            && triggerInfo.lineageArg instanceof Buffer
                            && triggerInfo.lineageArg.toString() === '\x15\x1F') {
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
            'selfTriggerArray': {
                'ws-response.js': `
                    module.exports = (triggerInfo) => {
                        if (triggerInfo.triggerName === 'WS-OPEN') {
                            return {
                                isMetaBox: true,
                                response: null,
                                selfTrigger: [
                                    {
                                        lineageArg: 'self trigger array item0',
                                    },
                                    {
                                        lineageArg: 'self trigger array item1',
                                    },
                                    {
                                        lineageArg: new Uint32Array([21,31]),
                                    },
                                    {
                                        lineageArg: 'close',
                                    },
                                    {
                                        lineageArg: 'after close, will cause error log',
                                    },
                                ],
                            };
                        } else if (triggerInfo.triggerName === 'SELF-TRIGGER'
                            && triggerInfo.lineageArg !== 'close') {
                            return triggerInfo.lineageArg;
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
            'selfTriggerBad': {
                'ws-response.js': `
                    module.exports = (triggerInfo) => {
                        if (triggerInfo.triggerName === 'WS-MESSAGE'
                            && triggerInfo.currentMessage === '0') {
                            return {
                                isMetaBox: true,
                                response: 'bad self trigger1',
                                selfTrigger: 1,
                            };
                        } else if (triggerInfo.triggerName === 'WS-MESSAGE'
                            && triggerInfo.currentMessage === '1') {
                            return {
                                isMetaBox: true,
                                response: 'bad self trigger[1]',
                                selfTrigger: [1],
                            };
                        } else if (triggerInfo.triggerName === 'WS-MESSAGE'
                            && triggerInfo.currentMessage === '2') {
                            return {
                                isMetaBox: true,
                                response: 'bad self trigger"1"',
                                selfTrigger: "1",
                            };
                        } else if (triggerInfo.triggerName === 'SELF-TRIGGER'){
                            return 'will not be returned';
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
            error: (msg) => errorMsgs.push('error: '
                + transWindowsPath(
                    removePathPrefix(
                        obscureErrorStack(msg),
                        pathUtil.resolve(fakeServicesDir, '../../')
                    )
                )
            ),
        },
    });

    const mockServer = await mock(3080);
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
                    Math.abs(obj['no delay self triggered'] - obj['ws open response']) < 200,
                    true, 'bad self trigger delay');
                tap.equal(
                    Math.abs(obj['delay 1000ms self triggered'] - 1000
                        - obj['ws open response']) < 300,
                    true, 'delay 1000ms self triggered');
                resolve();
            });
        }),
        new Promise(resolve => {
            const wsc = new WebSocket(mockingLocation + '/selfTriggerArray');
            let count = 0;
            wsc.on('message', (msg) => {
                if (count !== 2) {
                    tap.equal(msg.toString(), 'self trigger array item' + count,
                        'self trigger array item' + count);
                } else {
                    tap.equal(msg.toString(), '\x15\x00\x00\x00\x1F\x00\x00\x00',
                        'normalizeBinObj for lineageArg');
                }
                count++;
            });
            wsc.on('close', () => {
                resolve();
            });
        }),
        new Promise(resolve => {
            const wsc = new WebSocket(mockingLocation + '/selfTriggerBad');
            wsc.on('open', () => {
                wsc.send(0);
                wsc.send(1);
                wsc.send(2);
            });
            let arr = [];
            wsc.on('message', (msg) => {
                arr.push(msg.toString());
                if (arr.length === 3)
                    setTimeout(() => wsc.close(), 500);
            });
            wsc.on('close', () => {
                tap.equal(arr[0], 'bad self trigger1', 'bad self trigger1');
                tap.equal(arr[1], 'bad self trigger[1]', 'bad self trigger[1]');
                tap.equal(arr[2], 'bad self trigger"1"', 'bad self trigger"1"');
                resolve();
            });
        }),
    ]);

    tap.matchSnapshot(infoMsgs.sort(), 'log infos');
    tap.matchSnapshot(warningMsgs.sort(), 'log warnings');
    tap.matchSnapshot(errorMsgs.sort(), 'log errors');

    mockServer.close();
});

tap.test('websocket proxy 404', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'proxy404': `
                ws wss://demo.piesocket.com
            `,
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
            error: (msg, msg1) => errorMsgs.push('error: '
                + transWindowsPath(
                    removePathPrefix(
                        obscureErrorStack(`${msg.toString()}${msg1 ? ' ' + msg1.toString() : ''}`),
                        pathUtil.resolve(fakeServicesDir, '../../')
                    )
                )
            ),
        },
    });

    const mockServer = await mock(3081);
    const mockingLocation = `ws://localhost:${mockServer.address().port}`;
    const proxy404FilePath = pathUtil.resolve(fakeServicesDir, './fake-services/proxy404');

    await new Promise(resolve => {
        const wsc = new WebSocket(mockingLocation + '/v3/channel_1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self');
        let count = 0;
        wsc.on('message', (msg) => {
            if (count === 0) {
                tap.equal(JSON.parse(msg.toString()).info, 'You are using a test api key',
                    'demo.piesocket.com hello message');
                count++;
                wsc.send('1st message');
                return;
            }
            if (count === 1) {
                tap.equal(msg.toString(), '1st message',
                    'demo.piesocket.com echo 1st message');
                count++;
                wsc.send('2nd message');
                return;
            }
            if (count === 2) {
                tap.equal(msg.toString(), '2nd message',
                    'demo.piesocket.com echo 2nd message');
                wsc.close();
                resolve();
                return;
            }
        });
    }),

    fs.writeFileSync(
        proxy404FilePath,
        `
            wss://demo.piesocket.com
        `,
        'utf-8',
    );
    await new Promise(resolve => {
        const wsc = new WebSocket(mockingLocation + '/v3/channel_1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self');
        wsc.on('message', (msg) => {
            tap.matchSnapshot(msg.toString(), 'NO-WS-PROXY-404-MATCH-FOUND message');
        });
        wsc.on('close', (code, reason) => {
            tap.equal(code, 3996, 'NO-WS-PROXY-404-MATCH-FOUND close code');
            tap.equal(reason.toString(), 'NO-WS-PROXY-404-MATCH-FOUND',
                'NO-WS-PROXY-404-MATCH-FOUND close reason');
            resolve();
        });
    }),

    fs.writeFileSync(
        proxy404FilePath,
        `
            ws wss://demopiesocket.com
        `,
        'utf-8',
    );
    await new Promise(resolve => {
        const wsc = new WebSocket(mockingLocation + '/v3/channel_1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self');
        wsc.on('error', (err) => {
            tap.equal(err.code, 'ECONNRESET', 'proxy error');
        });
        wsc.on('close', (code, reason) => {
            tap.equal(code, 1006, 'proxy error close code');
            tap.equal(reason.toString(), '', 'proxy error close reason');
            resolve();
        });
    });

    if (fs.rmSync) {
        fs.rmSync(
            pathUtil.resolve(fakeServicesDir, './fake-services'),
            {
                recursive: true,
                force: true
            },
        );
    } else {
        fs.rmdirSync(
            pathUtil.resolve(fakeServicesDir, './fake-services'),
            {
                recursive: true,
            },
        );
    }
    await new Promise(resolve => {
        const wsc = new WebSocket(mockingLocation + '/v3/channel_1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self');
        wsc.on('message', (msg) => {
            tap.matchSnapshot(
                transWindowsPath(
                    removePathPrefix(msg.toString(), fakeServicesDir)
                ),
                'NO-FAKE-SERVIVES-FOLDER message'
            );
        });
        wsc.on('close', (code, reason) => {
            tap.equal(code, 3997, 'NO-FAKE-SERVIVES-FOLDER close code');
            tap.equal(reason.toString(), 'NO-FAKE-SERVIVES-FOLDER',
                'NO-FAKE-SERVIVES-FOLDER close reason');
            resolve();
        });
    }),

    tap.matchSnapshot(infoMsgs.sort(), 'log infos');
    tap.matchSnapshot(warningMsgs.sort(), 'log warnings');
    tap.matchSnapshot(errorMsgs.sort(), 'log errors');

    mockServer.close();
});
