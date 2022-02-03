const fs = require('fs');
const pathUtil = require('path');

module.exports = function() {
    let ret;
    let tryPath = process.cwd();
    const pathRoot = pathUtil.parse(tryPath).root;

    while(tryPath !== pathRoot) {
        /**
         * If a directory has 'package.json' file and 'node_modules' folder, we assume it is
         * the project root directory. In most cases, this rule should work fine.
         */
        const packageJsonPath = pathUtil.resolve(tryPath, './package.json');
        const nodeModulesPath = pathUtil.resolve(tryPath, './node_modules');
        const hasPackageJsonFile = (fs.existsSync(packageJsonPath)
            && fs.statSync(packageJsonPath).isFile());
        const hasNodeModulesDir = (fs.existsSync(nodeModulesPath)
            && fs.statSync(nodeModulesPath).isDirectory());
        if(hasPackageJsonFile && hasNodeModulesDir) {
            ret = tryPath;
            break;
        }
        tryPath = pathUtil.resolve(tryPath, '../');
    }

    if (!ret) {
        throw new Error('Failed to find project root.');
    }
    return ret;
};
