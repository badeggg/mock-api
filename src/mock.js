// The separation of index.js/mock.js is for easier unit testing.

const http = require('http');
const pathUtil = require('path');
const fs = require('fs');
const express = require('express');
const chalk = require('chalk');
const WSServer = require('ws').Server;
const mapToRes = require('./middlewares/mapToRes');
const projectRoot = require('./utils/getProjectRoot.js')();
const isPortInUse = require('./utils/isPortInUse.js');
const log = require('./utils/log.js');
const watchingQuit = require('./utils/watchingQuit');

async function tillListen(server, tryPort) {
    const isInUse = await isPortInUse(tryPort);
    if (!isInUse) {
        return await new Promise(resolve => {
            server.listen(tryPort, () => {
                resolve(tryPort);
            });
        });
    } else {
        return tillListen(server, ++tryPort);
    }
}

const httpApp = function() {
    const app = express();
    const REQUEST_MAX_JSON_SIZE = '10mb'; // todo, to make it configurable
    const REQUEST_MAX_URLENCODED_SIZE = '10mb'; // todo, to make it configurable
    app.use(express.json({limit: REQUEST_MAX_JSON_SIZE}));
    app.use(express.urlencoded({limit: REQUEST_MAX_URLENCODED_SIZE, extended: false,}));
    app.use(mapToRes);
    return app;
};

module.exports = async (tryPort = 3000) => {
    const server = http.createServer();
    const wss = new WSServer({ server });
    server.on('request', httpApp());

    const listenOnPort = await tillListen(server, tryPort);

    const mockingLocation = `http://localhost:${listenOnPort}`;
    fs.writeFileSync(
        pathUtil.resolve(projectRoot, './.mockingLocation'),
        mockingLocation,
        'utf-8',
    );
    log.info(chalk.green(`Mock-api listening on: ${listenOnPort}`));
    watchingQuit(code => {
        try {
            fs.unlinkSync(pathUtil.resolve(projectRoot, './.mockingLocation'));
        } catch (err) {
            log.error('Error on cleaning .mockingLocation file when quit. ' + err);
        }
        log.info(`Mock-api quit with code ${code}.`);
    });
    return server;
};
