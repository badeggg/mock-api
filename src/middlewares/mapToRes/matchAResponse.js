/**
 * A quick map rule is like:
 * `GET ?query=rule ./response`.
 * The formal syntax of map rule is:
 * `[map] [options]`
 *     e.g. map -q query1=someValue&query2=someValue \
 *              -a arg1=someValue&[2].name=someValue&.detail=someValue \
 *              -h 'http-response-header: header-value' \
 *                 'another-header: another-value'
 * The return object of this module function may contain fields:
 * {
 *      shouldUseExpressSendFile: true | false,
 *      resHeaders: {},
 *      resBody: '',
 *      statusCode: 200 | 404 | 502 | ... ,
 *      resFilePath: '',
 *      delayTime: 500, // in milliseconds
 * }
 * @zhaoxuxu @2021-5-12
 */

const pathUtil = require('path');
const fs = require('fs');
const _ = require('lodash');
const { Command } = require('commander');
const cd = require('./cd');
const parseQueryStr = require('../../utils/parseQueryStr');
const parseHttpHeader = require('../../utils/parseHttpHeader');
const semiParseConfigFile = require('../../utils/semiParseConfigFile');
const log = require('../../utils/log.js');

const IMPLICIT_RESPONSE_FILE_NAME = 'response'; // todo to make it configurable
const RESPONSE_FILE_MAX_SIZE = 500 * 1024 * 1024;
const RESPONSE_FILE_MAX_PARSE_SIZE = 10 * 1024 * 1024;
const HTTP_METHODS = [
    'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'
];

