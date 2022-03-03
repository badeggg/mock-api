const child_process = require('child_process');
const tap = require('tap');
const WebSocket = require('ws');

tap.test('helperProcess killed when init', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'ws-response.js': `
                module.exports = 99;
            `,
        },
    });
    let hijackedHelperProcess;
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => fakeServicesDir,
        '../src/utils/log.js': {
            info: () => {},
            warn: () => {},
            error: () => {},
        },
        'child_process': {
            ...child_process,
            fork: function () {
                hijackedHelperProcess = child_process.fork(...arguments);
                hijackedHelperProcess.kill();
                return hijackedHelperProcess;
            },
        },
    });

    const mockServer = await mock(3090);
    const mockingLocation = mockServer.getWsLocation();

    await new Promise(resolve => {
        const wsc = new WebSocket(mockingLocation);
        let receivedMsg = false;
        wsc.on('message', () => {
            receivedMsg = true;
        });
        setTimeout(() => {
            tap.equal(receivedMsg, false, 'shoule not receive any msg');
            wsc.close();
            resolve();
        }, 500);
    });

    mockServer.close();
});

tap.test('helperProcess killed when message', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'ws-response.js': `
                module.exports = (triggerInfo) => {
                    if (triggerInfo.triggerName === 'WS-MESSAGE') {
                        return 99;
                    }
                };
            `,
        },
    });
    let hijackedHelperProcess;
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => fakeServicesDir,
        '../src/utils/log.js': {
            info: () => {},
            warn: () => {},
            error: () => {},
        },
        'child_process': {
            ...child_process,
            fork: function () {
                hijackedHelperProcess = child_process.fork(...arguments);
                return hijackedHelperProcess;
            },
        },
    });

    const mockServer = await mock(3091);
    const mockingLocation = `ws://localhost:${mockServer.address().port}`;

    await new Promise(resolve => {
        const wsc = new WebSocket(mockingLocation);
        let receivedMsg = false;
        wsc.on('open', () => {
            hijackedHelperProcess.kill();
            wsc.send();
        });
        wsc.on('message', () => {
            receivedMsg = true;
        });
        setTimeout(() => {
            tap.equal(receivedMsg, false, 'shoule not receive any msg');
            wsc.close();
            resolve();
        }, 500);
    });

    mockServer.close();
});

tap.test('helperProcess killed when self trigger', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'ws-response.js': `
                module.exports = (triggerInfo) => {
                    if (triggerInfo.triggerName === 'WS-OPEN') {
                        return {
                            isMetaBox: true,
                            selfTrigger: [
                                {
                                    triggerDelay: 500,
                                },
                            ],
                        };
                    }
                    if (triggerInfo.triggerName === 'WS-MESSAGE') {
                        return 'message';
                    }
                    if (triggerInfo.triggerName === 'SELF-TRIGGER') {
                        return 99;
                    }
                };
            `,
        },
    });
    let hijackedHelperProcess;
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => fakeServicesDir,
        '../src/utils/log.js': {
            info: () => {},
            warn: () => {},
            error: () => {},
        },
        'child_process': {
            ...child_process,
            fork: function () {
                hijackedHelperProcess = child_process.fork(...arguments);
                return hijackedHelperProcess;
            },
        },
    });

    const mockServer = await mock(3092);
    const mockingLocation = `ws://localhost:${mockServer.address().port}`;

    await new Promise(resolve => {
        const wsc = new WebSocket(mockingLocation);
        let receivedMsg = false;
        wsc.on('open', () => {
            wsc.send();
        });
        wsc.on('message', (msg) => {
            if (msg.toString() === 'message') {
                hijackedHelperProcess.kill();
            } else {
                receivedMsg = true;
            }
        });
        setTimeout(() => {
            tap.equal(receivedMsg, false, 'shoule not receive any self trigger msg');
            wsc.close();
            resolve();
        }, 2000);
    });

    mockServer.close();
});

tap.test('helperProcess send message when websocket is not ok', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'ws-response.js': `
                module.exports = (triggerInfo) => {
                    if (triggerInfo.triggerName === 'WS-OPEN') {
                        return {
                            isMetaBox: true,
                            selfTrigger: [
                                {
                                    lineageArg: 'close',
                                },
                                {
                                    triggerDelay: 1000,
                                    lineageArg: 'after close, will cause error log',
                                },
                            ],
                        };
                    } else if (triggerInfo.triggerName === 'SELF-TRIGGER'
                        && triggerInfo.lineageArg === 'close') {
                        return {
                            isMetaBox: true,
                            action: 'close',
                        };
                    } else if (triggerInfo.triggerName === 'SELF-TRIGGER'
                        && triggerInfo.lineageArg.startsWith('after close')) {
                        return {};
                    }
                };
            `,
        },
    });
    let errorMsgs = [];
    let hijackedHelperProcess;
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => fakeServicesDir,
        '../src/utils/log.js': {
            info: () => {},
            warn: () => {},
            error: (msg) => errorMsgs.push('error: ' + msg),
        },
        'child_process': {
            ...child_process,
            fork: function () {
                hijackedHelperProcess = child_process.fork(...arguments);
                hijackedHelperProcess.originalKill =
                    hijackedHelperProcess.kill.bind(hijackedHelperProcess);
                hijackedHelperProcess.kill = () => {};
                return hijackedHelperProcess;
            },
        },
    });

    const mockServer = await mock(3093);
    const mockingLocation = `ws://localhost:${mockServer.address().port}`;

    await new Promise(resolve => {
        const wsc = new WebSocket(mockingLocation);
        wsc.on('close', (msg) => {
            setTimeout(() => {
                hijackedHelperProcess.originalKill();
                resolve();
            }, 3000);
        });
    });

    tap.matchSnapshot(errorMsgs.sort(), 'log errors');

    mockServer.close();
});
