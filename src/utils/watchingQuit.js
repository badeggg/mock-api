/**
 * Try best to watching process quit and execute handler before quiting. We say 'try best'
 * for reason that some signals are non-catchable and non-ignorable, e.g. SIGKILL and
 * SIGSTOP.
 * @zhaoxuxu @2021-6-10
 */
const signals = [
    'SIGHUP',  'SIGINT',  'SIGQUIT', 'SIGILL',  'SIGABRT', 'SIGFPE',  'SIGUSR1',
    'SIGUSR2', 'SIGPIPE', 'SIGALRM', 'SIGTERM', 'SIGTSTP', 'SIGTTIN', 'SIGTTOU',
];
let handlers = [];

function flushHandlersAndQuit(code) {
    while (handlers.length) {
        const handler = handlers.shift();
        handler(code);
    }
    process.exit(code);
}

module.exports = function(handler) {
    if (typeof handler !== 'function')
        return

    handlers.push(handler);

    process.removeAllListeners('exit');
    process.on('exit', code => flushHandlersAndQuit(code));
    signals.forEach(sig => {
        process.removeAllListeners(sig);
        process.on(sig, (sig, code) => flushHandlersAndQuit(code));
    });
}
