# mock-api
A **least dependent**, **localized** and **with version control** mock tool for front-end development.

## Table of Contents
- [mock-api](#mock-api)
- [Why this mock-api?](#Why-this-mock-api?)
- [How is it working?](#How-is-it-working?)
- [Installation](#Installation)
- [Usage](#Usage)
  + [Basic usage, configure a api to mock](#Basic-usage-configure-a-api-to-mock)
  + [The map file](#The-map-file)
  + [Url query](#Url-query)
  + [Path parameters](#Path-parameters)
  + [Body arguments](#Body-arguments)
  + [Proxy 404](#Proxy-404)
  + [Disable part of the mocking](#Disable-part-of-the-mocking)
- [Tips](#Tips)
- [Await features...](#Await-features)

## Why _this_ mock-api?
- least dependent
  + least coordination with back-end developers in coding _all_ your front-end logic and styles
  + the only information you need is the api defination: method, path, queries, reponse structure etc.
  + and of course you may mock any response as you want, such as an error response specifically
- localized
  + no bother to start and maintain a mock service on a virtual machine
  + start mocking just as you start your development project, e.g. `npm run serve` if your project is
    a vue-cli-serivce project
- with version control
  + all the mock configuration stay with your project source code version control, so that after half
    year, for example, you still can use the mock configuration configured now.

[Back To Top](#mock-api)

## How is it working?
The design is simple. 'mock-api' start a service on local computer, response to request according to
mock configuration. Mock configuration should be placed on `fake-services` folder on project root
directory. It will create a file named `.mockingLocation` on project root to indicate the mocking
location.

How to write a mock configuration is describe below.

How to use .mockingLocation file properly is describe below.

[Back To Top](#mock-api)

## Installation
```
$ npm install @badeggg/mock-api
```

[Back To Top](#mock-api)

## Usage
### Basic usage, configure a api to mock
1. Add fake-services folder on the root of your project.
    ```
    $ cd /your/project/root
    $ mkdir fake-services
    
    // to be continued ...
    ```
2. Create series of folders relative to api path in fake-services. [Path parameters](#Path-parameters) can be handled.
    ```
    // continued
    $ cd fake-services
    $ mkdir -p mocking/api/path
    
    // to be continued ...
    ```
3. Create text file as response entity.
    ```
    // continued
    $ cd mocking/api/path
    $ echo 'data to response' > response
    
    // to be continued ...
    ```
4. Set mocking rules to map request to a file to response. [The map file](#The-map-file) is responsible for those mocking rules.
    ```
    // continued
    $ touch map
    $ vi map // edit this map file
    ```
5. Some coordination on your project.
    - Add a script in package.json, such that start the mock service first and then start the well-known
      webpack dev-server when run this script.
      + Of course the 'dev-server' part is dependent on your specific project.
      + For example, if your project is constructed with vue-cli-service, `"serve-mock": "mock && vue-cli-service serve",`
        should be added
    - Modify the original development start script, so that .mockingLocation file is removed first and
      then start then well-known webpack dev-server when run this non-mocking start development script.
      + Of course the 'dev-server' part is dependent on your specific project.
      + For example, if your project is constructed with vue-cli-service, `"serve": "rm -f .mockingLocation && vue-cli-service serve",`
        should be the modified version script.
    - Make sure the original dev-server api proxy is configured to mocking location when you are mocking.
      + For example, if your project is constructed with vue-cli-service, part of the vue.config.js should looks
        like:
        ```
        let MOCKING_LOCATION = null;
        if (fs.existsSync('./.mockingLocation')) {
            MOCKING_LOCATION = fs.readFileSync('./.mockingLocation', 'utf-8');
        }

        module.exports = {
            devServer: {
                proxy: {
                    '/api': MOCKING_LOCATION ? MOCKING_LOCATION : 'https://your.test.environment.com',
                },
            },
        };
        ```

[Back To Top](#mock-api)

### The map file
This file is optional. If this map file does not exist, './response' will
be sent to client.
Lines starting with '#' will be ignored. Some ordered fields indicate
how to find the response in current path. Those fields are:
```
    METHOD       : required
                   capital
                   e.g. GET, POST

    ?queries     : optional
                   starts with ?
                   urlencoded, braces to include a regular expression
                       to match value
                   e.g. ?qu1={.*}&qu2={.*}

    _pathParams  : optional
                   starts with _
                   urlencoded, braces to include a regular expression
                       to match value
                   e.g. _pa1={.*}&pa2={.*}

    +bodyArgs    : optional
                   starts with +
                   urlencoded, braces to include a regular expression
                       to match value
                   e.g. +arg1={.*}&arg2={.*}

    responsePath : required
                   search response file by this field based on current
                       directory
                   always is the last field
                   e.g. ./response

```
These fields are divided by space(s), e.g:
```
GET ?qu1={.*}&qu2={.*} _pa1={.*}&pa2={.*} ./response
GET ?range={.*}&n={.*} _param1={.*} ./response
GET _param1={.*} ./response
GET ?range={.*}&n={.*} ./response
POST +username={xyz}&password={.*} ./response
GET ./response
```

[Back To Top](#mock-api)

### Url query
The url query will be tested with the regular expression specified
by `?queries` field in map file. e.g.:
```
GET ?range={.*}&n={.*} ./response
```
No url query field configured in a map rule means any query content of the request is ok with
this map rule response.

[Back To Top](#mock-api)

### Path parameters
Of course we can handle parameters in api path. 
Create a `__parameter_name__` folder in corresponding position on 'series of folders'.
This specific folder name should start and end with double underscore while parameter name
in the middle. Then in the map file, `_pathParams` will be `_parameter_name` and
the actual corresponding path section will be tested with the regular expression specified
by `_pathParams` field in map file. e.g.:
```
GET _parameter_name={.*} ./response
```
No path parameter field configured in a map rule means any path parameter of the request
is ok with this map rule response.

[Back To Top](#mock-api)

### Body arguments
For now, we only support `application/json` request 'Content-Type', and 10mb request max size.
The first level fields of the parsed json will be tested with the regular expression specified
by `_bodyArgs` field in map file. e.g.:
```
POST +username={xyz}&password={.*} ./response
```
No body argument field configured in a map rule means any body argument of the request
is ok with this map rule response.

[Back To Top](#mock-api)

### Proxy 404
You may not want all the api requsts goes to mocking. 
When there is not a match rule for the api request -- we say 404, 'mock-api'
will proxy the request to the location specified by **/your/project/root/fake-services/proxy404**. e.g.:
```
$ echo 'https://nodejs.org' > /your/project/root/fake-services/proxy404
```
After the above command execution, all non-mocking-match requests will be proxied to
https://nodejs.org.

In some cases, a single proxy 404 can not satisfy your requirement. You may configure multiple
proxy 404 destination like follows in `proxy404` file:
```
# Contents of /your/project/root/fake-services/proxy404.
#
# Some comment. Any line starts with '#' is regarded as a comment line.
# Single space separated config line. The first element is regarded as a regular expression
# to match the request path, the second element is the corresponding destination.
# If a config line has only one element, the regular expression to match is implicitly set
# to `.*`, that means any path, and the element is the destination.
# Configuration lines are order sensitive. Lines are parsed line-by-line.
#
# Configuration in this file will have the effect:
# 1) any non-mocking-match request whose path has 'baidu' text will be proxyed to https://baidu.com;
# 2) any non-mocking-match request whose path has 'bing' text will be proxyed to https://bing.com;
# 3) the rest non-mocking-match request will be proxied to https://bing.com;

baidu https://baidu.com
bing https://bing.com
https://nodejs.org
```

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

Notice that an 'off' file on the very fake-services folder will not disable all mocking for now.
Maybe this should be changed ;-).

[Back To Top](#mock-api)

## Tips
- a response header 'From-Mocking-Fake-Service' was added if the response is from mocking

[Back To Top](#mock-api)

## Await features...
- websocket
- single-space-separated feature will be a little bit tolerant, multiple spaces is also ok
  for example
- '# text' after config line will be regarded as comment
- proxy404 file change can take effect immediately
- a vue-cli-service plugin can ease the coordination config on your project
- support `application/x-www-form-urlencoded` and `multipart/form-data` request 'Content-Type'.
- ...

[Back To Top](#mock-api)
