const tap = require('tap');
const normalizeBinObj = require('../../src/utils/normalizeBinObj.js');

tap.matchSnapshot(normalizeBinObj(Buffer.from('你好 hello')), 'buffer');

const uint16 = new Uint16Array(2);
uint16[0] = 42;
tap.matchSnapshot(normalizeBinObj(uint16), 'Uint16Array');
tap.matchSnapshot(normalizeBinObj(uint16.buffer), 'ArrayBuffer');
tap.matchSnapshot(normalizeBinObj(new DataView(uint16.buffer)), 'DataView');

tap.equal(normalizeBinObj(''), '');
tap.equal(normalizeBinObj('string'), 'string');
tap.equal(normalizeBinObj(), undefined);
tap.equal(normalizeBinObj(undefined), undefined);
tap.equal(normalizeBinObj(null), null);
tap.equal(normalizeBinObj(0), 0);
tap.equal(normalizeBinObj(1), 1);
tap.equal(normalizeBinObj(true), true);
tap.equal(normalizeBinObj(false), false);

const o = {};
tap.equal(normalizeBinObj(o), o);
const a = [];
tap.equal(normalizeBinObj(a), a);
