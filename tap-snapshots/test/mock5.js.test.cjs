/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/mock5.js TAP websocket general cases > ArrayBuffer response 1`] = `
Buffer <0000 0000 0000 0000 0000  ..........>
`

exports[`test/mock5.js TAP websocket general cases > JS-SCRIPT-ERROR detail 1`] = `
Failed to execute js script '/test/tap-testdir-mock5-websocket-general-cases/fake-services/badJs/ws-response.js'.
TypeError: Assignment to constant variable.
    at ...
    at ...
`

exports[`test/mock5.js TAP websocket general cases > buffer response escape revocer 1`] = `
Object {
  "data": Array [
    98,
    117,
    102,
    102,
    101,
    114,
  ],
  "type": "Buffer",
}
`

exports[`test/mock5.js TAP websocket general cases > isMetaBox 0 1`] = `
Buffer <6973 4d65 7461 426f 7820 7472 7565  isMetaBox.true>
`

exports[`test/mock5.js TAP websocket general cases > isMetaBox 1 1`] = `
Buffer <
  0000: 7b22 6973 4d65 7461 426f 7822 3a66 616c 7365 2c22 7265 7370 6f6e 7365 223a 2269  {"isMetaBox":false,"response":"i
  0020: 734d 6574 6142 6f78 2066 616c 7365 227d                                          sMetaBox.false"}
>
`

exports[`test/mock5.js TAP websocket general cases > isMetaBox 2 1`] = `
Buffer <
  0000: 7b22 6973 4d65 7461 426f 7822 3a30 2c22 7265 7370 6f6e 7365 223a 2269 734d 6574  {"isMetaBox":0,"response":"isMet
  0020: 6142 6f78 2030 227d                                                              aBox.0"}
>
`

exports[`test/mock5.js TAP websocket general cases > isMetaBox 3 1`] = `
Buffer <
  0000: 7b22 6973 4d65 7461 426f 7822 3a6e 756c 6c2c 2272 6573 706f 6e73 6522 3a22 6973  {"isMetaBox":null,"response":"is
  0020: 4d65 7461 426f 7820 6e75 6c6c 227d                                               MetaBox.null"}
>
`

exports[`test/mock5.js TAP websocket general cases > isMetaBox 4 1`] = `
Buffer <6973 4d65 7461 426f 7820 31  isMetaBox.1>
`

exports[`test/mock5.js TAP websocket general cases > log errors 1`] = `
Array [
  "error: Bad action property result 'senD' when trigger ./ws-response.js. Will use default action \\"SEND\\".",
  "error: Bad actionDelay time property result '1000ss' when trigger ./ws-response.js. Will not delay action.",
  String(
    error: Failed to execute js script '/test/tap-testdir-mock5-websocket-general-cases/fake-services/badJs/ws-response.js'.
    TypeError: Assignment to constant variable.
        at ...
        at ...
  ),
  "error: Invalid websocket close code number '999'. Will close with code 1000.",
]
`

exports[`test/mock5.js TAP websocket general cases > log infos 1`] = `
Array [
  "info: Mock-api listening on: 3070",
]
`

exports[`test/mock5.js TAP websocket general cases > log warnings 1`] = `
Array [
  "warning: Close reason message must not be greater than 123 bytes. Got reason '旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭旭1'. Will close with empty reason.",
  "warning: Ping data must not be greater than 125 bytes. Got data '\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000'. Will ping with empty data.",
  "warning: Pong data must not be greater than 125 bytes. Got data '\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000'. Will pong with empty data.",
]
`

exports[`test/mock5.js TAP websocket general cases > ping empty msg 0 1`] = `
Buffer <30  0>
`

exports[`test/mock5.js TAP websocket general cases > ping empty msg 1 1`] = `
Buffer <6e75 6c6c  null>
`

exports[`test/mock5.js TAP websocket general cases > ping empty msg 2 1`] = `
Buffer <>
`

exports[`test/mock5.js TAP websocket general cases > ping empty msg 3 1`] = `
Buffer <6661 6c73 65  false>
`

exports[`test/mock5.js TAP websocket general cases > ping empty msg 4 1`] = `
Buffer <>
`

exports[`test/mock5.js TAP websocket general cases > ping empty msg 5 1`] = `
Buffer <>
`

exports[`test/mock5.js TAP websocket general cases > ping empty msg 6 1`] = `
Buffer <>
`

exports[`test/mock5.js TAP websocket general cases > ping empty msg 7 1`] = `
Buffer <>
`

exports[`test/mock5.js TAP websocket general cases > pong empty msg 0 1`] = `
Buffer <30  0>
`

exports[`test/mock5.js TAP websocket general cases > pong empty msg 1 1`] = `
Buffer <6e75 6c6c  null>
`

exports[`test/mock5.js TAP websocket general cases > pong empty msg 2 1`] = `
Buffer <>
`

exports[`test/mock5.js TAP websocket general cases > pong empty msg 3 1`] = `
Buffer <6661 6c73 65  false>
`

exports[`test/mock5.js TAP websocket general cases > pong empty msg 4 1`] = `
Buffer <>
`

exports[`test/mock5.js TAP websocket general cases > pong empty msg 5 1`] = `
Buffer <>
`

exports[`test/mock5.js TAP websocket general cases > pong empty msg 6 1`] = `
Buffer <>
`

exports[`test/mock5.js TAP websocket general cases > pong empty msg 7 1`] = `
Buffer <>
`

exports[`test/mock5.js TAP websocket general cases > triggerInfo 1`] = `
Array [
  Object {
    "_stringOrBuffer": "String",
    "currentMessage": null,
    "lineageArg": null,
    "params": Object {
      "triggerInfo": "triggerInfo",
    },
    "query": Object {
      "name": "xuxu",
    },
    "request": Object {
      "complete": true,
      "headers": Object {
        "connection": "Upgrade",
        "host": "localhost:3070",
        "sec-websocket-extensions": "permessage-deflate; client_max_window_bits",
        "sec-websocket-version": "13",
        "upgrade": "websocket",
      },
      "httpVersion": "1.1",
      "method": "GET",
      "rawHeaders": Array [
        "Sec-WebSocket-Version",
        "13",
        "Connection",
        "Upgrade",
        "Upgrade",
        "websocket",
        "Sec-WebSocket-Extensions",
        "permessage-deflate; client_max_window_bits",
        "Host",
        "localhost:3070",
      ],
      "rawTrailers": Array [],
      "trailers": Object {},
      "url": "/triggerInfo?name=xuxu",
    },
    "triggerName": "WS-OPEN",
  },
  Object {
    "_stringOrBuffer": "String",
    "currentMessage": "1",
    "currentMessageIsBinary": false,
    "lineageArg": null,
    "params": Object {
      "triggerInfo": "triggerInfo",
    },
    "query": Object {
      "name": "xuxu",
    },
    "request": Object {
      "complete": true,
      "headers": Object {
        "connection": "Upgrade",
        "host": "localhost:3070",
        "sec-websocket-extensions": "permessage-deflate; client_max_window_bits",
        "sec-websocket-version": "13",
        "upgrade": "websocket",
      },
      "httpVersion": "1.1",
      "method": "GET",
      "rawHeaders": Array [
        "Sec-WebSocket-Version",
        "13",
        "Connection",
        "Upgrade",
        "Upgrade",
        "websocket",
        "Sec-WebSocket-Extensions",
        "permessage-deflate; client_max_window_bits",
        "Host",
        "localhost:3070",
      ],
      "rawTrailers": Array [],
      "trailers": Object {},
      "url": "/triggerInfo?name=xuxu",
    },
    "triggerName": "WS-MESSAGE",
  },
  Object {
    "_stringOrBuffer": "Buffer",
    "currentMessage": Object {
      "data": Array [
        98,
        97,
        100,
        101,
        103,
        103,
        103,
      ],
      "type": "Buffer",
    },
    "currentMessageIsBinary": true,
    "lineageArg": null,
    "params": Object {
      "triggerInfo": "triggerInfo",
    },
    "query": Object {
      "name": "xuxu",
    },
    "request": Object {
      "complete": true,
      "headers": Object {
        "connection": "Upgrade",
        "host": "localhost:3070",
        "sec-websocket-extensions": "permessage-deflate; client_max_window_bits",
        "sec-websocket-version": "13",
        "upgrade": "websocket",
      },
      "httpVersion": "1.1",
      "method": "GET",
      "rawHeaders": Array [
        "Sec-WebSocket-Version",
        "13",
        "Connection",
        "Upgrade",
        "Upgrade",
        "websocket",
        "Sec-WebSocket-Extensions",
        "permessage-deflate; client_max_window_bits",
        "Host",
        "localhost:3070",
      ],
      "rawTrailers": Array [],
      "trailers": Object {},
      "url": "/triggerInfo?name=xuxu",
    },
    "triggerName": "WS-MESSAGE",
  },
  Object {
    "_stringOrBuffer": "String",
    "currentMessage": "string",
    "currentMessageIsBinary": false,
    "lineageArg": null,
    "params": Object {
      "triggerInfo": "triggerInfo",
    },
    "query": Object {
      "name": "xuxu",
    },
    "request": Object {
      "complete": true,
      "headers": Object {
        "connection": "Upgrade",
        "host": "localhost:3070",
        "sec-websocket-extensions": "permessage-deflate; client_max_window_bits",
        "sec-websocket-version": "13",
        "upgrade": "websocket",
      },
      "httpVersion": "1.1",
      "method": "GET",
      "rawHeaders": Array [
        "Sec-WebSocket-Version",
        "13",
        "Connection",
        "Upgrade",
        "Upgrade",
        "websocket",
        "Sec-WebSocket-Extensions",
        "permessage-deflate; client_max_window_bits",
        "Host",
        "localhost:3070",
      ],
      "rawTrailers": Array [],
      "trailers": Object {},
      "url": "/triggerInfo?name=xuxu",
    },
    "triggerName": "WS-MESSAGE",
  },
]
`
