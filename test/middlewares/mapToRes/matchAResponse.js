const fs = require('fs');
const tap = require('tap');
const _ = require('lodash');
const pathUtil = require('path');
const removePathPrefix = require('../../testUtils/removePathPrefix.js');

function removeCfgPathPropertiesPrefix(cfg, prefix) {
    if (cfg && cfg.resFilePath)
        cfg.resFilePath = removePathPrefix(cfg.resFilePath, prefix);
    if (cfg && cfg.resHeaders && cfg.resHeaders['Mock-Not-Validated-Json-File'])
        cfg.resHeaders['Mock-Not-Validated-Json-File'] =
            removePathPrefix(cfg.resHeaders['Mock-Not-Validated-Json-File'], prefix);
    if (cfg && cfg.resHeaders && cfg.resHeaders['Mock-Warn-Invalid-Json-File'])
        cfg.resHeaders['Mock-Warn-Invalid-Json-File'] =
            removePathPrefix(cfg.resHeaders['Mock-Warn-Invalid-Json-File'], prefix);
    return cfg;
}

tap.test('class ResponseFile', async tap => {
    let fakeServicesDir = tap.testdir({
        'fake-services': {
            'fake-api-path': {
                plainTextNoExt: 'plain text.',
                jsonNoExt:      '{"name": "badeggg", "number": 100}',
                'json.json':    '{"name": "badeggg", "number": 100}',
                'invalid.json': '{name: "badeggg", "number": 100}',
                'image.png':    'text here is fine',
                bigFile:        'text here is fine',
                bigJsonFile:    'text here is fine',
            },
        },
    });
    fakeServicesDir = pathUtil.resolve(fakeServicesDir, './fake-services');
    const basePath       = pathUtil.resolve(fakeServicesDir, './fake-api-path/');
    const plainTextNoExt = pathUtil.resolve(basePath, 'plainTextNoExt');
    const jsonNoExt      = pathUtil.resolve(basePath, 'jsonNoExt');
    const json           = pathUtil.resolve(basePath, 'json.json');
    const invalidJson    = pathUtil.resolve(basePath, 'invalid.json');
    const image          = pathUtil.resolve(basePath, 'image.png');
    const bigFile        = pathUtil.resolve(basePath, 'bigFile');
    const bigJsonFile    = pathUtil.resolve(basePath, 'bigJsonFile');
    const notExistFile   = pathUtil.resolve(basePath, 'notExistFile');
    const isNotFile      = basePath;

    let errorMsgs = [];
    let warningMsgs = [];
    const ResponseFile = tap.mock('../../../src/middlewares/mapToRes/matchAResponse.js', {
        fs: {
            ...fs,
            statSync: (filePath) => {
                const pathParts = filePath.split('/');
                const fileName = pathParts[pathParts.length - 1];
                switch(fileName) {
                case 'bigFile':
                    return _.merge(fs.statSync(filePath), { size: 500 * 1024 * 1024 + 1 });
                case 'bigJsonFile':
                    return _.merge(fs.statSync(filePath), { size: 10 * 1024 * 1024 + 1 });
                default:
                    return fs.statSync(filePath);
                }
            },
        },
        '../../../src/utils/log.js': {
            error: (msg) => errorMsgs.push('error: ' + removePathPrefix(msg, fakeServicesDir)),
            warn: (msg) => warningMsgs.push('warning: ' + removePathPrefix(msg, fakeServicesDir)),
        },
    }).ResponseFile;

    tap.matchSnapshot(
        removeCfgPathPropertiesPrefix(
            new ResponseFile(plainTextNoExt).generateResCfg(),
            fakeServicesDir
        ),
        'plain text without extension'
    );
    tap.matchSnapshot(
        removeCfgPathPropertiesPrefix(
            new ResponseFile(jsonNoExt).generateResCfg(),
            fakeServicesDir
        ),
        'json without extension');
    tap.matchSnapshot(
        removeCfgPathPropertiesPrefix(
            new ResponseFile(json).generateResCfg(),
            fakeServicesDir
        ),
        'json file'
    );
    tap.matchSnapshot(
        removeCfgPathPropertiesPrefix(
            new ResponseFile(invalidJson).generateResCfg(),
            fakeServicesDir
        ),
        'invalid json file'
    );
    tap.matchSnapshot(
        removeCfgPathPropertiesPrefix(
            new ResponseFile(image).generateResCfg(),
            fakeServicesDir
        ),
        'image file'
    );
    tap.equal(
        removeCfgPathPropertiesPrefix(
            new ResponseFile(bigFile).generateResCfg(),
            fakeServicesDir
        ),
        null
    );
    tap.matchSnapshot(
        removeCfgPathPropertiesPrefix(
            new ResponseFile(bigJsonFile).generateResCfg(),
            fakeServicesDir
        ),
        'big json file'
    );
    tap.equal(new ResponseFile(notExistFile).generateResCfg(), null);
    tap.equal(new ResponseFile(isNotFile).generateResCfg(), null);
    tap.equal(new ResponseFile('').generateResCfg(), null);
    tap.equal(new ResponseFile(notExistFile).generateJsonResCfg(), null);
    tap.equal(new ResponseFile(notExistFile).generateExpressSendFileResCfg(), null);
    tap.matchSnapshot(errorMsgs, 'log errors');
    tap.matchSnapshot(warningMsgs, 'log warnings');
});

