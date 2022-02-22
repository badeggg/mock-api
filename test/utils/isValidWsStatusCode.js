const tap = require('tap');
const isValidWsStatusCode = require('../../src/utils/isValidWsStatusCode.js');

tap.equal(isValidWsStatusCode(0), false);
tap.equal(isValidWsStatusCode(1), false);
tap.equal(isValidWsStatusCode(999), false);

tap.equal(isValidWsStatusCode(1001), true);
tap.equal(isValidWsStatusCode(1002), true);
tap.equal(isValidWsStatusCode(1003), true);
tap.equal(isValidWsStatusCode(1004), false);
tap.equal(isValidWsStatusCode(1005), false);
tap.equal(isValidWsStatusCode(1006), false);
tap.equal(isValidWsStatusCode(1007), true);
tap.equal(isValidWsStatusCode(1008), true);
tap.equal(isValidWsStatusCode(1009), true);
tap.equal(isValidWsStatusCode(1010), true);
tap.equal(isValidWsStatusCode(1011), true);
tap.equal(isValidWsStatusCode(1012), true);
tap.equal(isValidWsStatusCode(1013), true);
tap.equal(isValidWsStatusCode(1014), true);
tap.equal(isValidWsStatusCode(1015), false);
tap.equal(isValidWsStatusCode(1016), false);
tap.equal(isValidWsStatusCode(1017), false);

tap.equal(isValidWsStatusCode(2345), false);
tap.equal(isValidWsStatusCode(2999), false);

tap.equal(isValidWsStatusCode(3000), true);
tap.equal(isValidWsStatusCode(3456), true);
tap.equal(isValidWsStatusCode(4000), true);
tap.equal(isValidWsStatusCode(4567), true);
tap.equal(isValidWsStatusCode(4999), true);

tap.equal(isValidWsStatusCode(5000), false);
tap.equal(isValidWsStatusCode(5678), false);
