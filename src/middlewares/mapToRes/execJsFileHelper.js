#!/usr/bin/env node

/**
 * A helper to execute the specified js script which supposed to generate the response
 * content. The js script should export a function which return the response content.
 * The reasons that we need this helper is 1) we do not want any cache for the js script
 * so that every change in it will take effect immediately, and 2) we do not want 'outer'
 * js code bother mock-api self.
 * @zhaoxuxu @2021-7-24
 */

const jsFilePath = process.argv[2];
const req = JSON.parse(process.argv[3])[0];

let jsResult;
let meetWithErr = false;
try {
    const script = require(jsFilePath);
    if (typeof script !== 'function') {
        throw new Error(`ERROR_EXPORT_FUNCTION. Js file ${jsFilePath} should export `
            + 'a function which returns what you want to response.');
    }
    jsResult = script(req);
} catch (err) {
    const errStr = (
        `Failed to execute js script '${jsFilePath}'.\n`
        + (err.message.startsWith('ERROR_EXPORT_FUNCTION') ? err.message : err.stack)
    );
    jsResult = errStr;
    meetWithErr = true;
}

const ret = JSON.stringify({
    jsResult,
    meetWithErr,
});
console.log(ret);
