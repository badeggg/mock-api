/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/mock6.js TAP websocket proxy 404 > NO-FAKE-SERVIVES-FOLDER message 1`] = `
'fake-services' folder does not exist in your project.
'/fake-services' does not exist.

`

exports[`test/mock6.js TAP websocket proxy 404 > NO-WS-PROXY-404-MATCH-FOUND message 1`] = `
No ws proxy 404 match found.<br>
You need a proper proxy404 file in fake-services folder.<br>
Refer https://github.com/badeggg/mock-api#proxy-404
`

exports[`test/mock6.js TAP websocket proxy 404 > log errors 1`] = `
Array [
  String(
    error: 'fake-services' folder does not exist in your project.
    '/test/tap-testdir-mock6-websocket-proxy-404/fake-services' does not exist.
    
  ),
  String(
    error: Error: No ws proxy 404 match found.<br>
    You need a proper proxy404 file in fake-services folder.<br>
    Refer https://github.com/badeggg/mock-api#proxy-404
  ),
  "error: Websocket proxy error: Error: getaddrinfo ENOTFOUND demopiesocket.com",
]
`

exports[`test/mock6.js TAP websocket proxy 404 > log infos 1`] = `
Array [
  "info: Mock-api listening on: 3081",
  "info: No 'ws-response.js' file in corresponding directory '/v3/channel_1'.",
  "info: No 'ws-response.js' file in corresponding directory '/v3/channel_1'.",
  "info: No 'ws-response.js' file in corresponding directory '/v3/channel_1'.",
]
`

exports[`test/mock6.js TAP websocket proxy 404 > log warnings 1`] = `
Array []
`

exports[`test/mock6.js TAP websocket self trigger cases > log errors 1`] = `
Array [
  "error: Bad self triggerDelay time property '33ss' when trigger ./ws-response.js. Will not delay self triggering.",
  "error: Bad selfTrigger property result '\\"1\\"' when trigger ./ws-response.js Refer doc for details.",
  "error: Bad selfTrigger property result '1' when trigger ./ws-response.js Refer doc for details.",
  "error: Bad selfTrigger property result '[1]' when trigger ./ws-response.js Refer doc for details.",
]
`

exports[`test/mock6.js TAP websocket self trigger cases > log infos 1`] = `
Array [
  "info: Mock-api listening on: 3080",
]
`

exports[`test/mock6.js TAP websocket self trigger cases > log warnings 1`] = `
Array []
`

exports[`test/mock6.js TAP websocket self trigger cases > self trigger received a Buffer response 1`] = `
Object {
  "lineageArg": Object {
    "data": Array [
      21,
      31,
    ],
    "type": "Buffer",
  },
  "lineageArgIsBuffer": true,
}
`

exports[`test/mock6.js TAP websocket self trigger cases > self trigger received a non-recovered Buffer obj response 1`] = `
Object {
  "lineageArg": Object {
    "data": Array [
      98,
      117,
      102,
      102,
      101,
      114,
    ],
    "type": "Buffer",
  },
  "lineageArgIsBuffer": false,
}
`
