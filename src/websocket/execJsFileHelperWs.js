#!/usr/bin/env node

/**
 * A helper to execute the specified js script which supposed to generate the **websocket**
 * response content. The js script should export the desired response content or a function
 * which returns the response content. If the export is a function, it will receive an
 * argument. Argument is websocket response trigger information, which is an object contains
 * { triggerName, currentMessage, request, query, params, lineageArg }.
 *
 * The reasons that we need this helper are 1) we do not want any cache for the js script
 * so that every change in it will take effect immediately, and 2) we do not want 'outer'
 * js code bother mock-api self.
 *
 * @zhaoxuxu @2021-2-14 write
 * @zhaoxuxu @2022-2-20 update
 */

const _ = require('lodash');
const jsFilePath = process.argv[2];

process.on('message', triggerInfo => {
    let jsResult;
    let meetWithErr = false;
    if (triggerInfo.currentMessage) { // currentMessage must be a 'Buffer' if exist
        triggerInfo.currentMessage = Buffer.from(triggerInfo.currentMessage);
    }
    if (
        !triggerInfo.lineageArgShouldEscapeBufferRecover
        && _.isPlainObject(triggerInfo.lineageArg)
        && triggerInfo.lineageArg.type === 'Buffer'
        && _.isArray(triggerInfo.lineageArg.data)
    ) {
        triggerInfo.lineageArg = Buffer.from(triggerInfo.lineageArg.data);
    }
    try {
        const script = require(jsFilePath);
        if (typeof script === 'function') {
            jsResult = script(triggerInfo);
        } else {
            jsResult = script;
        }
    } catch (err) {
        const errStr = (
            `Failed to execute js script '${jsFilePath}'.\n`
            + err.stack
        );
        jsResult = errStr;
        meetWithErr = true;
    }

    const ret = JSON.stringify({
        jsResult,
        meetWithErr,
        triggerInfo,
    });
    process.send(ret);
});
