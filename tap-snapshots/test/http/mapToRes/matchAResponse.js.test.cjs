/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/http/mapToRes/matchAResponse.js TAP class Matcher > log errors 1`] = `
Array [
  "error: Bad response-file config './response' in map '/on-implicit-response-file/map', file '/on-implicit-response-file/response' does not exist or is not a file.",
  "error: No explicit resFilePath config in ruleLine  in map file /on-implicit-response-file/map, and no fine implicit response file.",
  "error: Bad response-file config './response' in map '/on-implicit-response-file/map', file '/on-implicit-response-file/response' does not exist or is not a file.",
  "error: No explicit resFilePath config in ruleLine  in map file /on-implicit-response-file/map, and no fine implicit response file.",
  "error: No explicit resFilePath config in ruleLine  in map file /on-implicit-response-file/map, and no fine implicit response file.",
  "error: No explicit resFilePath config in ruleLine  in map file /on-implicit-response-file/map, and no fine implicit response file.",
  "error: No explicit resFilePath config in ruleLine  in map file /on-implicit-response-file/map, and no fine implicit response file.",
  "error: No explicit resFilePath config in ruleLine  in map file /on-implicit-response-file/map, and no fine implicit response file.",
  "error: No explicit resFilePath config in ruleLine  in map file /on-implicit-response-file/map, and no fine implicit response file.",
  "error: Bad response-file config './pair-chars-res' in map '/on-implicit-response-file/map', file '/on-implicit-response-file/pair-chars-res' does not exist or is not a file.",
  "error: No explicit resFilePath config in ruleLine -q name=\\"badeggg\\" in map file /on-implicit-response-file/map, and no fine implicit response file.",
  "error: Bad response-file config './pair-chars-res' in map '/on-implicit-response-file/map', file '/on-implicit-response-file/pair-chars-res' does not exist or is not a file.",
  "error: No explicit resFilePath config in ruleLine -p hasSpace=has space -q  has space in property=  and in value  in map file /on-implicit-response-file/map, and no fine implicit response file.",
]
`

exports[`test/http/mapToRes/matchAResponse.js TAP class Matcher > log infos 1`] = `
Array [
  "info: Failed to eval request body with body args key 'typo.email' configured in map '/general/map'.",
  "info: Failed to eval request body with body args key 'typo.email' configured in map '/general/map'.",
]
`

exports[`test/http/mapToRes/matchAResponse.js TAP class Matcher > log warnings 1`] = `
Array []
`

exports[`test/http/mapToRes/matchAResponse.js TAP class Matcher > match result list 1`] = `
Array [
  Object {
    "bodyArgs": Object {
      ".name": "badeggg",
      "arr[1].country": "china",
      "nestObj.email": "{^zhaoxuxu\\\\w\\\\w@\\\\w+\\\\.com$}",
    },
    "pathParams": Object {
      "id": "{\\\\w+}",
      "integer": "{\\\\d+}",
    },
    "reqMethod": "POST",
    "resFilePath": "/general/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "number": "{\\\\d+}",
      "prefix": "{pre\\\\d}",
      "string": "str",
    },
  },
  Object {
    "bodyArgs": Object {
      "[3].name": "{bade}",
    },
    "pathParams": Object {},
    "resFilePath": "/general/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {
      "[0]": "a",
    },
    "pathParams": Object {},
    "resFilePath": "/general/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/general/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "query": "",
    },
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "OPTIONS",
    "resFilePath": "/general/pair-chars-res",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "name": "\\"badeggg\\"",
    },
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {
      "hasSpace": "has space",
    },
    "reqMethod": "OPTIONS",
    "resFilePath": "/general/pair-chars-res",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      " has space in property": "  and in value ",
    },
  },
  Object {
    "resFilePath": "/no-map/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "shouldUseExpressSendFile": true,
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "POST",
    "resFilePath": "/general/specifiedResponse",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "valueCanBeAnythingIfOnlyAppear": "",
    },
  },
]
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > big json file 1`] = `
Object {
  "resFilePath": "/fake-api-path/bigJsonFile",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
    "Mock-Not-Validated-Json-File": "/fake-api-path/bigJsonFile",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > empty js file 1`] = `
Object {
  "resBody": "{}",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > image file 1`] = `
Object {
  "resFilePath": "/fake-api-path/image.png",
  "shouldUseExpressSendFile": true,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > invalid json file 1`] = `
Object {
  "resFilePath": "/fake-api-path/invalid.json",
  "resHeaders": Object {
    "Mock-Warn-Invalid-Json-File": "/fake-api-path/invalid.json",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > js export a false metabox object 1`] = `
Object {
  "resBody": "{\\"isMetaBox\\":false,\\"responseShouldEscapeBufferRecover\\":true,\\"response\\":{\\"type\\":\\"Buffer\\",\\"data\\":[1,2,3]}}",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > js export a metabox object 1`] = `
Object {
  "resBody": "{\\"type\\":\\"Buffer\\",\\"data\\":[1,2,3]}",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > js export a metabox object with a buffer object 1`] = `
Object {
  "resBody": Buffer <0102 03  ...>,
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > js export a metabox object with false responseShouldEscapeBufferRecover 1`] = `
Object {
  "resBody": Buffer <0102 03  ...>,
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > js export a metabox object with modified buffer object 1`] = `
Object {
  "resBody": "{\\"type\\":\\"Buffer\\",\\"data\\":89}",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > js export a metabox object with stringify object 1`] = `
Object {
  "resBody": "{\\"type\\":\\"Buffer\\",\\"data\\":[1,2,3]}",
  "resHeaders": Object {
    "Content-Type": "text/plain; charset=UTF-8",
  },
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > js export buffer 1`] = `
Object {
  "resBody": Buffer <6865 6c6c 6f  hello>,
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > js export buffer1, non ascii 1`] = `
Object {
  "resBody": Buffer <6865 6c6c 6f20 e4bd a0e5 a5bd 20f0 9f91 8b  hello............>,
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > js export object 1`] = `
Object {
  "resBody": "{\\"name\\":\\"小明\\"}",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > js export undefined 1`] = `
Object {
  "resBody": undefined,
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > json file 1`] = `
Object {
  "resFilePath": "/fake-api-path/json.json",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > json without extension 1`] = `
Object {
  "resFilePath": "/fake-api-path/jsonNoExt",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > log errors 1`] = `
Array [
  "error: Response file '/test/http/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/bigFile' is too big, max acceptable size is 524288000, got 524288001.",
  String(
    error: Failed to execute js script '/test/http/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/bad.js'.
    TypeError: Assignment to constant variable.
        at ...
        at ...
  ),
  "error: /test/http/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/notExistFile does not exist or is not a file.",
  "error: /test/http/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path does not exist or is not a file.",
  "error: Empty \\"filePath\\" arg for \\"ResponseFile\\" constructor.",
  "error: /test/http/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/notExistFile does not exist or is not a file.",
  "error: /test/http/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/notExistFile does not exist or is not a file.",
  "error: /test/http/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/notExistFile does not exist or is not a file.",
]
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > log warnings 1`] = `
Array [
  "warning: Invalid json file '/fake-api-path/plainTextNoExt'.",
  "warning: Invalid json file '/fake-api-path/invalid.json'.",
  "warning: Refused to validate response json file '/fake-api-path/bigJsonFile', cause it is too big, max acceptable size is 10485760, got 10485761.",
  "warning: Refused to execute response js file '/fake-api-path/big.js', cause it is too big, max acceptable size is 10485760, got 10485761.",
]
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > plain text without extension 1`] = `
Object {
  "resFilePath": "/fake-api-path/plainTextNoExt",
  "resHeaders": Object {
    "Mock-Warn-Invalid-Json-File": "/fake-api-path/plainTextNoExt",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > return js result 1`] = `
Object {
  "resBody": "{\\"query\\":{\\"a\\":1},\\"a\\":1}",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > return js result but js file is too big 1`] = `
Object {
  "resFilePath": "/fake-api-path/big.js",
  "resHeaders": Object {
    "Mock-Big-Js-File-Self": "/fake-api-path/big.js",
  },
  "shouldUseExpressSendFile": true,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > return js result but js is not valid 1`] = `
Object {
  "resBody": String(
    Failed to execute js script '/test/http/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/bad.js'.
    TypeError: Assignment to constant variable.
        at ...
        at ...
  ),
  "resHeaders": Object {
    "Mock-Error-Invalid-Js-File": "/test/http/mapToRes/tap-testdir-matchAResponse-class-ResponseFile/fake-services/fake-api-path/bad.js",
  },
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > return js result correctly even after js file changed 1`] = `
Object {
  "resBody": "12",
  "resHeaders": Object {
    "Content-Type": "text/plain; charset=UTF-8",
  },
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > return js result empty 1`] = `
Object {
  "resBody": "null",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > return js result primitive 1`] = `
Object {
  "resBody": "string",
  "resHeaders": Object {
    "Content-Type": "text/plain; charset=UTF-8",
  },
  "shouldUseExpressSendFile": false,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > return js result with empty request argument 1`] = `
Object {
  "resFilePath": "/fake-api-path/ok.js",
  "shouldUseExpressSendFile": true,
}
`

exports[`test/http/mapToRes/matchAResponse.js TAP class ResponseFile > stdouts 1`] = `
Array [
  "stdouts: debug:  <Buffer 01 02 03>\\n",
  "stdouts: timeout log\\n",
]
`

exports[`test/http/mapToRes/matchAResponse.js TAP class RuleParser > log errors 1`] = `
Array [
  "error: Bad status code config 'x22' in map '/fake-api-path/map'.",
  "error: Bad status code config '600' in map '/fake-api-path/map'.",
  "error: Bad status code config '1000' in map '/fake-api-path/map'.",
  "error: Bad request method config 'BAD' in map '/fake-api-path/map'.",
  "error: Bad response-file config './not-exist' in map '/fake-api-path/map', file '/fake-api-path/not-exist' does not exist or is not a file.",
  "error: Bad response-file config './not-exist' in map '/fake-api-path/map', file '/fake-api-path/not-exist' does not exist or is not a file.",
  "error: Bad delay time config '9007199254740992' in map '/fake-api-path/map'.",
  "error: Bad config in map '/fake-api-path/map', error: option '-t, --delay-time    <time>' argument missing.",
  "error: Bad delay time config 'null' in map '/fake-api-path/map'.",
  "error: Bad delay time config '-c' in map '/fake-api-path/map'.",
  "error: Bad config in map '/fake-api-path/map', error: option '-q, --url-queries   <queries...>' argument missing.",
  "error: Bad config in map '/fake-api-path/map', error: unknown option '-o'.",
  "error: Bad config in map '/fake-api-path/map', error: unknown option '--only-this'.",
]
`

exports[`test/http/mapToRes/matchAResponse.js TAP class RuleParser > log warnings 1`] = `
Array []
`

exports[`test/http/mapToRes/matchAResponse.js TAP class RuleParser > parsed rule lines 1`] = `
Array [
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
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
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
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
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "query1": "12",
    },
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "prefix": "{pre\\\\d+}",
      "reg": "{^\\\\w+$}",
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
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "a-http-header": "header value",
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": true,
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
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "statusCode": 200,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "statusCode": 404,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "HEAD",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "POST",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "PUT",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "DELETE",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "CONNECT",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "OPTIONS",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "TRACE",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "PATCH",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "query": "val",
    },
  },
  Object {
    "bodyArgs": Object {},
    "delayTime": 1000,
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "delayTime": 1000,
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "delayTime": 1000,
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "delayTime": 0,
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "delayTime": 0,
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  null,
  Object {
    "bodyArgs": Object {},
    "delayTime": 0,
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "resBody": "123",
    "resFilePath": "/fake-api-path/ok.js",
    "resHeaders": Object {
      "Content-Type": "text/plain; charset=UTF-8",
    },
    "resJsResult": true,
    "shouldUseExpressSendFile": false,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": true,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "resFilePath": "/fake-api-path/ok.js",
    "resHeaders": Object {},
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": true,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "query": "use-this-query-value",
    },
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "POST",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "query": "value",
    },
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
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
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "query": "3",
    },
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response_cfg_is_last_item1",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response_cfg_is_last_item2",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response_cfg_is_last_item3",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "resFilePath": "/fake-api-path/response_cfg_is_last_item4",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "delayTime": 0,
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "-c": "",
      "300": "",
    },
  },
  null,
  null,
  null,
  Object {
    "bodyArgs": Object {},
    "delayTime": 100,
    "pathParams": Object {},
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {},
  },
  Object {
    "bodyArgs": Object {},
    "pathParams": Object {},
    "reqMethod": "GET",
    "resFilePath": "/fake-api-path/response",
    "resHeaders": Object {
      "Content-Type": "application/json; charset=UTF-8",
    },
    "resJsResult": false,
    "shouldUseExpressSendFile": true,
    "urlQueries": Object {
      "query": "",
    },
  },
]
`

exports[`test/http/mapToRes/matchAResponse.js TAP match function > match function result 1`] = `
Object {
  "bodyArgs": Object {},
  "pathParams": Object {},
  "reqMethod": "GET",
  "resFilePath": "/general/response",
  "resHeaders": Object {
    "Content-Type": "application/json; charset=UTF-8",
  },
  "resJsResult": false,
  "shouldUseExpressSendFile": true,
  "urlQueries": Object {},
}
`
