const tap = require('tap');
const parseTimeStr = require('../../src/utils/parseTimeStr.js');

tap.equal(parseTimeStr(1000), 1000);
tap.equal(parseTimeStr(0), 0);
tap.equal(parseTimeStr('1000'), 1000);
tap.equal(parseTimeStr('1000ms'), 1000);
tap.equal(parseTimeStr('10s'), 10000);
tap.equal(parseTimeStr('1.s'), 1000);
tap.equal(parseTimeStr('.5s'), 500);
tap.equal(parseTimeStr('1.5s'), 1500);
tap.equal(parseTimeStr('1.5123s'), 1512);
tap.equal(parseTimeStr(Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER);
tap.equal(parseTimeStr('1000mm'), false);
tap.equal(parseTimeStr('1000ss'), false);
tap.equal(parseTimeStr(Number.MAX_SAFE_INTEGER + 1), false);
