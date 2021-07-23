/**
 * A quick map rule is like:
 * `GET ?query=rule ./response`.
 * The formal syntax of map rule is:
 * `[map] [options]`
 *     e.g. map -q query1=someValue&query2=someValue \
 *              -a arg1=someValue&[2].name=someValue&.detail=someValue \
 *              -h 'http-response-header: header value' \
 *                 'another-header: another-value'
 * todo to doc
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
const commander = require('commander');
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
const BAD_COMMANDER_OPTION_TO_DELETE = `Commander custom option parser does not has a
proper way to indicate current option should be regarded as undefined`;

class ResponseFile {
    constructor(filePath, resJsResult, req) {
        if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
            this.filePath = '';
            if (!filePath)
                log.error('Empty "filePath" arg for "ResponseFile" constructor.');
            else
                log.error(`${filePath} does not exist or is not a file.`);
            return;
        }
        this.filePath = filePath;
        this.ext = pathUtil.extname(filePath);
        this.stats = fs.statSync(filePath);
        this.resJsResult = resJsResult;
        if (this.resJsResult === undefined)
            this.resJsResult = false;
        this.req = req;
    }
    generateResCfg() {
        if (!this.filePath)
            return null;
        if (this.stats.size > RESPONSE_FILE_MAX_SIZE) {
            log.error(`Response file '${this.filePath}' is too big, `
                + `max acceptable size is ${RESPONSE_FILE_MAX_SIZE}, `
                + `got ${this.stats.size}.`);
            return null;
        }
        switch(this.ext.toLowerCase()) {
        case '': // An empty-extname file is regarded as a json file.
        case '.json':
            return this.generateJsonResCfg();
        case '.js':
            return this.generateJsResCfg();
        default:
            return this.generateExpressSendFileResCfg();
        }
    }
    generateJsonResCfg() {
        if (!this.filePath)
            return null;
        if (this.stats.size > RESPONSE_FILE_MAX_PARSE_SIZE) {
            log.warn(`Refused to validate response json file '${this.filePath}', `
                + 'cause it is too big, '
                + `max acceptable size is ${RESPONSE_FILE_MAX_PARSE_SIZE}, `
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
    generateJsResCfg() {
        if (!this.filePath)
            return null;
        if (!this.resJsResult)
            return this.generateExpressSendFileResCfg();
        if (this.stats.size > RESPONSE_FILE_MAX_PARSE_SIZE) {
            log.warn(`Refused to execute response js file '${this.filePath}', `
                + 'cause it is too big, '
                + `max acceptable size is ${RESPONSE_FILE_MAX_PARSE_SIZE}, `
                + `got ${this.stats.size}.`);
            return _.merge({}, this.generateExpressSendFileResCfg(), {
                resHeaders: {
                    'Mock-Big-Js-File-Self': this.filePath,
                },
            });
        } else {
            let resBody;
            try {
                /**
                 * We must not use require cached module since we want js file change
                 * take effect immediately. `delete require.cache[...]` is fine but
                 * test suit with tapJs seems not ok.
                 * todo to write test suit
                 * @zhaoxuxu @2021-7-23
                 */
                delete require.cache[require.resolve(this.filePath)];
                resBody = require(this.filePath)(this.req);
            } catch (err) {
                const errStr = (
                    `Failed to execute js script '${this.filePath}'.\n`
                    + err.stack
                );
                log.error(errStr);
                return {
                    shouldUseExpressSendFile: false,
                    resBody: errStr,
                    resHeaders: {
                        'Mock-Error-Invalid-Js-File': this.filePath,
                    },
                };
            }
            if (resBody && !_.isPlainObject(resBody) && !_.isArray(resBody)) {
                resBody = resBody.toString();
                return {
                    shouldUseExpressSendFile: false,
                    resBody,
                    resHeaders: {
                        'Content-Type': 'text/plain; charset=UTF-8',
                    },
                };
            }
            resBody = JSON.stringify(resBody);
            return {
                shouldUseExpressSendFile: false,
                resBody,
                resHeaders: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            };
        }
    }
    generateExpressSendFileResCfg() {
        if (!this.filePath)
            return null;
        return {
            shouldUseExpressSendFile: true,
            resFilePath: this.filePath,
        };
    }
}

