const tap = require('tap');
const parseQueryStr = require('../../../src/http/mapToRes/parseQueryStr');

tap.equal(parseQueryStr(), false);
tap.same(parseQueryStr('sdsd=12'), { sdsd: '12' });
tap.same(parseQueryStr('sdsd=12&qq=99&2=0'), { '2': '0', sdsd: '12', qq: '99' });
tap.same(parseQueryStr('sdsd=&=99&2=0&'), { '2': '0', sdsd: '', '': '99' });
tap.same(parseQueryStr('_sdsd=&=99&2=0&'), { '2': '0', sdsd: '', '': '99' });
tap.same(parseQueryStr('?sdsd=&=99&2=0&'), { '2': '0', sdsd: '', '': '99' });
tap.same(parseQueryStr('+sdsd=&=99&2=0&'), { '2': '0', sdsd: '', '': '99' });
