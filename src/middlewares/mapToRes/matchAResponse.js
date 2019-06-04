const readline = require('readline');
const pathUtil = require('path');
const fs = require('fs');
const _ = require('lodash');
const cd = require('./cd');
const parseQueryStr = require('../../utils/parseQueryStr');

function isRuleMatch(ruleStr, str) {
    if (ruleStr[0] === '{'
        && ruleStr[ruleStr.length - 1] === '}'
    ) {
        let reg = null;
        try {
            const regStr = ruleStr.slice(1, ruleStr.length - 1);
            reg = new RegExp(regStr);
        }
        catch (err) {
            throw err;
        }
        if (reg.test(str))
            return true;
        else
            return false;
    } else if (ruleStr === str) {
        return true;
    }
    return false;

}

function matchOneLine(line, req){
    if (line[0] === '#') {
        return false;
    }
    const fields = line.match(/\S+/g);
    if (!fields)
        return;
    const cfg = {
        method: fields[0],
        querys: parseQueryStr(fields.find(fld => fld[0] === '?')),
        pathParams: parseQueryStr(fields.find(fld => fld[0] === '_')),
        responsePath: fields[fields.length - 1],
    };

    const methodOk = req.method === cfg.method.toUpperCase();
    if (!methodOk)
        return false;

    let querysOk = false;
    if (_.isObject(cfg.querys)) {
        querysOk = true;
        const keys = Object.keys(cfg.querys);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const rule = cfg.querys[key];
            if(!isRuleMatch(rule, req.query[key])) {
                querysOk = false;
                break;
            }
        }
    } else if (cfg.querys === false){
        querysOk = true;
    } else {
        return new Error('Abnormal condition.');
    }
    if (!querysOk)
        return false;

    let pathParamsOk = false;
    if (_.isObject(cfg.pathParams)) {
        pathParamsOk = true;
        const keys = Object.keys(cfg.pathParams);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const rule = cfg.pathParams[key];
            if(!isRuleMatch(rule, req.query[key])) {
                pathParamsOk = false;
                break;
            }
        }
    } else if (cfg.pathParams === false){
        pathParamsOk = true;
    } else {
        return new Error('Abnormal condition.');
    }
    if (!pathParamsOk)
        return false;

    return cfg.responsePath;
}

function walkMapFileLines(mapFilePath, req) {
    return new Promise((resolve, reject) => {
        const lineReader = readline.createInterface({
            input: fs.createReadStream(mapFilePath),
        });
        let responsePath = '';
        lineReader.on('line', line => {
            if (responsePath !== '')
                return;
            try {
                const tmp = matchOneLine(line, req);
                if (tmp) {
                   responsePath = tmp;
                   lineReader.close();
                   resolve(responsePath);
                }
            }
            catch (err) {
                err.message = `Bad rule for matching: ${line}. ${err.message}`;
                reject(err.message);
            }
        });
    });
}

function match(req) {
    return new Promise((resolve, reject) => {
        const resource = cd(req.path);
        if (!!resource) {
            req.params = _.merge({}, req.params, resource.params);
            const mapFilePath = pathUtil.resolve(resource.path, 'map');
            const defaultResponsePath = pathUtil.resolve(resource.path, 'response');
            if (fs.existsSync(mapFilePath)) {
                walkMapFileLines(mapFilePath, req).then(
                    responsePath => resolve(pathUtil.resolve(resource.path, responsePath)),
                    reason => reject(reason),
                );
            } else if (fs.existsSync(defaultResponsePath)) {
                resolve(defaultResponsePath);
            }
        } else {
            resolve(null);
        }
    });
}

module.exports = match;
