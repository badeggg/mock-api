const pathUtil = require('path');
const { fork } = require('child_process');
const _ = require('lodash');
const log = require('../utils/log.js');
const isValidWsStatusCode = require('../utils/isValidWsStatusCode.js');
const parseTimeStr = require('../utils/parseTimeStr.js');

const MAX_CLOSE_REASON_BYTE_LENGTH = 123;

module.exports = (ws, req, wsResponseFilePath) => {
    const helperProcess = fork(
        pathUtil.resolve(__dirname, './execJsFileHelperWs.js'),
        [
            wsResponseFilePath,
        ],
    );

    ws.on('close', () => {
        helperProcess.kill();
    });

    ws.on('error', (err) => {
        helperProcess.kill();
        ws.close(3999, `SERVER-UNEXPECTED-CONDITION. ${err.code}`);
    });

    ws.on('open', () => {
        const triggerInfo = {
            triggerName: 'WS-OPEN',
            currentMessage: null,
            request: req,
            query: req.query,
            params: req.params,
            lineageArg: null,
        };
        if (!helperProcess.killed)
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
        if (!helperProcess.killed)
            helperProcess.send(triggerInfo);
    });

    helperProcess.on('message', execResult => {
        if (ws.readyState !== 1) {
            log.error('The connection is closing or has been closed.');
            return;
        }
        const { jsResult, meetWithErr } = JSON.parse(execResult);
        let action = 'SEND';
        let response;
        let actionDelay = 0;
        if (meetWithErr) {
            log.error(jsResult);
            response = jsResult;
            ws.send(response);
            ws.close(3998, 'JS-SCRIPT-ERROR. Failed to execute ./ws-response.js.');
            return;
        } else if (_.isPlainObject(jsResult) && jsResult.isMetaBox) {
            /**
             * A meta box js result:
             * {
             *      isMetaBox: true,
             *      responseShouldEscapeBufferRecover: true,
             *      response: 'response content',
             *      actionDelay: 500,
             *      action: 'SEND', // 'SEND' | 'PING' | 'PONG' | 'CLOSE'
             *      selfTrigger: {
             *          triggerDelay: 500,
             *          lineageArg: 'what ws-response.js want to heritage',
             *          lineageArgShouldEscapeBufferRecover: false,
             *      } | [{}],
             * }
             */
            if (
                jsResult.action
                && jsResult.action !== 'SEND'
                && jsResult.action !== 'PING'
                && jsResult.action !== 'PONG'
                && jsResult.action !== 'CLOSE'
            ) {
                log.error(`Bad action property result '${jsResult.action}' `
                    + 'when trigger ./ws-response.js '
                    + `with ${JSON.stringify(jsResult.triggerInfo)}. `
                    + 'Will use default action "SEND".');
                action = 'SEND';
            } else {
                action = jsResult.action || 'SEND';
            }
            response = jsResult.response;
            if (
                !jsResult.responseShouldEscapeBufferRecover
                && _.isPlainObject(response)
                && response.type === 'Buffer'
                && _.isArray(response.data)
            ) {
                response = Buffer.from(response.data);
            }
            if (jsResult.actionDelay) {
                actionDelay = parseTimeStr(jsResult.actionDelay);
                if (actionDelay === false) {
                    log.error(`Bad actionDelay time property result '${jsResult.actionDelay}' `
                        + 'when trigger ./ws-response.js '
                        + `with ${JSON.stringify(jsResult.triggerInfo)}. `
                        + 'Will not delay action.');
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
                    lineageArgShouldEscapeBufferRecover: selfTrigger.lineageArgShouldEscapeBufferRecover,
                };
                let triggerDelay = 0;
                triggerDelay = parseTimeStr(jsResult.triggerDelay);
                if (triggerDelay === false) {
                    log.error(
                        `Bad self triggerDelay time property '${selfTrigger.triggerDelay}' `
                        + 'when trigger ./ws-response.js '
                        + `with ${JSON.stringify(jsResult.triggerInfo)}. `
                        + 'Will not delay self triggering.');
                }
                if (triggerDelay) {
                    setTimeout(() => {
                        if (!helperProcess.killed)
                            helperProcess.send(triggerInfo);
                    }, triggerDelay);
                } else {
                    if (!helperProcess.killed)
                        helperProcess.send(triggerInfo);
                }
            }
            if (jsResult.selfTrigger) {
                if (_.isPlainObject(jsResult.selfTrigger)) {
                    handleSingleSelfTrigger(jsResult.selfTrigger);
                } else if (_.isArray(jsResult.selfTrigger)) {
                    jsResult.selfTrigger.forEach(handleSingleSelfTrigger);
                } else {
                    log.error(`Bad selfTrigger property result '${jsResult.selfTrigger}' `
                        + 'when trigger ./ws-response.js '
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

        if (action === 'SEND') {
            if (response) {
                response = JSON.stringify(response);
                if (actionDelay) {
                    setTimeout(() => ws.send(response), actionDelay);
                } else {
                    ws.send(response);
                }
            }
        } else if (action === 'PING') {
            response = JSON.stringify(response);
            if (actionDelay) {
                setTimeout(() => ws.ping(response), actionDelay);
            } else {
                ws.ping(response);
            }
        } else if (action === 'PONG') {
            response = JSON.stringify(response);
            if (actionDelay) {
                setTimeout(() => ws.pong(response), actionDelay);
            } else {
                ws.pong(response);
            }
        } else if (action === 'CLOSE') {
            let code = response && response.code ? response.code : 1000;
            let reason = response && response.reason ? response.reason : '';
            reason += '';
            if (typeof code !== 'number' || !isValidWsStatusCode(code)) {
                log.error(`Invalid websocket close code number '${code}'. `
                    + 'Will close with code 1000.');
                code = 1000;
            }
            if (Buffer.from(reason).byteLength > MAX_CLOSE_REASON_BYTE_LENGTH) {
                log.warn('Close reason message must not be greater than 123 bytes. '
                    + `Got reason '${reason}'. `
                    + 'Will close with empty reason.');
                reason = '';
            }
            if (actionDelay) {
                setTimeout(() => ws.close(code, reason), actionDelay);
            } else {
                ws.close(code, reason);
            }
        }
    });
};
