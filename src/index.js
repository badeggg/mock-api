const pathUtil = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const mapToRes = require('./middlewares/mapToRes');
const checkPort = require('./utils/checkPort');
const getFakeServicesBasePath = require('./getConfig/getFakeServicesBasePath');

global.fakeServicesBasePath = getFakeServicesBasePath(__dirname);
const proxy404CfgFile = pathUtil.resolve(global.fakeServicesBasePath, 'proxy404');
if (fs.existsSync(proxy404CfgFile)
    && fs.statSync(proxy404CfgFile).isFile()
) {
    global.proxy404 = fs.readFileSync(proxy404CfgFile, 'utf-8').split('\n')[0];
}

app.use(mapToRes);

function tillListen(tryPort) {
    checkPort(tryPort)
        .then(
            () => app.listen(tryPort, () => console.log(`listening on: ${tryPort}\n`)),
            () => tillListen(++tryPort),
        );
}
tillListen(3000);
