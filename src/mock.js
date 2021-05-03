// The separation of index.js/mock.js is for easier unit testing.

const pathUtil = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const tcpPortUsed = require('tcp-port-used');
const mapToRes = require('./middlewares/mapToRes');
const projectRoot = require('./utils/getProjectRoot.js');

module.exports = (process) => {
    const REQUEST_MAX_SIZE = '10mb'; // todo, to make it configurable
    app.use(express.json({limit: REQUEST_MAX_SIZE}));
    app.use(mapToRes);

    function tillListen(tryPort) {
        return tcpPortUsed.check(tryPort, '127.0.0.1')
            .then(
                (isInUse) => {
                    if (!isInUse) {
                        return new Promise(resolve => {
                            app.listen(tryPort, () => {
                                console.log(`mock-api listening on: ${tryPort}\n`);
                                global.mockingLocation = `http://localhost:${tryPort}`;
                                fs.writeFileSync(
                                    pathUtil.resolve(projectRoot, './.mockingLocation'),
                                    global.mockingLocation,
                                    'utf-8',
                                );
                                resolve(global.mockingLocation);
                            });
                        });
                    } else {
                        tillListen(++tryPort);
                    }
                },
                (err) => {
                    console.error('Error on check port', err.message);
                },
            );
    }

    tillListen(3000);
};
