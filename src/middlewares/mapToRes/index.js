const fs = require('fs');
const matchAResponse = require('./matchAResponse');
const matchAProxy404 = require('./matchAProxy404');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

module.exports = function(req, res, next) {
    matchAResponse(req)
        .then(
            responseFilePath => {
                if (!responseFilePath) {
                    const proxy404 = matchAProxy404(req);
                    if (proxy404) {
                        delete req.headers.host;
                        proxy.web(req, res, {target: proxy404}, (err) => console.log(err));
                    } else {
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
