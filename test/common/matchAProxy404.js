const tap = require('tap');

tap.test('basic general match', tap => {
    const proxy404 = [
        [
            false,
            'nodejs',
            'https://nodejs.org/'
        ],
        [
            false,
            'bing',
            'https://cn.bing.com/'
        ],
        [
            false,
            '/api',
            'http://api-server/api'
        ],
        [
            false,
            '/req',
            'http://server/req'
        ],
        [
            false,
            '.*',
            'https://www.google.com/'
        ],
        [
            true,
            '/ws',
            'wss://www.ws.com/'
        ],
    ];
    const matchAProxy404 = tap.mock('../../src/common/matchAProxy404.js', {
        '../../src/config/index.js': {
            getProxy404: () => proxy404,
        },
    });
    tap.equal(matchAProxy404({path: '/nodejs'}), 'https://nodejs.org/');
    tap.equal(matchAProxy404({path: '/bing'}), 'https://cn.bing.com/');
    tap.equal(matchAProxy404({path: '/bing/api'}), 'https://cn.bing.com/', 'should match the first rule');
    tap.equal(matchAProxy404({path: '/req'}), 'http://server/req');
    tap.equal(matchAProxy404({path: '/no-specific-match'}), 'https://www.google.com/');
    tap.equal(matchAProxy404({path: '/no-specific-match', isWebsocket: 0}), 'https://www.google.com/');
    tap.equal(matchAProxy404({path: '/ws', isWebsocket: true}), 'wss://www.ws.com/');
    tap.end();
});

tap.test('null match', tap => {
    const proxy404 = [
        [
            false,
            'nodejs',
            'https://nodejs.org/'
        ],
    ];
    const matchAProxy404 = tap.mock('../../src/common/matchAProxy404.js', {
        '../../src/config/index.js': {
            getProxy404: () => proxy404,
        },
    });
    tap.equal(matchAProxy404({path: '/foo'}), null);
    tap.end();
});
