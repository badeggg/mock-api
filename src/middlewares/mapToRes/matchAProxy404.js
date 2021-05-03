const _ = require('lodash');
const proxy404 = require('../../config/index.js').proxy404;

function match(req) {
    if (typeof proxy404 === 'string') {
        return proxy404;
    } else if (_.isPlainObject(proxy404)) {
        const regStrs = Object.keys(proxy404);
        for (let i = 0; i < regStrs.length; i++) {
            const regStr = regStrs[i];
            const reg = new RegExp(regStr);
            if (reg.test(req.path)) {
                return proxy404[regStr];
            }
        }
        return null;
    } else {
        return null;
    }
}

module.exports = match;
