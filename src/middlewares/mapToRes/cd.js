const fs = require('fs');
const pathUtil = require('path');
const _ = require('lodash');
const config = require('../../config');

function currentPathIsOff(currentPath) {
    return ( // turn off this fake service path
        fs.existsSync(pathUtil.resolve(currentPath, 'off'))
        || fs.existsSync(pathUtil.resolve(currentPath, 'OFF'))
    );
}

/**
 *  current = {
 *      path: @String,
 *      params: @Object,
 *  }
 */
function cdOne(folder, current) {
    let testNext = pathUtil.resolve(current.path, folder);
    if (fs.existsSync(testNext) && fs.statSync(testNext).isDirectory()) {
        return _.merge({}, current, {
            path: testNext,
        });
    } else {
        const files = fs.readdirSync(current.path);
        let params = {};
        const finded = files.find((file => {
            const matchRst = file.match(/^__(\w+)__$/);
            if (matchRst) {
                params[matchRst[1]] = folder;
                return true;
            }
            return false;
        }));
        if (finded) {
            return _.merge({}, current, {
                path: pathUtil.resolve(current.path, finded),
                params,
            });
        }
        return false;
    }
}

function cd(path) {
    let current = {path: config.fakeServicesBasePath, params: {}};
    if (path[0] === '/')
        path = path.slice(1);
    if (path[path.length - 1] === '/')
        path = path.slice(0, path.length - 1);
    const pathItems = path.split('/');
    let fail = false;
    for (let i = 0; i < pathItems.length; i++) {
        const item = pathItems[i];
        const tmp = cdOne(item, current);
        if (!!tmp && !currentPathIsOff(tmp.path)) {
            current = tmp;
        } else {
            fail = true;
            break;
        }
    }
    if (fail)
        return false;
    return current;
}

module.exports = cd;
