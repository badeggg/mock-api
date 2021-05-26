/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > big json file 1`] = `
Object {
  "resFilePath": "/Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/bigJsonFile",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
    "Mock-Not-Validated-Json-File": "/Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/bigJsonFile",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > image file 1`] = `
Object {
  "resFilePath": "/Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/image.png",
  "shouldUseExpressSendFile": true,
}
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > invalid json file 1`] = `
Object {
  "resFilePath": "/Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/invalid.json",
  "resHeaders": Object {
    "Mock-Warn-Invalid-Json-File": "/Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/invalid.json",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > json file 1`] = `
Object {
  "resFilePath": "/Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/json.json",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > json without extension 1`] = `
Object {
  "resFilePath": "/Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/jsonNoExt",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > log errors 1`] = `
Array [
  "error: Response file '/Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/bigFile' is too big, max acceptable size is 524288000, got 524288001.",
  "error: /Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/notExistFile does not exist or is not a file.",
  "error: /Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path does not exist or is not a file.",
  "error: Empty \\"filePath\\" arg for \\"ResponseFile\\" constructor.",
  "error: /Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/notExistFile does not exist or is not a file.",
  "error: /Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/notExistFile does not exist or is not a file.",
]
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > log warnings 1`] = `
Array [
  "warning: Invalid json file '/Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/plainTextNoExt'.",
  "warning: Invalid json file '/Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/invalid.json'.",
  "warning: Refused to validate response json file '/Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/bigJsonFile', cause it is too big, max acceptable size is 10485760,got 10485761.",
]
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > plain text without extension 1`] = `
Object {
  "resFilePath": "/Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/plainTextNoExt",
  "resHeaders": Object {
    "Mock-Warn-Invalid-Json-File": "/Users/zhaoxuxu/my_repos/mock-api/test/middlewares/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/plainTextNoExt",
  },
  "shouldUseExpressSendFile": true,
}
`
