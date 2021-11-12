const child_process = require('child_process');
const fs = require('fs');
const net = require('net');
const pathUtil = require('path');
const tap = require('tap');
const axios = require('axios');
const tcpPortUsed = require('tcp-port-used');
const removePathPrefix = require('./testUtils/removePathPrefix.js');
const obscureErrorStack = require('./testUtils/obscureErrorStack.js');

function removePortNumber(msg) {
    return msg.replace(/(?<=listening on: )\d+/, 'xxxx');
}

tap.test('basic general function', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'fake-api-path': {
                response: 'Some response content.',
            },
        },
    });
    let infoMsgs = [];
    let warningMsgs = [];
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => fakeServicesDir,
        '../src/utils/log.js': {
            info: (msg) => infoMsgs.push('info: '
                + removePathPrefix(removePortNumber(msg), fakeServicesDir)
            ),
            warn: (msg) => warningMsgs.push('warning: '
                + removePathPrefix(msg, fakeServicesDir)
            ),
        },
    });

    const mockServer = await mock();
    tap.type(mockServer, require('http').Server,
        'mock function should return a nodejs http.Server');
    tap.type(mockServer.address().port, 'number',
        'mock function should return a nodejs http.Server with a port number');

    const mockingLocationPath = pathUtil.resolve(fakeServicesDir, './.mockingLocation');
    tap.ok(fs.existsSync(mockingLocationPath),
        '.mockingLocation file should exist');
    tap.ok(fs.statSync(mockingLocationPath).isFile(),
        '.mockingLocation shoule be a file');
    tap.equal(
        fs.readFileSync(mockingLocationPath, 'utf-8'),
        `http://localhost:${mockServer.address().port}`,
        'text content in .mockingLocation file'
    );

    const options = {
        url: fs.readFileSync(mockingLocationPath, 'utf-8') + '/fake-api-path',
        method: 'GET',
    };
    const response = await axios.request(options);
    tap.equal(response.data, 'Some response content.');

    tap.matchSnapshot(infoMsgs, 'log infos');
    tap.matchSnapshot(warningMsgs, 'log warnings');

    mockServer.close();
    tap.end();
});

tap.test('try next plus one port when current port is not available', async tap => {
    let infoMsgs = [];
    const inUsePort = 3000;
    const isInUse = await tcpPortUsed.check(inUsePort, '127.0.0.1');
    let portHolderServer;
    if (!isInUse) {
        await new Promise(resolve => {
            portHolderServer = net.createServer();
            portHolderServer.listen(inUsePort, () => {
                resolve();
            });
        });
    }
    let availablePort = inUsePort + 1;
    while(true) {
        const isAvailable = !(await tcpPortUsed.check(availablePort, '127.0.0.1'));
        if (isAvailable) {
            break;
        }
        availablePort++;
    }
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/log.js': {
            info: (msg) => infoMsgs.push('info: ' + removePortNumber(msg)),
        },
    });
    const mockServer = await mock();
    tap.equal(mockServer.address().port, availablePort,
        'should try next one port');
    if (portHolderServer)
        portHolderServer.close();
    mockServer.close();
    tap.matchSnapshot(infoMsgs, 'log infos');
    tap.end();
});

