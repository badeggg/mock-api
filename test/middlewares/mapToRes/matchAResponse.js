const fs = require('fs');
const tap = require('tap');
const _ = require('lodash');
const pathUtil = require('path');

tap.test('class ResponseFile', async tap => {
    const fakeServicesDir = tap.testdir({
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
    const basePath       = pathUtil.resolve(fakeServicesDir, './fake-services/fake-api-path/');
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
            error: (msg) => errorMsgs.push('error: ' + msg),
            warn: (msg) => warningMsgs.push('warning: ' + msg),
        },
    }).ResponseFile;

    tap.matchSnapshot(new ResponseFile(plainTextNoExt).generateResCfg(),
        'plain text without extension');
    tap.matchSnapshot(new ResponseFile(jsonNoExt).generateResCfg(),
        'json without extension');
    tap.matchSnapshot(new ResponseFile(json).generateResCfg(), 'json file');
    tap.matchSnapshot(new ResponseFile(invalidJson).generateResCfg(), 'invalid json file');
    tap.matchSnapshot(new ResponseFile(image).generateResCfg(), 'image file');
    tap.equal(new ResponseFile(bigFile).generateResCfg(), null);
    tap.matchSnapshot(new ResponseFile(bigJsonFile).generateResCfg(), 'big json file');
    tap.equal(new ResponseFile(notExistFile).generateResCfg(), null);
    tap.equal(new ResponseFile(isNotFile).generateResCfg(), null);
    tap.equal(new ResponseFile('').generateResCfg(), null);
    tap.equal(new ResponseFile(notExistFile).generateJsonResCfg(), null);
    tap.equal(new ResponseFile(notExistFile).generateExpressSendFileResCfg(), null);
    tap.matchSnapshot(errorMsgs, 'log errors');
    tap.matchSnapshot(warningMsgs, 'log warnings');
});
