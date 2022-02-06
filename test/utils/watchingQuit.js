const child_process = require('child_process');
const pathUtil = require('path');
const tap = require('tap');

const assistPath = pathUtil.resolve(__dirname, './watchingQuit.assist.js');

tap.test('self exit', async tap => {
    function toEval() {
        const watchingQuit = require('../../src/utils/watchingQuit.js');
        watchingQuit((code) => process.send(`assist quit with code ${code}`));
        setTimeout(() => {process.exit(0);}, 300);
    }
    const assist = child_process.fork(assistPath, [`(${toEval.toString()})()`]);
    tap.resolveMatch(
        new Promise(resolve => {
            assist.on('message', m => resolve(m));
        }),
        'assist quit with code 0',
    );
    tap.resolveMatch(
        new Promise(resolve => {
            assist.on('exit', code => resolve(code));
        }),
        0,
    );
});

tap.test('linux signaled quit', async tap => {
    if (process.platform === 'win32') {
        tap.pass('Refuse to test signal details for windows');
        return;
    }
    function toEval() {
        const watchingQuit = require('../../src/utils/watchingQuit.js');
        watchingQuit((code) => process.send(`assist quit with code ${code}`));
        setTimeout(() => {}, 3600 * 1000);
    }
    const portedSignalCodeMap = [
        [1,  'SIGHUP' ],
        [2,  'SIGINT' ],
        [3,  'SIGQUIT'],
        [4,  'SIGILL' ],
        [6,  'SIGABRT'],
        [8,  'SIGFPE' ],
        [13, 'SIGPIPE'],
        [14, 'SIGALRM'],
        [15, 'SIGTERM'],
    ];
    portedSignalCodeMap.forEach(map => {
        const code = map[0];
        const sigText = map[1];
        const assist = child_process.fork(assistPath, [`(${toEval.toString()})()`]);
        setTimeout(() => process.kill(assist.pid, sigText), 3000);
        tap.resolveMatch(
            new Promise(resolve => {
                assist.on('message', m => resolve(m));
            }),
            `assist quit with code ${code}`,
        );
        tap.resolveMatch(
            new Promise(resolve => {
                assist.on('exit', code => resolve(code));
            }),
            code,
        );
    });
});

tap.test('covered signals', async tap => {
    const coveredSignals = require('../../src/utils/watchingQuit.js').coveredSignals;
    tap.matchSnapshot(coveredSignals);
});

tap.test('bad quit handler', async tap => {
    const watchingQuit = require('../../src/utils/watchingQuit.js');
    tap.equal(watchingQuit(null), false);
});