tap.test('general doubt cases as a whole', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'general': {
                response: '["implicit response"]',
                specifiedResponse: '["specified response"]',
                'picture.png': 'picture(text here is fine)',
                map: `
                    OPTIONS # should use implicit response file
                    GET ?whatname= ./specifiedResponse
                    GET ?give-me-a-pic&forceHeaderJpg&causual-header ./picture.png \\
                        --res-headers 'content-type: image/jpeg' \\
                        -h 'a-casual-header: a casual header'
                    GET ?give-me-a-pic ./picture.png
                `,
                '__address__': {
                    specifiedResponse: '["china", "beijing"]',
                    map: `
                        get _address={^\\w+$} ./specifiedResponse
                    `,
                },
            },
            'delay': {
                response: '["i am late"]',
                map: 'GET -t 300',
            },
            response: '["fake service root"]',
            proxy404: `
                # bing dictionary to cover url query
                /AS/Suggestions https://cn.bing.com

                # baidu dictionary to cover json body
                /sug https://fanyi.baidu.com

                # youdao dictionary to cover urlencoded body
                /translate_o https://fanyi.youdao.com
            `,
        },
    });
    let infoMsgs = [];
    let warnMsgs = [];
    let errorMsgs = [];
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => fakeServicesDir,
        '../src/utils/log.js': {
            info: (msg) => infoMsgs.push('info: ' + removePortNumber(msg)),
            warn: (msg) => warnMsgs.push('warn: ' + msg),
            error: (msg) => errorMsgs.push('error: ' + msg),
        },
    });
    const mockServer = await mock();
    const mockingLocation = `http://localhost:${mockServer.address().port}`;

    let response;
    response = await axios.request({
        url: mockingLocation,
        method: 'GET',
    });
    tap.equal(response.data[0], 'fake service root', 'should in fake service root');

    response = await axios.request({
        url: mockingLocation + '/general',
        method: 'OPTIONS',
    });
    tap.equal(response.data[0], 'implicit response', 'should use implicit response file');

    response = await axios.request({
        url: mockingLocation + '/general',
        method: 'GET',
        params: { whatname: 'badeggg' },
    });
    tap.equal(response.data[0], 'specified response', 'basic case');

    response = await axios.request({
        url: mockingLocation + '/general',
        method: 'GET',
        params: { 'give-me-a-pic': '' },
    });
    tap.equal(response.headers['content-type'], 'image/png',
        'header content-type should be image type');
    tap.equal(response.data, 'picture(text here is fine)',
        'should give response a picture file');

    response = await axios.request({
        url: mockingLocation + '/general',
        method: 'GET',
        params: {
            'give-me-a-pic': '',
            forceHeaderJpg: '',
            'causual-header': 'feel free here',
        },
    });
    tap.equal(response.headers['content-type'], 'image/jpeg',
        'header content-type should be overridden');
    tap.equal(response.headers['a-casual-header'], 'a casual header',
        'a random custom header should be ok');
    tap.equal(response.data, 'picture(text here is fine)',
        'should give response a picture file');

    response = await axios.request({
        url: mockingLocation + '/general/askAddress',
        method: 'GET',
    });
    tap.equal(response.data[0], 'china', 'path params should be ok');

    let delayedResponse = null;
    const testDelayResponsed = axios.request({
        url: mockingLocation + '/delay',
        method: 'GET',
    })
        .then((resp) => {
            delayedResponse = resp;
        });
    tap.equal(delayedResponse, null, 'delayed response not ok yet');
    tap.resolveMatch(
        new Promise(resolve => {
            setTimeout(() => {
                resolve(delayedResponse.data[0]);
            }, 600);
        }),
        'i am late',
        'delayed response content',
    );

    response = await axios.request({
        url: mockingLocation + '/AS/Suggestions?scope=dictionary&pt=page.bingdict&bq=delayed&mkt=zh-cn&ds=bingdict&qry=welcom&cp=7&cvid=4C6CCF7FC8EA4DF0A02311CE7BF39A0B',
        method: 'GET',
    });
    tap.ok(
        response.data.includes('欢迎'),
        'proxy 404 bing dictionary to cover url query',
    );

    response = await axios.request({
        url: mockingLocation + '/sug',
        method: 'POST',
        data: { kw: 'welcome' },
    });
    tap.ok(
        JSON.stringify(response.data).includes('欢迎'),
        'proxy 404 baidu dictionary to cover json body',
    );

    response = await axios.request({
        url: mockingLocation + '/translate_o?smartresult=dict&smartresult=rule',
        method: 'POST',
        data: 'i=welcome%0A&from=AUTO&to=AUTO&smartresult=dict&client=fanyideskweb'
            + '&salt=16366980836162&sign=15d850c3b7004b1865f56437d4e7291d&lts=1636698083616'
            + '&bv=6162c8562c5298b891ba4697dc459245&doctype=json&version=2.1&keyfrom=fanyi.web'
            + '&action=FY_BY_REALTlME',
        headers: {
            'Connection': 'keep-alive',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'sec-ch-ua-mobile': '?0',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
            'sec-ch-ua-platform': '"macOS"',
            'Origin': 'https://fanyi.youdao.com',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://fanyi.youdao.com/',
            'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,sq;q=0.6',
            'Cookie': 'OUTFOX_SEARCH_USER_ID=1932056775@10.108.160.102; JSESSIONID=aaaTiPWF80LQegf5FZs0x; OUTFOX_SEARCH_USER_ID_NCOO=1528357016.3182464; ___rl__test__cookies=1636698083614',
        },
    });
    tap.ok(
        JSON.stringify(response.data).includes('欢迎'),
        'proxy 404 youdao dictionary test proxy urlencoded body',
    );

    try {
        response = await axios.request({
            url: mockingLocation + '/no-proxy-404-match',
            method: 'GET',
        });
    } catch (err) {
        tap.equal(err.response.status, 404, 'no proxy 404 match');
    }

    await testDelayResponsed;
    mockServer.close();
    tap.matchSnapshot(infoMsgs, 'log infos');
    tap.matchSnapshot(warnMsgs, 'log warnings');
    tap.matchSnapshot(errorMsgs, 'log errors');
});

