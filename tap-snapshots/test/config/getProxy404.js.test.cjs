/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/config/getProxy404.js TAP find proxy404 file, parse it and return result > log errors 1`] = `
Array [
  "error: Bad proxy 404 target 'nodejs.org'.",
  "error: TypeError [ERR_INVALID_URL]: Invalid URL: nodejs.org",
]
`

exports[`test/config/getProxy404.js TAP find proxy404 file, parse it and return result > parsed proxy404 result 1`] = `
[
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
]
`