tap.test('class RuleParser', async tap => {
    const mapFileContent = `
    # basic map config line
    GET ./response
    map GET ./response
    PUT  ?query1=value&query2={.*} _param1=value +arg1.a.b=value ./response
    post -q query1=12 -p param=value -a arg=12 -t 400 ./response
    get ?prefix={pre\\d+}&reg={^\\w+$} # reminder: double backslash here is for js string syntax
    map --url-queries   query=val&query1=val1  \\
        --path-params   params=val \\
        --body-args     arg=val    \\
        --res-headers   'a-http-header: header value' \\
        --status-code   200        \\
        --req-method    get        \\
        --res-file-path ./response \\
        --delay-time    1s

    # status code
    GET -c 200
    GET -c 404
    GET -c x22
    GET -c 600
    GET -c 1000

    # http methods
    ## all methods
    GET
    HEAD
    POST
    PUT
    DELETE
    CONNECT
    OPTIONS
    TRACE
    PATCH

    get # case insensitive
    BAD
    map --req-method bad

    # res file path
    GET ./response
    GET ./not-exist
    GET -f ./not-exist -q query=val

    # delay time
    GET -t 1000
    GET -t 1s
    GET -t 1000ms
    GET -t ${Math.pow(2, 53)} # integer not safe
    GET -t 0
    GET -t
    GET -t null

    # unusual cases
    get ?query=override-me -q query=use-this-query-value # formal rule override quick format
    get ?query=value -m post                             # formal rule override quick format
    get ?query=value -q query1=cd -q query2=22           # repeat same options
    ## multiple queries options, quick res-file-path just after quick config
    GET ?query=1 _param=90 ./response --url-queries query=2 query=3
    GET -f ./response # the last item is regard as a quick res-file and removed, so error occur
    GET -t -c 300     # empty delay time
    GET -q -c 300     # empty query, '-c' and '300' are reagrd as query
    GET -c 300 -q     # empty query
    GET -o            # undefined option
    GET --only-this   # undefined option
    map -t 100        # no req-method
    GEt               # method case insensitive
    GET ?query        # key only query
    `;
    let fakeServicesDir = tap.testdir({
        'fake-services': {
            'fake-api-path': {
                map: mapFileContent,
                response: '{"name": "badeggg"}',
            },
        },
    });
    fakeServicesDir = pathUtil.resolve(fakeServicesDir, './fake-services');
    let errorMsgs = [];
    let warningMsgs = [];
    const RuleParser = tap.mock('../../../src/middlewares/mapToRes/matchAResponse.js', {
        '../../../src/utils/log.js': {
            error: (msg) => errorMsgs.push('error: ' + removePathPrefix(msg, fakeServicesDir)),
            warn: (msg) => warningMsgs.push('warning: ' + removePathPrefix(msg, fakeServicesDir)),
        },
    }).RuleParser;
    const semiParseConfigFile = require('../../../src/utils/semiParseConfigFile');
    const cdResult = {
        path: pathUtil.resolve(fakeServicesDir, './fake-api-path/'),
    };
    const mapFilePath = pathUtil.resolve(cdResult.path, 'map');
    const semiParsedMap = semiParseConfigFile(mapFilePath);
    let cfgs = [];
    for (let i = 0; i < semiParsedMap.length; i++) {
        let line = semiParsedMap[i];
        let cfg = new RuleParser(line, cdResult).parse();
        removeCfgPathPropertiesPrefix(cfg, fakeServicesDir);
        cfgs.push(cfg);
    }
    tap.matchSnapshot(cfgs, 'parsed rule lines');
    tap.matchSnapshot(errorMsgs, 'log errors');
    tap.matchSnapshot(warningMsgs, 'log warnings');

    tap.equal(new RuleParser([], cdResult).parse(), null);
});

