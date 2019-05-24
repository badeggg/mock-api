const fs = require('fs');
const matchAResponse = require('./matchAResponse');

module.exports = function(req, res, next) {
    matchAResponse(req)
        .then(
            responseFilePath => {
                if (!responseFilePath)
                    res.sendStatus(404);
                else {
                    const fileStr = fs.readFileSync(responseFilePath, 'utf-8');
                    res.set('Access-Control-Allow-Origin', '*');
                    res.send(fileStr);
                }
            },
            reason => res.status(500).send(reason.toString()),
        );
};
