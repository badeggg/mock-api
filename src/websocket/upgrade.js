const pathUtil = require('path');
const url = require('url');
const fs = require('fs');
const _ = require('lodash');
const cd = require('../utils/cd');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const log = require('../utils/log.js');
const matchAProxy404 = require('../common/matchAProxy404');

const WS_IMPLICIT_RESPONSE_FILE_NAME = 'ws-response.js'; // todo to make it configurable

module.exports = (req, socket, head, wss) => {
    const parsedUrl = url.parse(req.url);
    req.path = parsedUrl.pathname;
    req.query = {};
    req.isWebsocket = true;
    for (const [key, value] of new URLSearchParams(parsedUrl.query)) {
        req.query[key] = value;
    }

    function errorClose(err) {
        wss.handleUpgrade(req, socket, head, function done(ws) {
            ws.send(err.message);
            ws.close(err.wsCloseCode, err.name);
        });
    }

    let cdResult;
    let wsResponseFilePath;
    try {
        cdResult = cd(req.path);
        wsResponseFilePath = pathUtil.resolve(cdResult.path, WS_IMPLICIT_RESPONSE_FILE_NAME);
    } catch (err) {
        log.error(err.message);
        errorClose(err);
        return;
    }
    if (
        !fs.existsSync(wsResponseFilePath)
        || !fs.statSync(wsResponseFilePath).isFile()
    ) {
        log.info(`No '${WS_IMPLICIT_RESPONSE_FILE_NAME}' file in corresponding directory `
            + `'${cdResult.path}'.`);
        const proxy404Target = matchAProxy404(req);
        if (proxy404Target) {
            proxy.ws(req, socket, head, { target: proxy404Target });
            return;
        }
        const err = new Error(
            'No ws proxy 404 match found.<br>\n'
            + 'You need a proper proxy404 file in fake-services folder.<br>\n'
            + 'Refer https://github.com/badeggg/mock-api#proxy-404'
        );
        err.name = 'NO-WS-PROXY-404-MATCH-FOUND';
        err.wsCloseCode = 3996;
        errorClose(err);
        return;
    }

    req.params = _.cloneDeep(cdResult.params);

    wss.handleUpgrade(req, socket, head, function done(ws) {
        wss.emit('connection', ws, req, wsResponseFilePath);
    });
};
