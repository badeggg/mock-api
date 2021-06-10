// The separation of index.js/mock.js is for easier unit testing.

const pathUtil = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const tcpPortUsed = require('tcp-port-used');
const chalk = require('chalk');
const mapToRes = require('./middlewares/mapToRes');
const projectRoot = require('./utils/getProjectRoot.js')();
const log = require('./utils/log.js');

async function tillListen(tryPort) {
    const isInUse = await tcpPortUsed.check(tryPort, '127.0.0.1');
    if (!isInUse) {
        return await new Promise(resolve => {
            const server = app.listen(tryPort, () => {
                resolve(server);
            });
        });
    } else {
        return tillListen(++tryPort);
    }
}

module.exports = async () => {
    const REQUEST_MAX_JSON_SIZE = '10mb'; // todo, to make it configurable
    const REQUEST_MAX_URLENCODED_SIZE = '10mb'; // todo, to make it configurable
    app.use(express.json({limit: REQUEST_MAX_JSON_SIZE}));
    app.use(express.urlencoded({limit: REQUEST_MAX_URLENCODED_SIZE, extended: false,}));
    app.use(mapToRes);

    const server = await tillListen(3000);
    const listenOnPort = server.address().port;
    const mockingLocation = `http://localhost:${listenOnPort}`;
    fs.writeFileSync(
        pathUtil.resolve(projectRoot, './.mockingLocation'),
        mockingLocation,
        'utf-8',
    );
    log.info(chalk.green(`mock-api listening on: ${listenOnPort}`));
    return server;
};