tap.test('no proxy404 file case as a whole', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {},
    });
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => fakeServicesDir,
        '../src/utils/log.js': {
            info: () => {},
        },
    });
    const mockServer = await mock();
    const mockingLocation = `http://localhost:${mockServer.address().port}`;

    try {
        await axios.request({
            url: mockingLocation + '/no-proxy-404-file',
            method: 'GET',
        });
    } catch (err) {
        tap.equal(err.response.status, 404, 'no proxy 404 file');
    }

    mockServer.close();
});

tap.test('cover proxy error', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {},
    });
    let errorMsgs = [];
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => fakeServicesDir,
        '../src/config/getProxy404.js': () => ['.*', 'google.com'],
        '../src/utils/log.js': {
            info: () => {},
            error: (msg) => errorMsgs.push('error: ' + msg),
        },
    });
    const mockServer = await mock();
    const mockingLocation = `http://localhost:${mockServer.address().port}`;

    try {
        await axios.request({
            url: mockingLocation + '/404',
            method: 'GET',
        });
    } catch (err) {
        tap.equal(err.response.status, 502, 'should response 502');
        tap.ok(err.response.data.startsWith('Failed to proxy 404.'));
        tap.matchSnapshot(err.response.data);
    }

    mockServer.close();
    tap.matchSnapshot(errorMsgs, 'log errors');
});

tap.test('clear mockingLocation when quit', async tap => {
    const assistPath = pathUtil.resolve(__dirname, './mock.assist.js');
    const assist = child_process.fork(assistPath);
    const mockingLocationPath = pathUtil.resolve(__dirname, '.mockingLocation');
    tap.resolveMatch(
        new Promise(resolve => {
            assist.on('message', m => {
                if (m === 'started') {
                    resolve(fs.existsSync(mockingLocationPath));
                    process.kill(assist.pid);
                }
            });
        }),
        true,
        '.mockingLocation file should exist',
    );
    tap.resolveMatch(
        new Promise(resolve => {
            assist.on('exit', m => {
                resolve(fs.existsSync(mockingLocationPath));
            });
        }),
        false,
        '.mockingLocation file should not exist anymore',
    );
});

tap.test('error log on clear mockingLocation when quit', async tap => {
    const assistPath = pathUtil.resolve(__dirname, './mock.assist.js');
    const assist = child_process.fork(assistPath);
    const mockingLocationPath = pathUtil.resolve(__dirname, '.mockingLocation');
    tap.resolveMatchSnapshot(
        new Promise(resolve => {
            assist.on('message', m => {
                if (m === 'started') {
                    fs.unlinkSync(mockingLocationPath);
                    process.kill(assist.pid);
                } else if (m.startsWith('error: ')) {
                    resolve(removePathPrefix(m, __dirname));
                }
            });
        }),
    );
});

