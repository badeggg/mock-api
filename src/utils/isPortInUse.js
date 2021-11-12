/**
 * Just a packaging of tcpPortUsed to always resolve. It may reject when encounter a connet
 * error, e.g. ECONNRESET. We simply regard such errors as port-is-in-use.
 * @zhaoxuxu @2021-11-12
 */

const tcpPortUsed = require('tcp-port-used');

module.exports = function(port) {
    return new Promise(resolve => {
        tcpPortUsed.check(port, '127.0.0.1')
            .then(resolve)
            .catch(() => resolve(true));
    });
};
