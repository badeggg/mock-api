const pathUtil = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const mapToRes = require('./middlewares/mapToRes');
const checkPort = require('./utils/checkPort');
const getFakeServicesBasePath = require('./getConfig/getFakeServicesBasePath');

global.fakeServicesBasePath = getFakeServicesBasePath(__dirname);
global.projectRootPath = pathUtil.resolve(global.fakeServicesBasePath, '../');
const proxy404CfgFile = pathUtil.resolve(global.fakeServicesBasePath, 'proxy404');
if (fs.existsSync(proxy404CfgFile)
    && fs.statSync(proxy404CfgFile).isFile()
) {
    global.proxy404 = fs.readFileSync(proxy404CfgFile, 'utf-8').split('\n')[0];
}

app.use(mapToRes);

function tillListen(tryPort) {
    return checkPort(tryPort)
        .then(
            () => {
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
            },
            () => tillListen(++tryPort),
        );
}

module.exports = tillListen(3000);
