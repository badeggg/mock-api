need a review of this list
---- gleam ---- ✓ ✔ ✗ ✘ 🌠 ✵ ☆ ✦ ✧ ✭
- easy use
- should with reservation
- ✔ how to tell a response is from a fake service or the real server
- less overhead
  + e.g. no need to write shell?
  + ✘ plug into vue-cli-service? react-cli?
- add a script in package.json?
- edit README
  + how to use it is not complete.
- test
- show error message in developing
- implicit query match all
- try best to remove .mockingLocation file when stoped
- compliant with windows
- comment util
  + delete any '#' start line and text after '#'
- config-change-effect-immediately area as large as possible
  + e.g. proxy404
- proxy404 file should be parsed line-by-line
- multiple spaces should be regarded as a single space
- allow to response non-json
- response content-type
- want see mock-api error logs?
  + log file  fake-services/.log ? name by timestamp
- standalone usage
  + maybe a custom 'fake-services' folder name should be enabled
- some log may be useful
  + such as I want to know why mock is not working while I have
    write config files: log the off
- prepublishOnly
- lint some file in root
- validate response format?
- check homepage and git repo url on npm page
- language
- allow specify a port to test from
  + command and config file
- when required as a module, return mockingLocation
- config
    + require and run arguments
    + command line arguments
    + immutable config in fake-services folder
- every change need doc
- need change_log doc
- should has debug log, make log level configurable
- map file format
- proxy404 advance config?
- 🌠 websocket
    + interval auto response (multiple, cancelable)
    + match rule to a message response
    + close
    + every thing in ws-response.js?
      + return a promise
      + what arguments should be passed to js script
    + proxy, off the fake-services
- 🌠 mock anything of http
    + ✔ status code
    + ✔ delay
    + ✘ http2
    + ✘ certificate
- allow view help information by tap `mock help-map`
- docs
- examples
- think: how to test with different node versions
- file premission check
- better notice the warning/error map line config
- can we limit send rate when response a big file? this may help
  simulating big file download progress
- off only current
- review http method, CONNECT for example
- todo: able config to not console.log, this is useful when `npx mock | sleep 0.5 & node start.js`
- on (off)
- timeout shoule can be led to proxy404
- config file format should not use json, cause it's too annoying to comment out
  maybe the dedicated config format is fine
- edit github page: about, tags
- check header overriding of express and custom
- binary data of http
