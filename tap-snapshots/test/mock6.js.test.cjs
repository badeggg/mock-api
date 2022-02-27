/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/mock6.js TAP websocket self trigger cases > log errors 1`] = `
Array []
`

exports[`test/mock6.js TAP websocket self trigger cases > log infos 1`] = `
Array [
  "info: Mock-api listening on: 3070",
]
`

exports[`test/mock6.js TAP websocket self trigger cases > log warnings 1`] = `
Array [
  "error: Bad self triggerDelay time property '33ss' when trigger ./ws-response.js. Will not delay self triggering.",
  "error: Bad selfTrigger property result '1' when trigger ./ws-response.js Refer doc for details.",
]
`

exports[`test/mock6.js TAP websocket self trigger cases > self trigger received a Buffer response 1`] = `
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
