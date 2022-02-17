#!/usr/bin/env node

/**
 * A helper to execute the specified js script which supposed to generate **http** response
 * content. The js script should export the desired response content or a function which
 * returns the response content. If the export is a function, it will receive an argument
 * 'request', which is an object contains { method, query, params, body } properties.
 * The reasons that we need this helper are 1) we do not want any cache for the js script
 * so that every change in it will take effect immediately, and 2) we do not want 'outer'
 * js code bother mock-api self.
 *
 * @zhaoxuxu @2021-7-24 write
 * @zhaoxuxu @2022-2-14 update
 */

const jsFilePath = process.argv[2];
const req = JSON.parse(process.argv[3]);
const communicateBoundaryId = process.argv[4];

let jsResult;
let meetWithErr = false;
try {
    const script = require(jsFilePath);
    if (typeof script === 'function') {
        jsResult = script(req);
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
});
process.stdout.write(communicateBoundaryId + ret + communicateBoundaryId);
