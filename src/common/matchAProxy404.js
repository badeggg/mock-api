const getProxy404 = require('../config/index.js').getProxy404;

function match(req) {
    req.isWebsocket = req.isWebsocket === undefined ? false : Boolean(req.isWebsocket);

    const proxy404 = getProxy404();
    for (let i = 0; i < proxy404.length; i++) {
        const oneRule = proxy404[i];
        const isWebsocket = oneRule[0];
        const regStr = oneRule[1];
        const target = oneRule[2];
        const reg = new RegExp(regStr);
        if (reg.test(req.path) && isWebsocket === req.isWebsocket) {
            return target;
        }
    }
    return null;
}

module.exports = match;
