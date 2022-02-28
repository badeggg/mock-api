const tap = require('tap');
const log = require('../../src/utils/log.js');
const obscureErrorStack = require('../testUtils/obscureErrorStack.js');

let output = [];

// start hijack console.log function
const originalStdoutWrite = process.stdout.write;
process.stdout.write = (msg) => output.push(msg);

log.debug('some debug message');
log.info('some info');
log.warn('some warning');
log.error('some error');
log.critical('some critical message');

const err = new Error('this is an error');
err.code = 9999;
err.syscall = 'somesyscall';
log.error('some error', err);

// resume console.log function
process.stdout.write = originalStdoutWrite;

const dateStringEndIndex = output[0].indexOf('DEBUG');
output.forEach(msg => {
    const dateString = msg.slice(0, dateStringEndIndex);
    const msgMain = msg.slice(dateStringEndIndex);
    tap.ok(Date.parse(dateString), 'should log date first');
    tap.matchSnapshot(obscureErrorStack(msgMain), 'msgMain');
});
