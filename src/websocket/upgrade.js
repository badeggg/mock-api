const url = require('url');
const _ = require('lodash');
const cd = require('../utils/cd');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const log = require('../utils/log.js');

module.exports = (req, socket, head, wss) => {
    const parsedUrl = url.parse(req.url);
    req.path = parsedUrl.pathname;
    req.query = {};
    for (const [key, value] of new URLSearchParams(parsedUrl.query)) {
        req.query[key] = value;
    }

    let cdResult;
    try {
        cdResult = cd(req.path);
    } catch (err) {
        log.error(err.message);
        if (err.name === 'NO-FAKE-SERVIVES-FOLDER') {
            return {
                resBody: err.message,
                statusCode: 404,
            };
        }
        throw err;
    }
    if (!cdResult) {
        proxy.ws(req, socket, head);
        return;
    }

    req.params = _.cloneDeep(cdResult.params);

    wss.handleUpgrade(req, socket, head, function done(ws) {
        wss.emit('connection', ws, req, cdResult);
    });
};
