const tap = require('tap');

tap.test('basic general match', tap => {
    const proxy404 = [
        [
            "nodejs",
            "https://nodejs.org/"
        ],
        [
            "bing",
            "https://cn.bing.com/"
        ],
        [
            "/api",
            "http://api-server/api"
        ],
        [
            "/req",
            "http://server/req"
        ],
        [
            ".*",
            "https://www.google.com/"
        ]
    ];
    const matchAProxy404 = tap.mock('../../../src/middlewares/mapToRes/matchAProxy404.js', {
        '../../../src/config/index.js': {
            getProxy404: () => proxy404,
        },
    });
    tap.equal(matchAProxy404({path: '/nodejs'}), 'https://nodejs.org/');
    tap.equal(matchAProxy404({path: '/bing'}), 'https://cn.bing.com/');
    tap.equal(matchAProxy404({path: '/bing/api'}), 'https://cn.bing.com/', 'should match the first rule');
    tap.equal(matchAProxy404({path: '/req'}), 'http://server/req');
    tap.equal(matchAProxy404({path: '/non-specific-match'}), 'https://www.google.com/');
    tap.end();
});

tap.test('null match', tap => {
    const proxy404 = [
        [
            "nodejs",
            "https://nodejs.org/"
        ],
    ];
    const matchAProxy404 = tap.mock('../../../src/middlewares/mapToRes/matchAProxy404.js', {
        '../../../src/config/index.js': {
            getProxy404: () => proxy404,
        },
    });
    tap.equal(matchAProxy404({path: '/foo'}), null);
    tap.end();
});
