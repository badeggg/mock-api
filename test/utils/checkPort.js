const tap = require('tap');
const net = require('net');
const checkPort = require('../../src/utils/checkPort');

async function getAFreePort(from) {
    try {
        const isFree = await checkPort(from);
        if (isFree) {
            return from;
        }
    } catch (err) {
        from++;
        return getAFreePort(from);
    }
}

tap.test('', async tap => {
    const port = await getAFreePort(3000);
    await tap.resolves(() => {
        return new Promise((resolve, reject) => {
            const server = net.createServer();
            server.once('listening', () => {
                server.close();
                resolve(true);
            });
            server.once('error', (err) => {
                reject(false);
            });
            server.listen(port);
        });
    });
    const server = net.createServer();
    server.listen(port);
    await tap.rejects(() => {
        return new Promise((resolve, reject) => {
            const server = net.createServer();
            server.once('listening', () => {
                server.close();
                resolve(true);
            });
            server.once('error', (err) => {
                reject(false);
            });
            server.listen(port);
        });
    });
    server.close();
    tap.end();
});
