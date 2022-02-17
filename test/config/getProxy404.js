const tap = require('tap');
const toNiceJson = require('../testUtils/toNiceJson.js');

tap.test('find proxy404 file, parse it and return result', tap => {
    const proxy404Content = `
    # some comment
    nodejs https://nodejs.org/   # all request with 'nodejs' in path
    bing   https://cn.bing.com/
    /api   http://api-server/api # all request with '/api' prefix path
    /req   http://server/req  third and other items are ignored
    https://www.google.com/
    nodejs.org # invalid url target, only domain
    http google https://www.google.com/
    hTtp google https://www.google.com/
    HTTP google https://www.google.com/
    ws https://www.google.com/
    WS google https://www.google.com/
    `;
    const fakeServicesBasePath = tap.testdir({
        proxy404: proxy404Content,
    });

    let errorMsgs = [];
    const getProxy404 = tap.mock('../../src/config/getProxy404.js', {
        '../../src/config/getFakeServicesBasePath.js': () => fakeServicesBasePath,
        '../../src/utils/log.js': {
            error: (msg) => errorMsgs.push('error: ' + msg),
        },
    });
    tap.matchSnapshot(toNiceJson(getProxy404()), 'parsed proxy404 result');
    tap.match(
        errorMsgs,
        [
            'error: Bad proxy 404 target \'nodejs.org\'.',
            'error: TypeError [ERR_INVALID_URL]: Invalid URL',
        ],
        'log errors',
    );
    tap.end();
});

tap.test('proxy404 file not exist, should return an empty array', tap => {
    const fakeServicesBasePath = tap.testdir({});

    const getProxy404 = tap.mock('../../src/config/getProxy404.js', {
        '../../src/config/getFakeServicesBasePath.js': () => fakeServicesBasePath,
    });
    const proxy404 = getProxy404();
    tap.type(proxy404, Array);
    tap.equal(proxy404.length, 0);
    tap.end();
});

tap.test('proxy404 file has only comment lines, should return an empty array', tap => {
    const proxy404Content = `
    # some comment
    # some comment
    `;
    const fakeServicesBasePath = tap.testdir({
        proxy404: proxy404Content,
    });

    const getProxy404 = tap.mock('../../src/config/getProxy404.js', {
        '../../src/config/getFakeServicesBasePath.js': () => fakeServicesBasePath,
    });
    const proxy404 = getProxy404();
    tap.type(proxy404, Array);
    tap.equal(proxy404.length, 0);
    tap.end();
});

tap.test('proxy404 file is empty, should return an empty array', tap => {
    const fakeServicesBasePath = tap.testdir({
        proxy404: '',
    });

    const getProxy404 = tap.mock('../../src/config/getProxy404.js', {
        '../../src/config/getFakeServicesBasePath.js': () => fakeServicesBasePath,
    });
    const proxy404 = getProxy404();
    tap.type(proxy404, Array);
    tap.equal(proxy404.length, 0);
    tap.end();
});
