const fs = require('fs');
const matchAResponse = require('./matchAResponse');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

module.exports = function(req, res, next) {
    matchAResponse(req)
        .then(
            responseFilePath => {
                if (!responseFilePath) {
                    if (global.proxy404) {
                        delete req.headers.host;
                        proxy.web(req, res, {target: 'http://example.com'});
                    } else {
                        res.sendStatus(404);
                    }
                }
                else {
                    const fileStr = fs.readFileSync(responseFilePath, 'utf-8');
                    res.set('Access-Control-Allow-Origin', '*');
                    res.send(fileStr);
                }
            },
            reason => res.status(500).send(reason.toString()),
        );
};
