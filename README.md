# mock-api
[![Version npm](https://img.shields.io/npm/v/@badeggg/mock-api.svg?logo=npm)](https://www.npmjs.com/package/@badeggg/mock-api)
[![CI test](https://github.com/badeggg/mock-api/actions/workflows/ci-test.yml/badge.svg)](https://github.com/badeggg/mock-api/actions)
[![Coverage Status](https://coveralls.io/repos/github/badeggg/mock-api/badge.svg?branch=master)](https://coveralls.io/github/badeggg/mock-api?branch=master)

A **least dependent**, **localized**, **with version control** and **effect immediately** http
/ websocket api mock tool for front-end project, nodejs back-end project, or even general
back-end project if you want.

## Table of Contents
- [mock-api](#mock-api)
- [Why this mock-api?](#Why-this-mock-api)
- [How is it working?](#How-is-it-working)
- [Installation](#Installation)
- [Usage](#Usage)
  + [Basic usage, configure a api to mock](#Basic-usage-configure-an-api-to-mock)
  + [Few simple examples](#Few-simple-examples)
  + [The map file](#The-map-file)
    + ['map' word](#map-word)
    + [http method](#http-method)
    + [options](#options)
      + [Match request by url query](#match-request-by-url-query)
      + [Match request by path params](#match-request-by-path-params)
      + [Match request by body arguments](#match-request-by-body-arguments)
      + [Set response headers](#set-response-headers)
      + [Set response code](#set-response-code)
      + [Match request method](#match-request-method)
      + [Set response file path](#set-response-file-path)
      + [Delay to respond](#delay-to-respond)
      + [Respond js result](#respond-js-result)
  + [Websocket](#Websocket)
  + [Proxy 404](#Proxy-404)
  + [Disable part of the mocking](#Disable-part-of-the-mocking)
  + [Config file common convention](#config-file-common-convention)
- [Tips or Troubleshooting](#Tips-or-Troubleshooting)
- [Await features...](#Await-features)

## Why _this_ mock-api?
- least dependent
  + least coordination with other developers in coding _all_ your project
  + the only information you need is the api defination: method, path, queries, reponse
    structure etc.
  + and of course you may mock any response as you want, such as an error response specifically
- localized
  + no bother to start and maintain a mock service on a virtual machine
  + start mocking just as you start your project development, e.g. `npm run serve` if your
    project is a vue-cli-serivce project
- with version control
  + all of the mock configuration stay with your project source code version control, so that
    after half year, for example, you still can use the mock configuration configured now.
- effect immediately
  + almost all config can take effect immediately, e.g.
    + a new mocking api path
    + a response file amending
    + and even the proxy404 file
- able to mock websocket

[Back To Top](#mock-api)

## How is it working?
The design is simple. 'mock-api' starts a service on local computer, respond to request
according to mock configuration. Mock configuration should be placed on `fake-services` folder
on project root directory.

'Mock-api' will create a file named `.mockingLocation` on project root to indicate the http
mocking location(replace string 'http' with 'ws' to get websocket mocking location).

'Mock-api' exports a function which returns a promise that will resolve the
mocking server. Mocking srever is an instance of
[http.Server](https://nodejs.org/dist/latest-v16.x/docs/api/http.html#class-httpserver).
`mockingServer.getHttpLocation()` to get http mocking location,
`mockingServer.getWsLocation()` to get websocket mocking location.

How to write a mock configuration is described below.

How to use .mockingLocation file properly is described below.

[Back To Top](#mock-api)

## Installation
```
$ npm install @badeggg/mock-api
```

[Back To Top](#mock-api)

## Usage
### Basic usage, configure an api to mock
1. Add fake-services folder on the root of your project.
    ```
    $ cd /your/project/root
    $ mkdir fake-services
    ```
2. Create series of folders relative to api path in fake-services.
   [Path parameters](#match-request-by-path-params) can be handled.
    ```
    $ cd fake-services
    $ mkdir -p mocking/api/path
    ```
3. Create text file as response entity.
    ```
    $ cd mocking/api/path
    $ echo 'data to response' > response
    ```
4. Now you can start the mock server to check what you just configured.
    ```
    # start by command
    $ npx mock
    >> Fri Oct 15 2021 17:32:31 GMT+0800 (China Standard Time) INFO  Mock-api listening on: 3000
    ```
    ```
    // or start by js
    const mock = require('@badeggg/mock-api');
    mock().then(server => {
        console.log('http mocking location: ', server.getHttpLocation()); // http mocking location:  http://localhost:3000
        console.log('websocket mocking location: ', server.getWsLocation()); // websocket mocking location:  ws://localhost:3000
        console.log('mocking on port: ', server.address().port); // mocking on port:  3000
    });
    ```
    ```
    # in another shell
    $ curl localhost:3000/mocking/api/path
    >> data to response
    ```

If your project is a nodejs back-end project, you may have figured out what else to do. Just
edit the scripts section in package.json to make sure mock server is started and api requests
are passed to mock server when developing the project.

If your project is general back-end project, a java project for example. You need install
nodejs npm and do the similar things as a nodejs project. Welcome to javascript world ;-)

I'll do a rather detailed description here for common front-end projects. In a common front-end
project, you need some coordination:

- Add a script in package.json, such that start the mock service first and then start the
  well-known webpack dev-server when run this script.
  + Of course the 'dev-server' part is dependent on your specific project.
  + For example, if your project is constructed with vue-cli-service,
    `"serve-mock": "mock | vue-cli-service serve",` should be added
- Modify the original development start script, so that .mockingLocation file is removed first and
  then start the well-known webpack dev-server when run this non-mocking start development script.
  + Of course the 'dev-server' part is dependent on your specific project.
  + For example, if your project is constructed with vue-cli-service, `"serve": "rm -f .mockingLocation && vue-cli-service serve",`
    should be the modified version script.
- Make sure the original dev-server api proxy is configured to mocking location when you are
  mocking.
  + For example, if your project is constructed with vue-cli-service, part of the vue.config.js
    should looks like:
    ```
    let MOCKING_LOCATION = null;
    let MOCKING_LOCATION_WS = null;
    if (fs.existsSync('./.mockingLocation')) {
        MOCKING_LOCATION = fs.readFileSync('./.mockingLocation', 'utf-8');
        MOCKING_LOCATION_WS = MOCKING_LOCATION.replace('http', 'ws');
    }

    module.exports = {
        devServer: {
            proxy: {
                '/api': MOCKING_LOCATION ? MOCKING_LOCATION : 'https://your.test.environment.com',
                '/websocket': {
                    target: MOCKING_LOCATION_WS ? MOCKING_LOCATION_WS : 'wss://your.test.environment.com',
                    ws: true
                },
            },
        },
    };
    ```

For http, to configure different response for different request on same api path, you will need
set [the map file](#the-map-file).

For websocket, you write a ws-response.js file in corresponding directory.
Check [websocket](#Websocket).

After proxy all api requests to mock server, you don't really need configure all of the
api mocking. Check [proxy 404 feature](#Proxy-404).

[Back To Top](#mock-api)

### Few simple examples
- Using in a common vue project: [mock-api-example-vue](https://github.com/badeggg/mock-api-example-vue)

[Back To Top](#mock-api)

### The map file
The map file is used to configure how to respond an **http** api request with current path.
We say 'current path' means the directory where the map file is in and the api request path
matchs.

The map file is optional. If this map file does not exist, contents in './response' will
be sent to client.  Lines starting with '#' will be ignored, any content after '#' will
also be ignored. Each line is a map rule, elements in map rule are space-separated.
Check [config file common convention](#config-file-common-convention). 'Mock-api' will
try to find a matching rule from the first line to the end line. A found matching rule
will block any further search. If no matching rule is found, the default response file
'./response' will be used. If './response' file does not exist, a 404 is triggered,
check [proxy 404](#Proxy-404).

Syntax of the map rule is: `[map word] [http method] [options]`. Here are few typical examples:
```
GET ./response # if the request method is GET, contents in ./response will be responsed
map -t 500 ./response # delay 500ms to response
```
#### 'map' word
'map' or 'MAP' appeared in the map rule start is trimmed. It is for good looking reason.

Case insensitive.

#### http method
Http method may be configured to match request. If configured, it must be the first item in
rule line(if 'map' word appears, http method must be the second item). If no method is
configured, any method is considered matching.

Case insensitive.

#### options

Option names (e.g. --url-queries --status-code) are case sensitive.

No url query option configured in a map rule line means any query content of the request is
ok with this map rule response. So with path parameter and body argument config and http
method.

<hr>

##### Match request by url query:

**?<queries...>, -q <queries...>, --url-queries <queries...>**<br>

Form of <queries...> is almost like url query form. It contains one or more '&' seperated
query config. Each query config has two parts and are connected by '='. The first part is
query name, the second part is query value. If the query value config is surrounded by '{}',
content between '{}' is regarded as a regular expression.

For example:
```
?name=badeggg&id={^\d+$}
-q name=badeggg
--url-queries name=badeggg
```

[Back To Top](#mock-api)

<hr>

##### Match request by path params:

**_<params...>, -p <params...>, --path-params <params...>**<br>

Form of <params...> is identical with form of <queries...>.

Unlike url queries, path params do not come with natural defination ---- after url path start
with '?' defines the url queries. To define path params, create a `__parameterName__` folder in
corresponding position on 'series of folders'.  This specific folder name should start and end
with double underscore while parameter name in the middle. Then in the map rule line in map
file, `_params` will be `_parameterName`. e.g: `fake-services/some/path/__id__` define a 'id'
path parameter in api, map rule line `map _id=123 ./response` in
`fake-services/some/path/__id__/map` will match a request with path `/some/path/123`.

For example:
```
_name=badeggg&id={^\d+$}
-p name=badeggg
--path-params name=badeggg
```

[Back To Top](#mock-api)

<hr>

##### Match request by body arguments:

**+<args...>, -a <args...>, --body-args <args...>**<br>

We can parse "application/json" and "application/x-www-form-urlencoded" type body of request
to do the matching.

Form of <args...> is a superset of <queries...>. Besides the basic form of <queries...>, body
args also support deep property chain match ---- that means if the parsed body of request is
a multiple level js object e.g `{data: {person: {name: 'badeggg'}}}`, the match rule line
`+data.person.name=badeggg` will match the request. Actually,the specified body argument 'key'
(`data.person.name` in the last example) is passed to js `eval()` properly to get value of
the 'key' to do the matching. So mixing array with object or pure array in parsed body of
request works fine.

For example:
```
+data.person.name=badeggg
-a id={^\d+$}
--body-args country=china
```

[Back To Top](#mock-api)

<hr>

##### Set response headers:

**-h <headers...>, --res-headers <headers...>**<br>

For example:
```
-h 'a-casual-header: a casual header' 'another-header: header value'
--res-headers 'content-type: image/jpeg'
```

To set multiple headers, either write one option name(-h) trailing with multiple header pairs
or write multiple times option name(-h) trailing with header pair.

[Back To Top](#mock-api)

<hr>

##### Set response code:

**-c \<code>, --status-code \<code>**<br>

For example:
```
-c 200
--status-code 404
```

[Back To Top](#mock-api)

<hr>

##### Match request method:

**-m \<method>, --req-method \<method>**<br>

In most cases, you do not need formally set request method option, since
the quick [http method](#http-method) is more convenient.

Option value is case insensitive and will override quick http method setting.

For example:
```
-m get
--req-method post
```

[Back To Top](#mock-api)

<hr>

##### Set response file path:

**-f \<file>, --res-file-path \<file>**<br>

Relative to directory of current map file or absolute path ----
although absolute path is not recommended, since we want 'fake-services' folder be tracked
by version control software like git.

Since response file setting is basic and frequent. We have some convenient way to set it.
- quick path setting
  + In a map rule line, an item is assumed to be a response-path-item if
    1) it is just after the last quick url-query(starts with ?) / body-args(starts with +)
      / path-params(starts with _) and starts with ./
    2) or it is the last item and starts with ./

    The condition-1-item found stop the finding of the condition-2-item.<br>
    Notice that quick path setting must start with ./ restrict it can't be an absolute path.
- implicit path
  + if the map file does not exist or non map rule line match the request,
    'fake-services/api/path/response' will be regarded as response file path
  + if a map rule line does not specify a file path, './response' will be regarded as
    response file path

If the specified file has '.json' extension **or has no extension**, file content will be
parsed and validated as json. If parse failed, a header
'Mock-Not-Validated-Json-File: {filePath}' will be set and responded. If the file is too big,
will refuse to parse and a header 'Mock-Not-Validated-Json-File: filePath' will be set and
responded. If parse succeeded or refused, a header
'Content-Type: application/json; charset=UTF-8' will be set and responded.

If the specified file has '.js' extension and --res-js-result option is set, file content
will be evaluated as js script. If the script export a function, function executing result
will be responded, else the script export will be responded. Check
[respond js result](#Respond-js-result) for details.

File content is always sent by [expressJs](https://expressjs.com/) sendFile except the
specified file has '.js' extension and --res-js-result option is set.

For example:
```
-f ./response.json
--res-file-path ./picture.jpg
```

[Back To Top](#mock-api)

<hr>

##### Delay to respond:

**-t \<time>, --delay-time \<time>**<br>

Time unit should be 'ms'(millisecond) or 's'(second). An empty unit
specifying means millisecond unit.

For example:
```
-t 500          # delay 500 milliseconds to respond
-t 500ms        # delay 500 milliseconds to respond
--delay-time 1s # delay 1 second to respond
```

[Back To Top](#mock-api)

<hr>

##### Respond js result:

**-r, --res-js-result**<br>

Whether evaluate the response js file and respond the result. The specifed response file path
must have '.js' extension and export a function, an object, an array or a js primitive value.

This feature is useful when you 1) need mock a big json response and are tired of json syntax
fixing line by line, e.g. ' --> "; 2) need some simple logic to generate response by request
info.

If the file exports a function, the function will be executed with argument 'request', function
returned value will be responded. The argument is a js object with request info:
```
{
  method: req.method, // request http method
  query: req.query,   // request url query
  params: req.params, // request path params
  body: req.body,     // request body
}
```

If the file does not export a function, the exported value will be responded.

Notice that, if this option is not set, file content will be responded no matter the file has
'.js' extension or not.

For example:
```
# map rule line
-r ./response-big-json.js
--res-js-result ./response-simple-logic.js

# in ./response-big-json.js
module.exports = {
  name: 'badeggg', // I am sick of json syntax fixing
  age: 18,
  // lots of fields
};

# in ./response-simple-logic.js
const echo = function(req) {
  return req;
};
module.exports = echo;
```

[Back To Top](#mock-api)

<hr>

### Proxy 404
You may not want to mock all of the api requests.  When there is not a response configuration
for the api request -- we say 404, which may caused by one of the following reasons:
1) the correspondinng path does not exist
2) the correspondinng path is [turned off](#Disable-part-of-the-mocking)
3) the map rules do not match for http
4) 'ws-response.js' does not exist for websocket

'Mock-api' will proxy the request to the location specified by
**/your/project/root/fake-services/proxy404**. e.g.:
```
$ echo 'https://nodejs.org' > /your/project/root/fake-services/proxy404
```
After the above command execution, all no-mocking-configuration requests will be proxied to
https://nodejs.org.

In some cases, a single proxy 404 rule can not satisfy your requirement. You may configure
multiple proxy 404 destinations in `proxy404` file.

In proxy404 file, lines starting with '#' will be ignored, any content after '#' will also be
ignored.  Each line is a proxy404 rule, elements in proxy404 rule are space-separated.
Check [config file common convention](#config-file-common-convention).

Syntax of the proxy 404 rule is: `[http | ws | HTTP | WS] [match regexp] destination`

If `[http | ws | HTTP | WS]` is not set in a rule, it is regarded as an http rule. If
`match regexp` is not set in a rule, the regular expression is implicitly set to `.*`, that
means any path. The destination is a rule must be a valid url(`new URL('destination')` is used
to validate).

Configuration lines are order sensitive. 'Mock-api' will try to find a matching rule from the
first line to the end line. A found matching rule will block any further search. If no
matching rule is found, 404 is then responded.

e.g.:
```
# Contents of /your/project/root/fake-services/proxy404.
#
# Configuration in this file will have the effect:
# 1) any no-mocking-configuration request whose path has 'baidu' text will be proxyed to https://baidu.com;
# 2) any no-mocking-configuration request whose path has 'bing' text will be proxyed to https://bing.com;
# 3) any no-mocking-configuration websocket request will be proxied to wss://demo.piesocket.com;

baidu https://baidu.com
bing https://bing.com
ws wss://demo.piesocket.com
```

[Back To Top](#mock-api)

### Websocket
todo

[Back To Top](#mock-api)

### Disable part of the mocking
In some cases you may want to temporarily disable part of the mocking ---- try only two
or three apis on test environment maybe while the other apis on test environment are not ok
yet for example. Create a file named 'off' or 'OFF' on some sub folder of fake-services, the
folders that containing 'off' file and all of the sub folders will be considered 404, therefore
the corresponding request will be proxied as 'proxy404' config. For example:
```
$ cd /your/project/root/fake-services/some/mock/path
$ touch off
```
After the above commands execution, any request whose path has prefix of `/some/mock/path`
will be considered as a non-mocking-match request and will be proxied as 'proxy404' file config.

Notice that an 'off' file in the very fake-services folder will disable all the mockings. This
is convenient when you want to use full real api services then use mocking services, back and
forth.

[Back To Top](#mock-api)

### Config file common convention
Most of the config files(the map file, the proxy404 file for instances) of mock-api have the
convention:
- the basic config unit is a line of text
- any content after #(pound sign) in a line is comment, which will be ignored
- a backslash in the last character of a line will cause the next
  line(if any) concated to current line.
- elements in a config unit(a line) is separated by one or more white
  space character(s), including space, tab, form feed, line feed,
  and other Unicode spaces
- 'pair chars' can help to set special characters in an item. Supported pair chars includes:
    + `' pair to self`
    + `" pair to self`
    + `( pair to )`

  e.g.:
  ```
  'should be together' should be separated
  'multiple   spaces in pair chars are reserved'
  'half pair char" in another pair chars' is "ignored
  ```

The elements in a config unit may have different meaning for different
config purpose.

[Back To Top](#mock-api)

## Tips or Troubleshooting
- **occasionally, npm script like `mock | node ./index.js` may not work, since
  `mock` is ready('.mockingLocation' file is set) before `node ./index.js` start
  executing is not guaranteed. One of the solutions is start mock-api in another
  terminal tab and then start your project.** Separate starting also let you view mock-api logs
  in mock-api terminal tab, which is beneficial for debugging proxy problems related to
  mock-api.
- a response header 'From-Mocking-Fake-Service' was added if the response is from mocking
- touch an 'off' file in the very fake-services filder to turn off all mocking and use full
  real api services, remove it to back using mock.
  Check [disable part of the mocking](#Disable-part-of-the-mocking)
- a very long config line can be seperated to multiple lines with a trailing backslash(\\)

[Back To Top](#mock-api)

## Await features...
- coordination with vue-cli-service
- coordination with create-react-app
- log file
- more configurable

[Back To Top](#mock-api)
