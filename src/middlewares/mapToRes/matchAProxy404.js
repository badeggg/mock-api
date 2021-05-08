const proxy404 = require('../../config/index.js').proxy404;

function match(req) {
    for (let i = 0; i < proxy404.length; i++) {
        const oneRule = proxy404[i];
        const regStr = oneRule[0];
        const target = oneRule[1];
        const reg = new RegExp(regStr);
        if (reg.test(req.path)) {
            return target;
        }
    }
    return null;
}

module.exports = match;
