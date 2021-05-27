/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > big json file 1`] = `
Object {
  "resFilePath": "/fake-services/fake-api-path/bigJsonFile",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
    "Mock-Not-Validated-Json-File": "/fake-services/fake-api-path/bigJsonFile",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > image file 1`] = `
Object {
  "resFilePath": "/fake-services/fake-api-path/image.png",
  "shouldUseExpressSendFile": true,
}
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > invalid json file 1`] = `
Object {
  "resFilePath": "/fake-services/fake-api-path/invalid.json",
  "resHeaders": Object {
    "Mock-Warn-Invalid-Json-File": "/fake-services/fake-api-path/invalid.json",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > json file 1`] = `
Object {
  "resFilePath": "/fake-services/fake-api-path/json.json",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > json without extension 1`] = `
Object {
  "resFilePath": "/fake-services/fake-api-path/jsonNoExt",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > log errors 1`] = `
Array [
  "error: Response file '/fake-services/fake-api-path/bigFile' is too big, max acceptable size is 524288000, got 524288001.",
  "error: /fake-services/fake-api-path/notExistFile does not exist or is not a file.",
  "error: /fake-services/fake-api-path does not exist or is not a file.",
  "error: Empty \\"filePath\\" arg for \\"ResponseFile\\" constructor.",
  "error: /fake-services/fake-api-path/notExistFile does not exist or is not a file.",
  "error: /fake-services/fake-api-path/notExistFile does not exist or is not a file.",
]
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > log warnings 1`] = `
Array [
  "warning: Invalid json file '/fake-services/fake-api-path/plainTextNoExt'.",
  "warning: Invalid json file '/fake-services/fake-api-path/invalid.json'.",
  "warning: Refused to validate response json file '/fake-services/fake-api-path/bigJsonFile', cause it is too big, max acceptable size is 10485760,got 10485761.",
]
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class ResponseFile > plain text without extension 1`] = `
Object {
  "resFilePath": "/fake-services/fake-api-path/plainTextNoExt",
  "resHeaders": Object {
    "Mock-Warn-Invalid-Json-File": "/fake-services/fake-api-path/plainTextNoExt",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class RuleParser > log errors 1`] = `
Array [
  "error: Bad status code config 'x22' in map '/fake-services/fake-api-path/map'.",
  "error: Bad status code config '600' in map '/fake-services/fake-api-path/map'.",
  "error: Bad status code config '1000' in map '/fake-services/fake-api-path/map'.",
  "error: Bad request method config 'BAD' in map '/fake-services/fake-api-path/map'.",
  "error: Bad response-file config './not-exist' in map '/fake-services/fake-api-path/map', file '/fake-services/fake-api-path/not-exist' does not exist or is not a file.",
  "error: Bad response-file config './not-exist' in map '/fake-services/fake-api-path/map', file '/fake-services/fake-api-path/not-exist' does not exist or is not a file.",
  "error: Bad deplay time config '9007199254740992' in map '/fake-services/fake-api-path/map'.",
  "error: Bad config in map '/fake-services/fake-api-path/map', error: option '-t, --delay-time    <time>' argument missing.",
  "error: Bad deplay time config 'null' in map '/fake-services/fake-api-path/map'.",
  "error: Bad config in map '/fake-services/fake-api-path/map', error: option '-f, --res-file-path <file>' argument missing.",
  "error: Bad deplay time config '-c' in map '/fake-services/fake-api-path/map'.",
  "error: Bad config in map '/fake-services/fake-api-path/map', error: option '-q, --url-queries   <queries...>' argument missing.",
  "error: Bad config in map '/fake-services/fake-api-path/map', error: unknown option '-o'.",
  "error: Bad config in map '/fake-services/fake-api-path/map', error: unknown option '--only-this'.",
]
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class RuleParser > log warnings 1`] = `
Array []
`

exports[`test/middlewares/mapToRes/matchAResponse.js TAP class RuleParser > parsed rule lines 1`] = `
Array [
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-services/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-services/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {
      "arg1.a.b": "value",
    },
    "pathParams": Object {
      "param1": "value",
    },
    "reqMethod": "PUT",
    "resFilePath": "/fake-services/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "query1": "value",
      "query2": "{.*}",
    },
  },
  Object {
    "bodyArgs": Object {
      "arg": "12",
    },
    "delayTime": 400,
    "pathParams": Object {
      "param": "value",
    },
    "reqMethod": "POST",
    "resFilePath": "/fake-services/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "query1": "12",
    },
  },
  Object {
    "bodyArgs": Object {
      "arg": "val",
    },
    "delayTime": 1000,
    "pathParams": Object {
      "params": "val",
    },
    "reqMethod": "GET",
    "resFilePath": "/fake-services/fake-api-path/response",
    "resHeaders": Object {
      "a-http-header": "header value",
      "Content-Type": "application/json; charset=UTF-8",
    },
    "shouldUseExpressSendFile": true,
    "statusCode": 200,
    "urlQueries": Object {
      "query": "val",
      "query1": "val1",
    },
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "statusCode": 200,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "statusCode": 404,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "HEAD",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "POST",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "PUT",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "DELETE",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "CONNECT",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "OPTIONS",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "TRACE",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "PATCH",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-services/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {
      "query": "val",
    },
  },
  Object {
    "bodyArgs": Object {},
    "delayTime": 1000,
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "delayTime": 1000,
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "delayTime": 1000,
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "delayTime": 0,
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "delayTime": 0,
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  null,
  Object {
    "bodyArgs": Object {},
    "delayTime": 0,
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {
      "query": "use-this-query-value",
    },
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "POST",
    "resHeaders": Object {},
    "urlQueries": Object {
      "query": "value",
    },
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {
      "query": "value",
      "query1": "cd",
      "query2": "22",
    },
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {
      "param": "90",
    },
    "reqMethod": "GET",
    "resFilePath": "/fake-services/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "query": "3",
    },
  },
  null,
  Object {
    "bodyArgs": Object {},
    "delayTime": 0,
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resHeaders": Object {},
    "urlQueries": Object {
      "-c": "",
      "300": "",
    },
  },
  null,
  null,
  null,
]
`