tap.test('response js result as a whole', async tap => {
    const fakeServicesDir = tap.testdir({
        'fake-services': {
            'fake-api-path': {
                'ok.js': `
                    const obj1 = {a: 1};
                    const obj2 = {a: 2};
                    module.exports = (req) => {
                        return {
                            ...obj1,
                            name: req.query.name,
                        };
                    };
                `,
                'bad.js': `
                    const a = 90;
                    module.exports = () => {
                        a = 8;
                        return a;
                    };
                `,
                'undefined.js': `
                    module.exports = () => {
                        return;
                    };
                `,
                'string.js': `
                    module.exports = () => {
                        return 'string';
                    };
                `,
                'number.js': `
                    module.exports = () => {
                        return 123;
                    };
                `,
                'null.js': `
                    module.exports = () => {
                        return null;
                    };
                `,
                'function.js': `
                    module.exports = () => {
                        return () => {console.log('foo')};
                    };
                `,
                'exportNum.js': `
                    module.exports = 1;
                `,
                'exportStr.js': `
                    module.exports = 'str';
                `,
                'exportObj.js': `
                    module.exports = {a: 12};
                `,
                'exportArr.js': `
                    module.exports = [1, null, {a: 56}];
                `,
                'exportNull.js': `
                    module.exports = null;
                `,
                'exportSymbol.js': `
                    module.exports = Symbol();
                `,
                'exportObjHasFunc.js': `
                    module.exports = {fn: () => {}};
                `,
                map: `
                    GET ?name=badeggg   -r ./ok.js
                    GET ?name=badeggg1  -r ./undefined.js
                    GET ?name=badeggg2  -r ./string.js
                    GET ?name=badeggg3  -r ./number.js
                    GET ?name=badeggg4  -r ./null.js
                    GET ?name=badeggg5  -r ./function.js
                    GET ?name=badeggg6  -r ./exportNum.js
                    GET ?name=badeggg7  -r ./exportStr.js
                    GET ?name=badeggg8  -r ./exportObj.js
                    GET ?name=badeggg9  -r ./exportArr.js
                    GET ?name=badeggg10 -r ./exportNull.js
                    GET ?name=badeggg11 -r ./exportSymbol.js
                    GET ?name=badeggg12 -r ./exportObjHasFunc.js
                    GET ?name=badegggXX -r ./bad.js
                `,
            },
        },
    });
    let warningMsgs = [];
    let errorMsgs = [];
    const mock = tap.mock('../src/mock.js', {
        '../src/utils/getProjectRoot.js': () => fakeServicesDir,
        '../src/utils/log.js': {
            info: () => {},
            warn: (msg) => warningMsgs.push('warning: '
                + removePathPrefix(msg, fakeServicesDir)
            ),
            error: (msg) => errorMsgs.push(
                'error: ' + removePathPrefix(
                    obscureErrorStack(msg),
                    pathUtil.resolve(fakeServicesDir, '../../')
                )
            ),
        },
    });

    const mockServer = await mock();

    const mockingLocation = `http://localhost:${mockServer.address().port}`;

    let options = {
        url: mockingLocation + '/fake-api-path',
        params: {name: 'badeggg'},
        method: 'GET',
    };
    let response = await axios.request(options);
    tap.matchSnapshot(response.data, 'ok.js result');

    options.params.name = 'badeggg1';
    response = await axios.request(options);
    tap.equal(response.data, '');

    options.params.name = 'badeggg2';
    response = await axios.request(options);
    tap.equal(response.data, 'string');

    options.params.name = 'badeggg3';
    response = await axios.request(options);
    tap.equal(response.data, 123);

    options.params.name = 'badeggg4';
    response = await axios.request(options);
    tap.equal(response.data, null);

    options.params.name = 'badeggg5';
    response = await axios.request(options);
    tap.matchSnapshot(response.data, 'function.js result');

    options.params.name = 'badeggg6';
    response = await axios.request(options);
    tap.matchSnapshot(response.data, 'js export number');

    options.params.name = 'badeggg7';
    response = await axios.request(options);
    tap.matchSnapshot(response.data, 'js export string');

    options.params.name = 'badeggg8';
    response = await axios.request(options);
    tap.matchSnapshot(response.data, 'js export object');

    options.params.name = 'badeggg9';
    response = await axios.request(options);
    tap.matchSnapshot(response.data, 'js export array');

    options.params.name = 'badeggg10';
    response = await axios.request(options);
    tap.matchSnapshot(response.data, 'js export null');

    options.params.name = 'badeggg11';
    response = await axios.request(options);
    tap.matchSnapshot(response.data, 'js export symbol');

    options.params.name = 'badeggg12';
    response = await axios.request(options);
    tap.matchSnapshot(response.data, 'js export objHasFunc');

    options.params.name = 'badegggXX';
    response = await axios.request(options);
    tap.matchSnapshot(
        removePathPrefix(
            obscureErrorStack(response.data),
            pathUtil.resolve(fakeServicesDir, '../../')
        ),
        'bad.js result'
    );

    tap.matchSnapshot(warningMsgs, 'log warnings');
    tap.matchSnapshot(errorMsgs, 'log errors');

    mockServer.close();
    tap.end();
});
