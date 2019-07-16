# mock-api

## Installation
```
$ npm install @badeggg/mock-api
```

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
    // continue with step 1
    $ cd fake-services
    $ mkdir -p mocking/api/path
    
    // to be continued ...
    ```
3. Create text file as response entity.
    ```
    // continue with step 2
    $ cd mocking/api/path
    $ echo 'data to response' > response
    
    // to be continued ...
    ```
4. Set mocking rules to map request to a file to response. [The map file](#The-map-file) is responsible for those mocking rules.
    ```
    // continue with step 3
    $ touch map
    $ vi map // edit this map file
    ```

### The map file
This file is optional. If this map file does not exist, './response' will
be sent to client by default.
Lines starting with '#' will be ignored. Four ordered fields indicate
response matches in current path. Four fields are:
```
    METHOD       : required
                   capital
                   e.g. GET, POST

    ?querys      : optional
                   starts with ?
                   urlencoded, braces to include a regular expression
                       to match value
                   e.g. ?qu1={.*}&qu2={.*}

    _pathParams  : optional
                   starts with _
                   urlencoded, braces to include a regular expression
                       to match value
                   e.g. _pa1={.*}&pa2={.*}

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
GET ./response
```

### Path parameters
Of course we can handle parameters in api path. 
Create a '\_\_parameter_name\_\_' folder in corresponding position on 'series of folders'.
This specific folder name should start and end with double underscore while parameter name
in the middle. Then in the map file, '_pathParams' will be '_parameter_name' and
the actual corresponding path section will be test with the regular expression specified
by _pathParams field. e.g.:
```
GET _parameter_name={.*} ./response
```

### Proxy 404
You may not want all the api requsts goes to mocking. 
When there is not a match rule for the api request -- we say 404, 'mock-api'
will proxy the request to the location specified by **/your/project/root/fake-services/proxy404**. e.g.:
```
$ echo 'https://nodejs.org' > /your/project/root/fake-services/proxy404
```
