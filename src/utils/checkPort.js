const net = require('net');

const server = net.createServer();
module.exports = function(port) {
    return new Promise((resolve, reject) => {
        server.once('error', (err) => {
            reject(false);
        });
        server.once('listening', () => {
            server.close();
            resolve(true);
        });
        server.listen(port);
    });
};