class ResponseFile {
    constructor(filePath) {
        if (!filePath) {
            this.filePath = '';
            return;
        }
        this.filePath = filePath;
        this.ext = pathUtil.extname(filePath);
        this.exists = fs.existsSync(filePath);
        this.stats = fs.statSync(filePath);
    }
    generateResCfg() {
        if (this.stats.size > RESPONSE_FILE_MAX_SIZE) {
            log.error(`Response file '${this.filePath}' is too big, `
                + `max acceptable size is ${RESPONSE_FILE_MAX_SIZE},`
                + `got ${this.stats.size}.`);
            return null;
        }
        switch(this.ext.toLowerCase()) {
        case '': // An empty-extname file is regarded as a json file.
        case '.json':
            return this.generateJsonResCfg();
        default:
            return this.generateExpressSendFileResCfg();
        }
    }
    generateJsonResCfg() {
        if (this.stats.size > RESPONSE_FILE_MAX_PARSE_SIZE) {
            log.warn(`Refused to validate response json file '${this.filePath}', `
                + 'cause it is too big, '
                + `max acceptable size is ${RESPONSE_FILE_MAX_PARSE_SIZE},`
                + `got ${this.stats.size}.`);
            return _.merge({}, this.generateExpressSendFileResCfg(), {
                resHeaders: {
                    'Mock-Not-Validated-Json-File': this.filePath,
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            });
        } else {
            const fileStr = fs.readFileSync(this.filePath, 'utf-8');
            try {
                JSON.parse(fileStr);
            } catch (err) {
                log.warn(`Invalid json file '${this.filePath}'.`);
                return _.merge({}, this.generateExpressSendFileResCfg(), {
                    resHeaders: {
                        'Mock-Warn-Invalid-Json-File': this.filePath,
                    },
                });
            }
            return _.merge({}, this.generateExpressSendFileResCfg(), {
                resHeaders: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            });
        }
    }
    generateExpressSendFileResCfg() {
        return {
            shouldUseExpressSendFile: true,
            resFilePath: this.filePath,
        };
    }
}

class RuleParser {
    constructor(ruleLine, cdResult) {
        this.mapFilePath = pathUtil.resolve(cdResult.path, 'map');
        this.ruleLine = ruleLine;
        this.cdResult = cdResult;
        this.rule = new Command();
        this.rule
            .option('-q, --url-queries   <queries...>', 'url queries',        this._commanderParseUrlQueries, {})
            .option('-p, --path-params   <params...>',  'path params',        this._commanderParsePathParams, {})
            .option('-a, --body-args     <args...>',    'body args',          this._commanderParseBodyArgs,   {})
            .option('-h, --res-headers   <headers...>', 'response headers',   this._commanderParseResHeaders, {})
            .option('-c, --status-code   <code>',       'status code',        this._commanderParseStatusCode)
            .option('-m, --req-method    <method>',     'request method',     this._commanderParseReqMethod)
            .option('-r, --res-file-path <file>',       'response file path', this._commanderParseResFilePath)
            .option('-t, --delay-time    <time>',       'delay to response',  this._commanderParseDelayTime);
    }
    parse() {
        if (this.ruleLine[0].toLowerCase() === 'map')
            this.ruleLine = this.ruleLine.slice(1);
        if (!this.ruleLine.length)
            return null;
        const quickCfg = this.parseQuickCfg();
        this.rule.parse(this.ruleLine, {from: 'user'});
        const parsedRuleLine = this.rule.opts();
        let result = _.merge({}, quickCfg, parsedRuleLine);

        if (result.resFilePath) {
            const generatedResCfg = new ResponseFile(result.resFilePath).generateResCfg();
            result = _.merge({}, generatedResCfg, result);
        }
        return result;
    }
    parseQuickCfg() {
        let result = {};
        if (HTTP_METHODS.includes(this.ruleLine[0].toUpperCase())) {
            const method = this.ruleLine[0].toUpperCase();
            result.reqMethod = method;
            this.ruleLine = this.ruleLine.slice(1);
        }
        const queryStrInx = this.ruleLine.findIndex(item => item[0] === '?');
        if (queryStrInx >=0) {
            const queryStr = this.ruleLine[queryStrInx];
            const queries = parseQueryStr(queryStr);
            result.urlQueries = queries;
            this.ruleLine.splice(queryStrInx, 1);
        }
        const paramsStrInx = this.ruleLine.findIndex(item => item[0] === '_');
        if (paramsStrInx >=0) {
            const paramsStr = this.ruleLine[paramsStrInx];
            const params = parseQueryStr(paramsStr);
            result.pathParams = params;
            this.ruleLine.splice(paramsStrInx, 1);
        }
        const bodyArgsStrInx = this.ruleLine.findIndex(item => item[0] === '+');
        if (bodyArgsStrInx >=0) {
            const bodyArgsStr = this.ruleLine[bodyArgsStrInx];
            const bodyArgs = parseQueryStr(bodyArgsStr);
            result.bodyArgs = bodyArgs;
            this.ruleLine.splice(bodyArgsStrInx, 1);
        }
        const responsePathStrInx = this.ruleLine.findIndex(item => !'?_+-'.includes(item[0]));
        if (responsePathStrInx >=0) {
            const responsePathStr = this.ruleLine[responsePathStrInx];
            const resFilePath = pathUtil.resolve(this.cdResult.path, responsePathStr);
            if (!fs.existsSync(resFilePath) || !fs.statSync(resFilePath).isFile()) {
                log.error(`Bad response-file config '${responsePathStr}' in map `
                    + `'${this.mapFilePath}', `
                    + `file '${resFilePath}' does not exist or is not a file.`);
            } else {
                result.resFilePath = resFilePath;
            }
            this.ruleLine.splice(responsePathStrInx, 1);
        }
        return result;
    }
    _commanderParseUrlQueries(value, previous) {
        return _.merge(previous, parseQueryStr(value));
    }
    _commanderParsePathParams(value, previous) {
        return _.merge(previous, parseQueryStr(value));
    }
    _commanderParseBodyArgs(value, previous) {
        return _.merge(previous, parseQueryStr(value));
    }
    _commanderParseResHeaders(value, previous) {
        return _.merge(previous, parseHttpHeader(value));
    }
    _commanderParseStatusCode(value) {
        if (!value.match(/^\d{3}$/)) {
            log.error(`Bad status code config '${value}' in map '${this.mapFilePath}'.`);
            return null;
        }
        const code = parseInt(value);
        if (code < 100 || code > 599) {
            log.error(`Bad status code config '${value}' in map '${this.mapFilePath}'.`);
            return null;
        }
        return code;
    }
    _commanderParseReqMethod(value) {
        value = value.toUpperCase();
        if (!HTTP_METHODS.includes(value)) {
            log.error(`Bad request method config '${value}' in map '${this.mapFilePath}'.`);
            return null;
        }
        return value;
    }
    _commanderParseResFilePath(value) {
        const resFilePath = pathUtil.resolve(this.cdResult.path, value);
        if (!fs.existsSync(resFilePath) || !fs.statSync(resFilePath).isFile()) {
            log.error(`Bad response-file config '${value}' in map '${this.mapFilePath}', `
                + `file '${resFilePath}' does not exist or is not a file.`);
            return null;
        }
        return resFilePath;
    }
    _commanderParseDelayTime(value) {
        if (!value)
            return 0;

        let time;
        if (value.match(/^\d+(ms)?$/))
            time = parseInt(value);
        if (value.match(/^\d+(s)?$/))
            time = parseInt(value) * 1000;
        if (Number.isSafeInterger(time))
            return time;

        log.error(`Bad deplay time config '${value}' in map '${this.mapFilePath}'.`);
        return 0;
    }
}

class Matcher {
    constructor(cdResult, req) {
        this.mapFilePath = pathUtil.resolve(cdResult.path, 'map');
        this.cdResult = cdResult;
        this.req = req;
    }
    match() {
        if (!fs.existsSync(this.mapFilePath))
            return this.implicitResFileMatch();
        return this.mapFileMatch();
    }
    mapFileMatch() {
        const semiParsedMap = semiParseConfigFile(this.mapFilePath);
        for (let i = 0; i < semiParsedMap.length; i++) {
            let line = semiParsedMap[i];
            const cfg = new RuleParser(line, this.cdResult).parse();
            if (
                this.doesReqMethodMatch(cfg)
                && this.doesUrlQueryMatch(cfg)
                && this.doesPathParamsMatch(cfg)
                && this.doesBodyArgsMatch(cfg)
            ) {
                return cfg;
            }
        }
        return null;
    }
    doesReqMethodMatch(cfg) {
        return this.req.method.toUpperCase() === cfg.method.toUpperCase();
    }
    doesUrlQueryMatch(cfg) {
        if (!Object.keys(cfg.urlQueries)) {
            return true;
        }

        const keys = Object.keys(cfg.urlQueries);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const regStr = cfg.urlQueries[key];
            if(!this.isStringMatching(this.req.query[key], regStr)) {
                return false;
            }
        }
        return true;
    }
    doesPathParamsMatch(cfg) {
        if (!Object.keys(cfg.pathParams)) {
            return true;
        }

        const keys = Object.keys(cfg.pathParams);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const regStr = cfg.pathParams[key];
            if(!this.isStringMatching(this.req.params[key], regStr)) {
                return false;
            }
        }
        return true;
    }
    doesBodyArgsMatch(cfg) {
        if (!Object.keys(cfg.bodyArgs)) {
            return true;
        }

        const keys = Object.keys(cfg.bodyArgs);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const regStr = cfg.bodyArgs[key];
            let valueToTest;
            let compliantKey = key;
            switch (key[0]) {
            case '.':
            case '[':
                break;
            default:
                compliantKey = '.' + key;
            }
            try {
                valueToTest = eval(`this.req.body${compliantKey}`);
            } catch (err) {
                log.error(`Bad body args key '${key}' in map '${this.mapFilePath}'.`);
                return false;
            }
            if(!this.isStringMatching(valueToTest, regStr)) {
                return false;
            }
        }
        return true;
    }
    isStringMatching(str, regStr) {
        if (regStr[0] === '{'
            && regStr[regStr.length - 1] === '}'
        ) {
            let reg = null;
            const regStr = regStr.slice(1, regStr.length - 1);
            reg = new RegExp(regStr);
            if (reg.test(str))
                return true;
            else
                return false;
        } else if (regStr === str) {
            return true;
        }
        return false;
    }
    implicitResFileMatch() {
        const implicitResFile = pathUtil.resolve(this.cdResult.path, IMPLICIT_RESPONSE_FILE_NAME);
        if (!fs.existsSync(implicitResFile) || !fs.statSync(implicitResFile).isFile())
            return null;
        const cfg = new ResponseFile(implicitResFile).generateResCfg();
        return cfg;
    }
}

function match(req) {
    const cdResult = cd(req.path);
    if (!cdResult)
        return null;

    req.params = _.cloneDeep(cdResult.params);
    const ret = new Matcher(cdResult, req).match();
    return ret;
}

module.exports = match;
module.exports.ResponseFile = ResponseFile;
module.exports.RuleParser = RuleParser;
module.exports.Matcher = Matcher;
