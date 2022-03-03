const pathUtil = require('path');
const { fork } = require('child_process');
const _ = require('lodash');
const log = require('../utils/log.js');
const isValidWsStatusCode = require('../utils/isValidWsStatusCode.js');
const parseTimeStr = require('../utils/parseTimeStr.js');

const MAX_CLOSE_REASON_BYTE_LENGTH = 123;
const MAX_PING_PONG_DATA_BYTE_LENGTH = 125;

function toTransable(data) {
    if (data instanceof Buffer)
        return data;
    if (typeof data === 'string')
        return data;
    return JSON.stringify(data);
}

module.exports = (ws, req, wsResponseFilePath) => {
    const prunedReq = {
        complete: req.complete,
        headers: req.headers,
        httpVersion: req.httpVersion,
        method: req.method,
        rawHeaders: req.rawHeaders,
        rawTrailers: req.rawTrailers,
        trailers: req.trailers,
        url: req.url,
    };
    const helperProcess = fork(
        pathUtil.resolve(__dirname, './execJsFileHelperWs.js'),
        [
            wsResponseFilePath,
        ],
    );

    const initTriggerInfo = {
        triggerName: 'WS-OPEN',
        currentMessage: null,
        currentMessageIsBinary: false,
        request: prunedReq,
        query: req.query,
        params: req.params,
        lineageArg: null,
        lineageArgEscapeBufferRecover: false,
    };
    if (!helperProcess.killed)
        helperProcess.send(JSON.stringify(initTriggerInfo));

    ws.on('close', () => {
        helperProcess.kill();
    });

    ws.on('error', (err) => {
        log.error(err);
        helperProcess.kill();
    });

    ws.on('message', (currentMessage, isBinary) => {
        if (!isBinary) {
            currentMessage = currentMessage.toString();
        }
        const triggerInfo = {
            triggerName: 'WS-MESSAGE',
            currentMessage,
            currentMessageIsBinary: isBinary,
            request: prunedReq,
            query: req.query,
            params: req.params,
            lineageArg: null,
            lineageArgEscapeBufferRecover: false,
        };
        if (!helperProcess.killed)
            helperProcess.send(JSON.stringify(triggerInfo));
    });

    helperProcess.on('message', execResult => {
        if (ws.readyState !== 1) {
            log.error('The connection is not ready or is closing or has been closed.');
            return;
        }
        const { jsResult, meetWithErr } = JSON.parse(execResult);
        let action = 'SEND';
        let response;
        let actionDelay = 0;
        let insistSendEmpty = false;
        if (meetWithErr) {
            log.error(jsResult);
            response = jsResult;
            ws.send(response);
            ws.close(3998, 'JS-SCRIPT-ERROR. Failed to execute ./ws-response.js.');
            return;
        } else if (_.isPlainObject(jsResult) && jsResult.isMetaBox) {
            /**
             * A meta box js result:
             * https://github.com/badeggg/mock-api#Rules-of-a-surrounding-meta-box
             */
            if (!jsResult.action) {
                action = 'SEND';
            } else if (
                jsResult.action !== 'send'
                && jsResult.action !== 'ping'
                && jsResult.action !== 'pong'
                && jsResult.action !== 'close'
                && jsResult.action !== 'SEND'
                && jsResult.action !== 'PING'
                && jsResult.action !== 'PONG'
                && jsResult.action !== 'CLOSE'
            ) {
                log.error(`Bad action property result '${jsResult.action}' `
                    + 'when trigger ./ws-response.js. '
                    + 'Will use default action "SEND".');
                action = 'SEND';
            } else {
                action = jsResult.action.toUpperCase();
            }

            response = jsResult.response;
            if (
                !jsResult.responseEscapeBufferRecover
                && _.isPlainObject(response)
                && response.type === 'Buffer'
                && _.isArray(response.data)
            ) {
                response = Buffer.from(response.data);
            }

            insistSendEmpty = jsResult.insistSendEmpty === undefined
                ? false
                : Boolean(jsResult.insistSendEmpty);

            if (jsResult.actionDelay) {
                actionDelay = parseTimeStr(jsResult.actionDelay);
                if (actionDelay === false) {
                    log.error(`Bad actionDelay time property result '${jsResult.actionDelay}' `
                        + 'when trigger ./ws-response.js. '
                        + 'Will not delay action.');
                }
            }

            function handleSingleSelfTrigger(selfTrigger) {
                const triggerInfo = {
                    triggerName: 'SELF-TRIGGER',
                    currentMessage: null,
                    currentMessageIsBinary: false,
                    request: prunedReq,
                    query: req.query,
                    params: req.params,
                    lineageArg: selfTrigger.lineageArg,
                    lineageArgEscapeBufferRecover:
                        Boolean(selfTrigger.lineageArgEscapeBufferRecover),
                };
                let triggerDelay = 0;
                if (selfTrigger.triggerDelay) {
                    triggerDelay = parseTimeStr(selfTrigger.triggerDelay);
                    if (triggerDelay === false) {
                        log.error(
                            `Bad self triggerDelay time property '${selfTrigger.triggerDelay}' `
                            + 'when trigger ./ws-response.js. '
                            + 'Will not delay self triggering.');
                    }
                }
                if (triggerDelay) {
                    setTimeout(() => {
                        if (!helperProcess.killed)
                            helperProcess.send(JSON.stringify(triggerInfo));
                    }, triggerDelay);
                } else {
                    helperProcess.send(JSON.stringify(triggerInfo));
                }
            }
            if (jsResult.selfTrigger) {
                if (_.isPlainObject(jsResult.selfTrigger)) {
                    handleSingleSelfTrigger(jsResult.selfTrigger);
                } else if (_.isArray(jsResult.selfTrigger)
                    && _.every(jsResult.selfTrigger, _.isPlainObject)) {
                    jsResult.selfTrigger.forEach(handleSingleSelfTrigger);
                } else {
                    log.error(
                        'Bad selfTrigger property result '
                        + `'${JSON.stringify(jsResult.selfTrigger)}' `
                        + 'when trigger ./ws-response.js '
                        + 'Refer doc for details.'
                    ); // todo
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
            if (response || insistSendEmpty) {
                response = toTransable(response);
                if (actionDelay) {
                    setTimeout(() => ws.send(response), actionDelay);
                } else {
                    ws.send(response);
                }
            }
        }
        if (action === 'PING') {
            response = toTransable(response);
            if (response && Buffer.from(response).byteLength > MAX_PING_PONG_DATA_BYTE_LENGTH) {
                log.warn('Ping data must not be greater than '
                    + `${MAX_PING_PONG_DATA_BYTE_LENGTH} bytes. `
                    + `Got data '${response}'. `
                    + 'Will ping with empty data.');
                response = '';
            }
            if (actionDelay) {
                setTimeout(() => ws.ping(response), actionDelay);
            } else {
                ws.ping(response);
            }
        }
        if (action === 'PONG') {
            response = toTransable(response);
            if (response && Buffer.from(response).byteLength > MAX_PING_PONG_DATA_BYTE_LENGTH) {
                log.warn('Pong data must not be greater than '
                    + `${MAX_PING_PONG_DATA_BYTE_LENGTH} bytes. `
                    + `Got data '${response}'. `
                    + 'Will pong with empty data.');
                response = '';
            }
            if (actionDelay) {
                setTimeout(() => ws.pong(response), actionDelay);
            } else {
                ws.pong(response);
            }
        }
        if (action === 'CLOSE') {
            let code = response && response.code ? response.code : 1000;
            let reason = response && response.reason ? response.reason : '';
            reason = toTransable(reason);
            if (typeof code !== 'number' || !isValidWsStatusCode(code)) {
                log.error(`Invalid websocket close code number '${code}'. `
                    + 'Will close with code 1000.');
                code = 1000;
            }
            if (response && Buffer.from(reason).byteLength > MAX_CLOSE_REASON_BYTE_LENGTH) {
                log.warn('Close reason message must not be greater than '
                    + `${MAX_CLOSE_REASON_BYTE_LENGTH} bytes. `
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
