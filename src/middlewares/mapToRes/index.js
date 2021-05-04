const fs = require('fs');
const matchAResponse = require('./matchAResponse');
const matchAProxy404 = require('./matchAProxy404');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const log = require('../../utils/log.js');

function doProxy(req, res, target) {
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

        // todo to handle other types.
    });
    delete req.headers.host;
    proxy.web(req, res, {target}, (err) => log.error(err));
}

module.exports = function(req, res, next) {
    matchAResponse(req)
        .then(
            responseFilePath => {
                if (!responseFilePath) {
                    const proxy404Target = matchAProxy404(req);
                    if (proxy404Target) {
                        doProxy(req, res, proxy404Target);
                    } else {
                        res.set('From-Mocking-Fake-Service', 'true');
                        res.sendStatus(404);
                    }
                }
                else {
                    const fileStr = fs.readFileSync(responseFilePath, 'utf-8');
                    res.set('Access-Control-Allow-Origin', '*');
                    res.set('From-Mocking-Fake-Service', 'true');
                    res.send(fileStr);
                }
            },
            reason => res.status(500).send(reason.toString()),
        );
};
