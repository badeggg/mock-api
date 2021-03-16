const _ = require('lodash');

function match(req) {
    if (typeof global.proxy404 === 'string') {
        return global.proxy404;
    } else if (_.isPlainObject(global.proxy404)) {
        const regStrs = Object.keys(global.proxy404);
        for (let i = 0; i < regStrs.length; i++) {
            const regStr = regStrs[i];
            const reg = new RegExp(regStr);
            if (reg.test(req.path)) {
                return global.proxy404[regStr];
            }
        }
        return null;
    } else {
        return null;
    }
}

module.exports = match;
