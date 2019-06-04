const express = require('express');
const app = express();
const mapToRes = require('./middlewares/mapToRes');
const checkPort = require('./utils/checkPort');
const getFakeServicesBasePath = require('./getConfig/getFakeServicesBasePath');

global.fakeServicesBasePath = getFakeServicesBasePath(__dirname);

app.use(mapToRes);

function tillListen(tryPort) {
    checkPort(tryPort)
        .then(
            () => app.listen(tryPort, () => console.log(`listening on: ${tryPort}\n`)),
            () => tillListen(++tryPort),
        );
}
tillListen(3000);