class RuleParser {
    constructor(ruleLine, cdResult, req) {
        this.mapFilePath = pathUtil.resolve(cdResult.path, 'map');
        this.ruleLine = ruleLine;
        this.cdResult = cdResult;
        this.rule = new commander.Command();
        this.rule
            .option('-q, --url-queries   <queries...>', 'url queries',        (value, previous) => this._commanderParseUrlQueries(value, previous), {})
            .option('-p, --path-params   <params...>',  'path params',        (value, previous) => this._commanderParsePathParams(value, previous), {})
            .option('-a, --body-args     <args...>',    'body args',          (value, previous) => this._commanderParseBodyArgs(value, previous),   {})
            .option('-h, --res-headers   <headers...>', 'response headers',   (value, previous) => this._commanderParseResHeaders(value, previous), {})
            .option('-c, --status-code   <code>',       'status code',        (value, previous) => this._commanderParseStatusCode(value, previous))
            .option('-m, --req-method    <method>',     'request method',     (value, previous) => this._commanderParseReqMethod(value, previous))
            .option('-f, --res-file-path <file>',       'response file path', (value, previous) => this._commanderParseResFilePath(value, previous))
            .option('-t, --delay-time    <time>',       'delay to response',  (value, previous) => this._commanderParseDelayTime(value, previous))
            .option('-r, --res-js-result',              'response js result', false)
            .configureOutput({
                writeErr: () => {},
            });
        this.req = req;
    }
    parse() {
        if (this.ruleLine.length && this.ruleLine[0].toLowerCase() === 'map')
            this.ruleLine = this.ruleLine.slice(1);
        if (!this.ruleLine.length)
            return null;
        const quickCfg = this.parseQuickCfg();
        this.rule.exitOverride();
        try {
            this.rule.parse(this.ruleLine, {from: 'user'});
        } catch (err) {
            log.error(`Bad config in map '${this.mapFilePath}', ${err.message}.`);
            return null;
        }
        const parsedRuleLine = this.rule.opts();
        let result = _.merge({}, quickCfg, parsedRuleLine);

        Object.keys(result).forEach((key) => {
            if (result[key] === BAD_COMMANDER_OPTION_TO_DELETE)
                delete result[key];
        });

        if (!result.resFilePath) {
            const implicitResFile = pathUtil.resolve(this.cdResult.path,
                IMPLICIT_RESPONSE_FILE_NAME);
            if (fs.existsSync(implicitResFile) && fs.statSync(implicitResFile).isFile())
                result.resFilePath = implicitResFile;
            else {
                // todo to better notice ruleline position in map file
                log.error('No explicit resFilePath config in ruleLine '
                    + `${this.ruleLine.join(' ')} `
                    + `in map file ${this.mapFilePath}, and no fine implicit response file.`);
                return null;
            }
        }
        const generatedResCfg = new ResponseFile(
            result.resFilePath, result.resJsResult, this.req
        ).generateResCfg();
        result = _.merge({}, generatedResCfg, result);
        return result;
    }
    parseQuickCfg() {
        let result = {};
        if (HTTP_METHODS.includes(this.ruleLine[0].toUpperCase())) {
            const method = this.ruleLine[0].toUpperCase();
            result.reqMethod = method;
            this.ruleLine = this.ruleLine.slice(1);
        }
        /**
         * An item is assumed to be a response-path-item if
         * 1) it is just after the last quick url-query / body-args / path-params and starts
         *    with ./
         * 2) or it is the last item and starts with ./
         * The condition-1-item found stop the finding of the condition-2-item.
         * @zhaoxuxu @2021-5-27
         */
        let responsePathStrInx = -1;
        const lastQuickItemsIndex = _.findLastIndex(this.ruleLine,
            item => '?_+'.includes(item[0]));
        const justAfterQuickItemsIndex = lastQuickItemsIndex + 1;
        if (lastQuickItemsIndex >= 0
            && justAfterQuickItemsIndex < this.ruleLine.length - 1
            && this.ruleLine[justAfterQuickItemsIndex].startsWith('./')
        ) {
            responsePathStrInx = justAfterQuickItemsIndex;
        } else if (this.ruleLine.length
            && this.ruleLine[this.ruleLine.length - 1].startsWith('./')
        ) {
            responsePathStrInx = this.ruleLine.length - 1;
        }
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
            return BAD_COMMANDER_OPTION_TO_DELETE;
        }
        const code = parseInt(value);
        if (code < 100 || code > 599) {
            log.error(`Bad status code config '${value}' in map '${this.mapFilePath}'.`);
            return BAD_COMMANDER_OPTION_TO_DELETE;
        }
        return code;
    }
    _commanderParseReqMethod(value) {
        value = value.toUpperCase();
        if (!HTTP_METHODS.includes(value)) {
            log.error(`Bad request method config '${value}' in map '${this.mapFilePath}'.`);
            return BAD_COMMANDER_OPTION_TO_DELETE;
        }
        return value;
    }
    _commanderParseResFilePath(value) {
        const resFilePath = pathUtil.resolve(this.cdResult.path, value);
        if (!fs.existsSync(resFilePath) || !fs.statSync(resFilePath).isFile()) {
            log.error(`Bad response-file config '${value}' in map '${this.mapFilePath}', `
                + `file '${resFilePath}' does not exist or is not a file.`);
            return BAD_COMMANDER_OPTION_TO_DELETE;
        }
        return resFilePath;
    }
    _commanderParseDelayTime(value) {
        let time;
        if (value.match(/^\d+(ms)?$/))
            time = parseInt(value);
        if (value.match(/^\d+(s)$/))
            time = parseInt(value) * 1000;
        if (Number.isSafeInteger(time))
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
        if (fs.existsSync(this.mapFilePath))
            return this.mapFileMatch() || this.implicitResFileMatch();
        return this.implicitResFileMatch();
    }
    mapFileMatch() {
        const semiParsedMap = semiParseConfigFile(this.mapFilePath);
        for (let i = 0; i < semiParsedMap.length; i++) {
            let line = semiParsedMap[i];
            const cfg = new RuleParser(line, this.cdResult, this.req).parse();
            if (
                cfg
                && this.doesReqMethodMatch(cfg)
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
        if (!cfg.reqMethod)
            return true;
        return this.req.method.toUpperCase() === cfg.reqMethod.toUpperCase();
    }
    doesUrlQueryMatch(cfg) {
        if (!Object.keys(cfg.urlQueries).length) {
            return true;
        }
        if (!this.req.query) {
            return false;
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
        if (!Object.keys(cfg.pathParams).length) {
            return true;
        }
        if (!this.req.params) {
            return false;
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
        if (!Object.keys(cfg.bodyArgs).length) {
            return true;
        }
        if (!this.req.body) {
            return false;
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
                log.info(`Failed to eval request body with body args key '${key}' `
                    +`configured in map '${this.mapFilePath}'.`);
                return false;
            }
            if(!this.isStringMatching(valueToTest, regStr)) {
                // todo to log.info
                return false;
            }
        }
        return true;
    }
    isStringMatching(str, regStr) {
        if (regStr === '')
            return str !== undefined;
        else if (regStr[0] === '{'
            && regStr[regStr.length - 1] === '}'
        ) {
            let reg = null;
            regStr = regStr.slice(1, regStr.length - 1);
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
        const implicitResFile = pathUtil.resolve(this.cdResult.path,
            IMPLICIT_RESPONSE_FILE_NAME);
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
