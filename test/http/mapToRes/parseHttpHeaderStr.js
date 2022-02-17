const tap = require('tap');
const parseHttpHeaderStr = require('../../../src/http/mapToRes/parseHttpHeaderStr');

tap.equal(parseHttpHeaderStr(), false);
tap.same(parseHttpHeaderStr('some-header:value'), { 'some-header': 'value' });
tap.same(parseHttpHeaderStr('some-header: value'), { 'some-header': 'value' });
tap.same(parseHttpHeaderStr('some-header :value'), { 'some-header': 'value' });
tap.same(parseHttpHeaderStr('some-header : value'), { 'some-header': 'value' });
tap.same(parseHttpHeaderStr('some-header: space in value'), { 'some-header': 'space in value' });
tap.same(parseHttpHeaderStr('some-header: bad : value'), { 'some-header': 'bad' });
tap.same(parseHttpHeaderStr('  '), false);
