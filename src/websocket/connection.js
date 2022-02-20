const pathUtil = require('path');
const { fork } = require('child_process');
const _ = require('lodash');
const log = require('../utils/log.js');
const parseTimeStr = require('../utils/parseTimeStr.js');

const WS_IMPLICIT_RESPONSE_FILE_NAME = 'ws-response.js'; // todo to make it configurable

module.exports = (ws, req, cdResult) => {
    const filePath = pathUtil.resolve(cdResult.path, WS_IMPLICIT_RESPONSE_FILE_NAME);
    const helperProcess = fork(
        pathUtil.resolve(__dirname, './execJsFileHelperWs.js'),
        [
            filePath,
        ],
    );

    // todo ws.on

    ws.on('open', () => {
        const triggerInfo = {
            triggerName: 'WS-OPEN',
            currentMessage: null,
            request: req,
            query: req.query,
            params: req.params,
            lineageArg: null,
        };
        helperProcess.send(JSON.stringify(triggerInfo));
    });

    ws.on('message', currentMessage => {
        const triggerInfo = {
            triggerName: 'WS-MESSAGE',
            currentMessage,
            request: req,
            query: req.query,
            params: req.params,
            lineageArg: null,
        };
        helperProcess.send(triggerInfo));
    });

    helperProcess.on('message', execResult => {
        if (ws.readyState !== 1) {
            log.error('The connection is closing or has closed.');
            return;
        }
        const { jsResult, meetWithErr } = JSON.parse(execResult);
        let response;
        let delaySend = 0;
        if (meetWithErr) {
            log.error(jsResult);
            response = jsResult;
            ws.send(response);
            ws.close(1011, 'Internal server error. Failed to execute ./ws-response.js.');
            return;
        } else if (_.isPlainObject(jsResult) && jsResult.isMetaBox) {
            /**
             * A meta box js result:
             * {
             *      isMetaBox: true,
             *      responseShouldEscapeBuferRecover: true,
             *      response: 'response content',
             *      delaySend: 500,
             *      action: 'SEND', // SEND | PING | PONG | CLOSE // todo
             *      selfTrigger: {
             *          delayTrigger: 500,
             *          lineageArg: 'what ws-response.js want to heritage',
             *          lineageArgShouldEscapeBuferRecover: false,
             *      } | [{}],
             * }
             */
            response = jsResult.response;
            if (
                !jsResult.responseShouldEscapeBuferRecover
                && _.isPlainObject(response)
                && response.type === 'Buffer'
                && _.isArray(response.data)
            ) {
                response = Buffer.from(response.data);
            }
            if (jsResult.delaySend) {
                delaySend = parseTimeStr(jsResult.delaySend);
                if (delaySend === false) {
                    log.error(`Bad delaySend time property result '${jsResult.delaySend}' `
                        + `when trigger ./ws-response.js `
                        + `with ${JSON.stringify(jsResult.triggerInfo)}. `
                        + 'Will not delay send.');
                }
            }

            function handleSingleSelfTrigger(selfTrigger) {
                const triggerInfo = {
                    triggerName: 'SELF-TRIGGER',
                    currentMessage: null,
                    request: req,
                    query: req.query,
                    params: req.params,
                    lineageArg: selfTrigger.lineageArg,
                    lineageArgShouldEscapeBuferRecover: selfTrigger.lineageArgShouldEscapeBuferRecover,
                };
                let delayTrigger = 0;
                delayTrigger = parseTimeStr(jsResult.delayTrigger);
                if (delayTrigger === false) {
                    log.error(
                        `Bad self delayTrigger time property '${selfTrigger.delayTrigger}' `
                        + `when trigger ./ws-response.js `
                        + `with ${JSON.stringify(jsResult.triggerInfo)}. `
                        + 'Will not delay self trigger.');
                }
                if (delayTrigger) {
                    setTimeout(() => {
                        helperProcess.send(triggerInfo);
                    }, delayTrigger);
                } else {
                    helperProcess.send(triggerInfo);
                }
            }
            if (jsResult.selfTrigger) {
                if (_.isPlainObject(selfTrigger)) {
                    handleSingleSelfTrigger(selfTrigger);
                } else if (_.isArray(selfTrigger)) {
                    selfTrigger.forEach(handleSingleSelfTrigger);
                } else {
                    log.error(`Bad selfTrigger property result '${jsResult.selfTrigger}' `
                        + `when trigger ./ws-response.js `
                        + `with ${JSON.stringify(jsResult.triggerInfo)}. `
                        + 'Refer doc for details.'); // todo
                }
            }
        } else {
            response = jsResult;
            if (
                _.isPlainObject(response)
                && response.type === 'Buffer'
                && _.isArray(response.data)
            ) {
                response = Buffer.from(response.data);
            }
        }

        if (response) {
            if (delaySend) {
                setTimeout(() => ws.send(response), delaySend);
            } else {
                ws.send(response);
            }
        }
    });
};
