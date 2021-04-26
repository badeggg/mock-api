const fs = require('fs');
const pathUtil = require('path');

function isExampleBasePath (path) {
    const exampleFlag = (pathUtil.resolve(path, '.isExample'));
    if (fs.existsSync(exampleFlag)
        && fs.readFileSync(exampleFlag, 'utf-8').startsWith('true')
    ) {
        return true;
    }
    return false;
}

module.exports = function(searchFrom) {
    let exampleBasePath = '';
    let basePath = '';
    let tryPath = pathUtil.resolve(searchFrom, './fake-services');

    while (basePath === '' && tryPath !== '/fake-services') {
        if(fs.existsSync(tryPath)) {
            if(isExampleBasePath(tryPath))
                exampleBasePath = tryPath;
            else
                basePath = tryPath;
        }
        tryPath = pathUtil.resolve(tryPath, '../../fake-services');
    }

    return basePath ? basePath : exampleBasePath;
};
