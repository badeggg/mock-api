const fs = require('fs');
const pathUtil = require('path');

module.exports = function() {
    let ret;
    let tryPath = process.cwd();

    while(tryPath !== '/') {
        /**
         * If a directory has 'package.json' file and 'node_modules' folder, we assume it is
         * the project root directory. In most cases, this rule should work fine.
         */
        const hasPackageJsonFile = fs.existsSync(pathUtil.resolve(tryPath, './package.json'));
        const hasNodeModulesDir = fs.existsSync(pathUtil.resolve(tryPath, './node_modules'));
        if(hasPackageJsonFile && hasNodeModulesDir) {
            ret = tryPath;
            break;
        }
    }

    if (!ret) {
        throw new Error('Failed to find project root.');
    }
    return ret;
};
