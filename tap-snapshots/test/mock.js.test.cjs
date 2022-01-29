/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/mock.js TAP basic general function > log infos 1`] = `
Array [
  "info: Mock-api listening on: xxxx",
]
`

exports[`test/mock.js TAP basic general function > log warnings 1`] = `
Array [
  "warning: Invalid json file '/fake-services/fake-api-path/response'.",
]
`

exports[`test/mock.js TAP cover proxy error > log errors 1`] = `
Array [
  "error: Error: connect ECONNREFUSED 127.0.0.1:80",
]
`

exports[`test/mock.js TAP cover proxy error > must match snapshot 1`] = `
Failed to proxy 404. connect ECONNREFUSED 127.0.0.1:80
`

exports[`test/mock.js TAP error log on clear mockingLocation when quit > expect resolving Promise 1`] = `
error: Error on cleaning .mockingLocation file when quit. Error: ENOENT: no such file or directory, unlink '/.mockingLocation'
`

exports[`test/mock.js TAP general doubt cases as a whole > log errors 1`] = `
Array []
`

exports[`test/mock.js TAP general doubt cases as a whole > log infos 1`] = `
Array [
  "info: \\u001b[32mMock-api listening on: xxxx\\u001b[39m",
]
`

exports[`test/mock.js TAP general doubt cases as a whole > log warnings 1`] = `
Array []
`

exports[`test/mock.js TAP response js result as a whole > bad.js result 1`] = `
Failed to execute js script '/test/tap-testdir-mock-response-js-result-as-a-whole/fake-services/fake-api-path/bad.js'.
TypeError: Assignment to constant variable.
    at ...
    at ...
`

exports[`test/mock.js TAP response js result as a whole > function.js result 1`] = `

`

exports[`test/mock.js TAP response js result as a whole > js export array 1`] = `
Array [
  1,
  null,
  Object {
    "a": 56,
  },
]
`

exports[`test/mock.js TAP response js result as a whole > js export null 1`] = `
null
`

exports[`test/mock.js TAP response js result as a whole > js export number 1`] = `
1
`

exports[`test/mock.js TAP response js result as a whole > js export objHasFunc 1`] = `
Object {}
`

exports[`test/mock.js TAP response js result as a whole > js export object 1`] = `
Object {
  "a": 12,
}
`

exports[`test/mock.js TAP response js result as a whole > js export string 1`] = `
str
`

exports[`test/mock.js TAP response js result as a whole > js export symbol 1`] = `

`

exports[`test/mock.js TAP response js result as a whole > log errors 1`] = `
Array [
  String(
    error: Failed to execute js script '/test/tap-testdir-mock-response-js-result-as-a-whole/fake-services/fake-api-path/bad.js'.
    TypeError: Assignment to constant variable.
        at ...
        at ...
  ),
]
`

exports[`test/mock.js TAP response js result as a whole > log warnings 1`] = `
Array []
`

exports[`test/mock.js TAP response js result as a whole > ok.js result 1`] = `
Object {
  "a": 1,
  "name": "badeggg",
}
`

exports[`test/mock.js TAP try next plus one port when current port is not available > log infos 1`] = `
Array [
  "info: \\u001b[32mMock-api listening on: xxxx\\u001b[39m",
]
`
