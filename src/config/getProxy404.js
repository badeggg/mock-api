const fs = require('fs');
const pathUtil = require('path');
const fakeServicesBasePath = require('./getFakeServicesBasePath.js')();
const semiParseConfigFile = require('../utils/semiParseConfigFile.js');

module.exports = function() {
    let proxy404 = {};

    const proxy404CfgFile = pathUtil.resolve(fakeServicesBasePath, 'proxy404');
    if (fs.existsSync(proxy404CfgFile)
        && fs.statSync(proxy404CfgFile).isFile()
    ) {
        const semiParsedCfg = semiParseConfigFile(proxy404CfgFile);

        semiParsedCfg.forEach(cfgUnit => {
            let regStr = '';
            let target = '';
            if (cfgUnit.length === 1) {
                regStr = '.*';
                target = cfgUnit[0];
            } else if (cfgUnit.length >= 2) {
                regStr = cfgUnit[0];
                target = cfgUnit[1];
            }
            proxy404[regStr] = target;
        });
    }

    return proxy404;
};
