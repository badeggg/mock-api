const queryString = require('query-string');
const matchAResponse = require('./matchAResponse');
const matchAProxy404 = require('./matchAProxy404');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const log = require('../../utils/log.js');

function doProxy(req, res, target) {
    /**
     * Check https://github.com/chimurai/http-proxy-middleware/issues/320
     * Only Content-Type of 'application/json' or 'application/x-www-form-urlencoded'
     * is useful and thus parsed.
     * @zhaoxuxu @2021-5-21
     */
    proxy.once('proxyReq', function (proxyReq, request, response) {
        if (!request.body || !Object.keys(request.body).length) {
            return;
        }

        const contentType = proxyReq.getHeader('Content-Type');
        const writeBody = (bodyData) => {
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        };

        if (contentType.includes('application/json')) {
            writeBody(JSON.stringify(request.body));
        }

        if (contentType.includes('application/x-www-form-urlencoded')) {
            writeBody(queryString.stringify(req.body));
        }
    });
    delete req.headers.host;
    proxy.web(req, res, {target}, (err) => log.error(err));
}

function responseByCfg(cfg, res) {
    if (cfg.statusCode)
        res.status(cfg.statusCode);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('From-Mocking-Fake-Service', 'true');
    res.set(cfg.resHeaders);

    if (cfg.delayTime)
        setTimeout(send, cfg.delayTime);
    else
        res.send();

    function send() {
        if (cfg.shouldUseExpressSendFile)
            res.sendFile(cfg.resFilePath);
        else
            res.send(cfg.resBody);
    }
}

module.exports = function(req, res, next) {
    matchAResponse(req)
        .then(
            cfg => {
                if (!cfg) {
                    const proxy404Target = matchAProxy404(req);
                    if (proxy404Target) {
                        doProxy(req, res, proxy404Target);
                    } else {
                        res.set('From-Mocking-Fake-Service', 'true');
                        res.sendStatus(404);
                    }
                } else {
                    responseByCfg(cfg, res);
                }
            },
            reason => res.status(500).send(reason.toString()),
        );
};
