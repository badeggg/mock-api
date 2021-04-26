#!/usr/bin/env node

const pathUtil = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const mapToRes = require('./middlewares/mapToRes');
const getFakeServicesBasePath = require('./getConfig/getFakeServicesBasePath');
const tcpPortUsed = require('tcp-port-used');

global.fakeServicesBasePath = getFakeServicesBasePath(__dirname);
global.projectRootPath = pathUtil.resolve(global.fakeServicesBasePath, '../');
const proxy404CfgFile = pathUtil.resolve(global.fakeServicesBasePath, 'proxy404');
if (fs.existsSync(proxy404CfgFile)
    && fs.statSync(proxy404CfgFile).isFile()
) {
    let lines = fs.readFileSync(proxy404CfgFile, 'utf-8').split('\n');
    lines = lines.filter(line => {
        return line && line[0] !== '#';
    });

    global.proxy404 = {};
    lines.forEach(line => {
        line = line.trim();
        const splited = line.split(' ');
        let regStr = '';
        let target = '';
        if (splited.length === 1) {
            regStr = '.*';
            target = splited[0].trim();
        } else if (splited.length >= 2) {
            regStr = splited[0].trim();
            target = splited[1].trim();
        }
        global.proxy404[regStr] = target;
    });
}

const REQUEST_MAX_SIZE = '10mb';
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
                                pathUtil.resolve(global.projectRootPath, './.mockingLocation'),
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

module.exports = tillListen(3000);
