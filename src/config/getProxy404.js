const fs = require('fs');
const pathUtil = require('path');
const fakeServicesBasePath = require('./getFakeServicesBasePath.js')();
const semiParseConfigFile = require('../utils/semiParseConfigFile.js');
const log = require('../utils/log.js');

module.exports = function() {
    let proxy404 = [];

    const proxy404CfgFile = pathUtil.resolve(fakeServicesBasePath, 'proxy404');
    if (fs.existsSync(proxy404CfgFile)
        && fs.statSync(proxy404CfgFile).isFile()
    ) {
        const semiParsedCfg = semiParseConfigFile(proxy404CfgFile);

        semiParsedCfg.forEach(cfgUnit => {
            let isWebsocket;
            if (cfgUnit[0].toUpperCase() === 'HTTP') {
                isWebsocket = false;
                cfgUnit = cfgUnit.slice(1);
            } else if (cfgUnit[0].toUpperCase() === 'WS') {
                isWebsocket = true;
                cfgUnit = cfgUnit.slice(1);
            } else {
                isWebsocket = false;
            }

            let regStr = '';
            let target = '';
            if (cfgUnit.length === 1) {
                regStr = '.*';
                target = cfgUnit[0];
            }
            if (cfgUnit.length >= 2) {
                regStr = cfgUnit[0];
                target = cfgUnit[1];
            }
            try {
                new URL(target);
            } catch (err) {
                log.error(`Bad proxy 404 target '${target}'.`);
                log.error(err.toString());
                return;
            }
            proxy404.push([isWebsocket, regStr, target]);
        });
    }

    return proxy404;
};
