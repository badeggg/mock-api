/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/mock.js TAP basic general function > log infos 1`] = `
Array [
  "info: \\u001b[32mMock-api listening on: xxxx\\u001b[39m",
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
    at module.exports (/test/tap-testdir-mock-response-js-result-as-a-whole/fake-services/fake-api-path/bad.js:4:27)
    at ResponseFile.generateJsResCfg (/src/middlewares/mapToRes/matchAResponse.js:130:27)
    at ResponseFile.generateResCfg (/src/middlewares/mapToRes/matchAResponse.js:74:25)
    at RuleParser.parse (/src/middlewares/mapToRes/matchAResponse.js:232:11)
    at Matcher.mapFileMatch (/src/middlewares/mapToRes/matchAResponse.js:370:71)
    at Matcher.match (/src/middlewares/mapToRes/matchAResponse.js:363:25)
    at matchAResponse (/src/middlewares/mapToRes/matchAResponse.js:493:44)
    at module.exports (/src/middlewares/mapToRes/index.js:63:17)
    at Layer.handle [as handle_request] (/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/node_modules/express/lib/router/index.js:317:13)
`

exports[`test/mock.js TAP response js result as a whole > function.js result 1`] = `
() => {console.log('foo')}
`

exports[`test/mock.js TAP response js result as a whole > log errors 1`] = `
Array [
  String(
    error: Failed to execute js script '/test/tap-testdir-mock-response-js-result-as-a-whole/fake-services/fake-api-path/bad.js'.
    TypeError: Assignment to constant variable.
        at module.exports (/test/tap-testdir-mock-response-js-result-as-a-whole/fake-services/fake-api-path/bad.js:4:27)
        at ResponseFile.generateJsResCfg (/src/middlewares/mapToRes/matchAResponse.js:130:27)
        at ResponseFile.generateResCfg (/src/middlewares/mapToRes/matchAResponse.js:74:25)
        at RuleParser.parse (/src/middlewares/mapToRes/matchAResponse.js:232:11)
        at Matcher.mapFileMatch (/src/middlewares/mapToRes/matchAResponse.js:370:71)
        at Matcher.match (/src/middlewares/mapToRes/matchAResponse.js:363:25)
        at matchAResponse (/src/middlewares/mapToRes/matchAResponse.js:493:44)
        at module.exports (/src/middlewares/mapToRes/index.js:63:17)
        at Layer.handle [as handle_request] (/node_modules/express/lib/router/layer.js:95:5)
        at trim_prefix (/node_modules/express/lib/router/index.js:317:13)
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