tap.test('class Matcher', async tap => {
    const mapFileContent = `
    # line order is important
    GET ?query ./response
    GET ./response

    # all match fields
    POST ?string=str&prefix={pre\\d}&number={\\d+} _integer={\\d+}&id={\\w+} \\
         +.name=badeggg&nestObj.email={^zhaoxuxu\\w\\w@\\w+\\.com$}&arr[1].country=china

    # body args
    POST +[3].name=bade
    POST +typo.email={zhaoxuxu}
    map +[3].name={bade}
    +[0]=a

    # pair chars
    options -q 'name="badeggg"' ./pair-chars-res
    options -p 'hasSpace=has space' -q ( has space in property=  and in value ) \\
            ./pair-chars-res

    # empty value of a query/params/body field means this value can be anything except undefined
    # which means it can be whatever but must appear
    POST -q valueCanBeAnythingIfOnlyAppear ./specifiedResponse
    POST -p valueCanBeAnythingIfOnlyAppear ./specifiedResponse

    # code coverage
    POST -q name= -p path ./specifiedResponse
    POST -p pathParamsNotMatch ./specifiedResponse
    `;
    let fakeServicesDir = tap.testdir({
        'fake-services': {
            'general': {
                map: mapFileContent,
                response: '{"test": "general"}',
                specifiedResponse: '["specified response"]',
                'pair-chars-res': '{}',
            },
            'on-implicit-response-file': {
                map: mapFileContent,
                specifiedResponse: '["specified response"]',
            },
            'no-map': {
                response: '{"test": "no-map"}',
            },
            'empty': {},
        },
    });
    fakeServicesDir = pathUtil.resolve(fakeServicesDir, './fake-services');
    let infoMsgs = [];
    let warningMsgs = [];
    let errorMsgs = [];
    const Matcher = tap.mock('../../../src/middlewares/mapToRes/matchAResponse.js', {
        '../../../src/utils/log.js': {
            info: (msg) => infoMsgs.push('info: ' + removePathPrefix(msg, fakeServicesDir)),
            warn: (msg) => warningMsgs.push('warning: ' + removePathPrefix(msg, fakeServicesDir)),
            error: (msg) => errorMsgs.push('error: ' + removePathPrefix(msg, fakeServicesDir)),
        },
    }).Matcher;
    const cdResults = {
        general: {
            path: pathUtil.resolve(fakeServicesDir, './general/'),
        },
        noImplicitResponseFile: {
            path: pathUtil.resolve(fakeServicesDir, './on-implicit-response-file/'),
        },
        noMap: {
            path: pathUtil.resolve(fakeServicesDir, './no-map/'),
        },
        empty: {
            path: pathUtil.resolve(fakeServicesDir, './empty/'),
        },
    };
    const reqs = {
        general: {
            method: 'POST',
            query: {
                string: 'str',
                prefix: 'pre2',
                number: 123,
            },
            params: {
                integer: 121423234,
                id: 'akdhadjhhoaf7y4hfoh',
            },
            body: {
                name: 'badeggg',
                nestObj: {
                    email: 'zhaoxuxujc@gmail.com',
                },
                arr: [
                    12,
                    {
                        country: 'china'
                    },
                ],
            },
        },
        arrBody: {
            method: 'POST',
            body: [
                'a', 'b', 'c',
                {
                    name: 'badeggg',
                },
            ]
        },
        mapFileLineOrder: {
            method: 'GET',
            query: {
                query: 'adfsd',
            },
        },
        pairChars: {
            method: 'OPTIONs',
            query: {
                name: '"badeggg"',
                ' has space in property': '  and in value ',
            },
            params: {
                hasSpace: 'has space',
                'has-minus': 'has-minus',
            },
        },
        nonMatch: {
            method: 'PATCH',
        },
        noPathParams: {
            method: 'POST',
            query: {
                name: 'badeggg',
            },
        },
        pathParamsNotMatch: {
            method: 'POST',
            params: {},
        },
        valueCanBeAnythingIfOnlyAppear: {
            method: 'POST',
            query: {
                valueCanBeAnythingIfOnlyAppear: ''
            },
        },
    };
    let matchArr = [];
    matchArr.push(new Matcher(cdResults.general, reqs.general).match());
    matchArr.push(new Matcher(cdResults.general, reqs.arrBody).match());
    delete reqs.arrBody.body[3].name;
    matchArr.push(new Matcher(cdResults.general, reqs.arrBody).match());
    matchArr.push(new Matcher(cdResults.general, reqs.mapFileLineOrder).match());
    matchArr.push(new Matcher(cdResults.general, reqs.pairChars).match());
    delete reqs.pairChars.query.name;
    matchArr.push(new Matcher(cdResults.general, reqs.pairChars).match());
    matchArr.push(new Matcher(cdResults.noMap, reqs.general).match());
    matchArr.push(new Matcher(cdResults.general, reqs.valueCanBeAnythingIfOnlyAppear).match());
    delete reqs.valueCanBeAnythingIfOnlyAppear.query.valueCanBeAnythingIfOnlyAppear;
    tap.equal(new Matcher(cdResults.noImplicitResponseFile, reqs.valueCanBeAnythingIfOnlyAppear).match(),
        null);
    matchArr.forEach(cfg => removeCfgPathPropertiesPrefix(cfg, fakeServicesDir));
    tap.matchSnapshot(matchArr, 'match result list');
    tap.matchSnapshot(infoMsgs, 'log infos');
    tap.matchSnapshot(warningMsgs, 'log warnings');
    tap.matchSnapshot(errorMsgs, 'log errors');

    tap.equal(new Matcher(cdResults.empty, reqs.general).match(), null);
    tap.equal(new Matcher(cdResults.noImplicitResponseFile, reqs.nonMatch).match(), null);
    tap.equal(new Matcher(cdResults.noImplicitResponseFile, reqs.noPathParams).match(), null);
    tap.equal(new Matcher(cdResults.noImplicitResponseFile, reqs.pathParamsNotMatch).match(), null);
});

tap.test('match function', async tap => {
    const mapFileContent = `
    GET ./response
    `;
    let fakeServicesDir = tap.testdir({
        'fake-services': {
            'general': {
                map: mapFileContent,
                response: '{"test": "general"}',
            },
        },
    });
    fakeServicesDir = pathUtil.resolve(fakeServicesDir, './fake-services');
    const match = tap.mock('../../../src/middlewares/mapToRes/matchAResponse.js', {
        '../../../src/config': {
            fakeServicesBasePath: fakeServicesDir,
        },
    });
    const reqs = {
        general: {
            method: 'GET',
            path: '/general',
        },
        notExist: {
            method: 'GET',
            path: '/not-exist',
        },
    };
    tap.matchSnapshot(
        removeCfgPathPropertiesPrefix(match(reqs.general), fakeServicesDir),
        'match function result'
    );
    tap.equal(match(reqs.notExist), null);
});
