const tap = require('tap');
const toNiceJson = require('../../testUtils/toNiceJson.js');
const removePathPrefix = require('../../testUtils/removePathPrefix.js');
const transWindowsPath = require('../../testUtils/transWindowsPath.js');
const pathUtil = require('path');

function removeCdResultPathPrefix(result, prefix) {
    result.path = transWindowsPath(
        removePathPrefix(result.path, prefix)
    );
    return result;
}

tap.test('basic normal cd function', tap => {
    const fakeServicesBasePath = tap.testdir({
        path: {
            to: {
                resource: {
                    response: '',
                },
                hiddenResource: {
                    off: '',
                },
            },
            __name__: {
                __email__: {},
            },
        },
    });
    const cd = tap.mock('../../../src/middlewares/mapToRes/cd.js', {
        '../../../src/config': {
            fakeServicesBasePath,
        },
    });
    tap.matchSnapshot(toNiceJson(removeCdResultPathPrefix(cd('/path/to/resource'),                 fakeServicesBasePath)), 'basic cd');
    tap.matchSnapshot(toNiceJson(removeCdResultPathPrefix(cd('/path/to/resource/'),                fakeServicesBasePath)), 'should trim prefix and postfix /');
    tap.matchSnapshot(toNiceJson(removeCdResultPathPrefix(cd('path/badeggg/zhaoxuxujc@gmail.com'), fakeServicesBasePath)), 'path parameters');
    tap.matchSnapshot(toNiceJson(removeCdResultPathPrefix(cd('/'),                                 fakeServicesBasePath)), 'root service path');
    tap.equal(cd('/not/exist/path'), false);
    tap.equal(cd('/path/to/hiddenResource'), false, 'off one fake service');
    tap.end();
});

tap.test('off all fake services', tap => {
    const fakeServicesBasePath = tap.testdir({
        OFF: '',
        path: {
            to: {
                resource: {
                    response: '',
                },
            },
        },
    });
    const cd = tap.mock('../../../src/middlewares/mapToRes/cd.js', {
        '../../../src/config': {
            fakeServicesBasePath,
        },
    });
    tap.equal(cd('/path/to/resource'), false);
    tap.end();
});

tap.test('off a fake service and sub fake services', tap => {
    const fakeServicesBasePath = tap.testdir({
        path: {
            to: {
                off: '',
                resource: {
                    response: '',
                },
            },
        },
    });
    const cd = tap.mock('../../../src/middlewares/mapToRes/cd.js', {
        '../../../src/config': {
            fakeServicesBasePath,
        },
    });
    tap.equal(cd('/path/to'), false, 'off a fake service');
    tap.equal(cd('/path/to/resource'), false, 'sub fake services is off by the ancestor "off"');
    tap.end();
});

tap.test('non-conventional path parameter', tap => {
    const fakeServicesBasePath = tap.testdir({
        path: {
            _name: {
                _email: {},
            },
        },
    });
    const cd = tap.mock('../../../src/middlewares/mapToRes/cd.js', {
        '../../../src/config': {
            fakeServicesBasePath,
        },
    });
    tap.equal(cd('/path/badeggg/zhaoxuxujc@gmail'), false);
    tap.end();
});

tap.test('no fake servives folder', tap => {
    const projectRoot = tap.testdir({});
    const fakeServicesBasePath = pathUtil.resolve(projectRoot, 'fake-services');
    const cd = tap.mock('../../../src/middlewares/mapToRes/cd.js', {
        '../../../src/config': {
            fakeServicesBasePath,
        },
    });
    tap.throws(
        () => {
            try {
                cd('/');
            } catch (e) {
                e.message = transWindowsPath(
                    removePathPrefix(e.message, projectRoot)
                );
                throw e;
            }
        },
        {
            name: 'NO-FAKE-SERVIVES-FOLDER',
            message: '\'fake-services\' folder does not exist in your project.\n'
                + '\'/fake-services\' does not exist.\n',
        },
    );
    tap.end();
});
