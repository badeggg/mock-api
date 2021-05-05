const pathUtil = require('path');
const tap = require('tap');

const cwdBackup = process.cwd();

tap.test('find the project root', tap => {
    const projectRoot = tap.testdir({
        'package.json': 'package-json content',
        'node_modules': {
            'module1': '',
            'module2': '',
        },
        'sub-path': {
            'package.json': '',
            'node_modules': '',
            'sub-sub-path': {
                'node_modules': {},
            },
        },
    });
    const _cwd = pathUtil.resolve(projectRoot, './sub-path/sub-sub-path/node_modules');
    process.chdir(_cwd);
    const getProjectRoot = require('../../src/utils/getProjectRoot.js');
    tap.equal(getProjectRoot(), projectRoot);
    tap.end();
});

tap.test('do not has a project', tap => {
    process.chdir('/');
    const getProjectRoot = require('../../src/utils/getProjectRoot.js');
    tap.throws(getProjectRoot, {message: 'Failed to find project root.'});
    tap.end();
});

process.chdir(cwdBackup);
