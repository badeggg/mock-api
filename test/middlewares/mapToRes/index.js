/**
 * Test suit in this file is not complete. Cause few important modules are mocked,
 * while they deserve to be real ones to make sure we are using them rightly. For example,
 * we should have a expectation if a random http header is set to express request object.
 * Since the mocked modules, some logic is not covered, e.g. doProxy function.
 * We mocked those modules here for reason that it will be way complicated if they are
 * real for testing ---- most logic in src/mock.js may need rewrite in this file.
 * The completion test suit for src/middlewares/mapToRes/index.js is in test/mock/js.
 * @zhaoxuxu @2021-6-2
 */
const tap = require('tap');

tap.test('code logic only', async tap => {
    const mapToRes = tap.mock('../../../src/middlewares/mapToRes/index.js', {
        '../../../src/middlewares/mapToRes/matchAResponse.js': (req) => {
            switch (req) {
            case 'NORMAL':
                return {
                    resFilePath: './response',
                    resHeaders: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Some-Custom-Header': 'some value',
                    },
                    shouldUseExpressSendFile: true,
                };
            case 'NORMAL_WITH_DELAY':
                return {
                    resFilePath: './response',
                    delayTime: 300,
                    resHeaders: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Some-Custom-Header': 'some value',
                    },
                    shouldUseExpressSendFile: true,
                };
            case 'NO_ANY_MATCH':
                return null;
            case 'WITH_STATUS_CODE':
                return {
                    resFilePath: './response',
                    shouldUseExpressSendFile: true,
                    statusCode: 400,
                };
            case 'WITH_BODY':
                return {
                    shouldUseExpressSendFile: false,
                    resBody: 'response body'
                };
            }
        },
        '../../../src/middlewares/mapToRes/matchAProxy404.js': req => null,
    });
    const reqs = {
        normal: 'NORMAL',
        normalDelay: 'NORMAL_WITH_DELAY',
        noAnyMatch: 'NO_ANY_MATCH',
        withStatusCode: 'WITH_STATUS_CODE',
        withBody: 'WITH_BODY',
    };
    class Res {
        constructor() {
            this.headers = {};
            this.code = 200;
            this.body = '';
            this.sendFilePath = '';
            this.hasSent = false;
        }
        set(arg1, arg2) {
            if (typeof arg1 === 'string')
                this.headers[arg1] = arg2;
            else if (typeof arg1 === 'object')
                Object.assign(this.headers, arg1);
        }
        sendStatus(code) {
            this.code = code;
            this.hasSent = true;
        }
        send(body) {
            this.body = body;
            this.hasSent = true;
        }
        sendFile(filePath) {
            this.sendFilePath = filePath;
            this.hasSent = true;
        }
        status(code) {
            this.code = code;
        }
    }

    const resTestNormal = new Res();
    mapToRes(reqs.normal, resTestNormal);
    tap.matchSnapshot(resTestNormal.headers, 'normal headers');
    tap.equal(resTestNormal.code,         200,          'status code');
    tap.equal(resTestNormal.body,         '',           'body');
    tap.equal(resTestNormal.sendFilePath, './response', 'send file');
    tap.equal(resTestNormal.hasSent,      true,         'has sent');

    const resTestNormalDelay = new Res();
    mapToRes(reqs.normalDelay, resTestNormalDelay);
    tap.equal(resTestNormalDelay.hasSent, false, 'should not have sent');
    tap.resolveMatch(
        new Promise(resolve => {
            setTimeout(() => {
                resolve(resTestNormalDelay.hasSent);
            }, 500);
        }),
        true,
        'should have sent',
    );

    const resTestNoAnyMatch = new Res();
    mapToRes(reqs.noAnyMatch, resTestNoAnyMatch);
    tap.equal(resTestNoAnyMatch.hasSent, true, 'has sent');
    tap.equal(resTestNoAnyMatch.code,    404,  'status code');
    tap.matchSnapshot(resTestNoAnyMatch.headers, '404 headers');
    tap.equal(resTestNoAnyMatch.body,
        'Not Found.<br>\n'
        + 'You may need set a proxy404 file in fake-services folder.<br>\n'
        + 'Refer https://github.com/badeggg/mock-api#proxy-404'
    );

    const resTestStatusCode = new Res();
    mapToRes(reqs.withStatusCode, resTestStatusCode);
    tap.equal(resTestStatusCode.code, 400, 'status code');

    const resTestBody = new Res();
    mapToRes(reqs.withBody, resTestBody);
    tap.equal(resTestBody.code, 200, 'status code');
    tap.equal(resTestBody.body, 'response body', 'response body');
});
