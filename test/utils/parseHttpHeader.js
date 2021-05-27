const tap = require('tap');
const parseHttpHeader = require('../../src/utils/parseHttpHeader');

tap.equal(parseHttpHeader(), false);
tap.same(parseHttpHeader('some-header:value'), { 'some-header': 'value' });
tap.same(parseHttpHeader('some-header: value'), { 'some-header': 'value' });
tap.same(parseHttpHeader('some-header :value'), { 'some-header': 'value' });
tap.same(parseHttpHeader('some-header : value'), { 'some-header': 'value' });
tap.same(parseHttpHeader('some-header: space in value'), { 'some-header': 'space in value' });
tap.same(parseHttpHeader('some-header: bad : value'), { 'some-header': 'bad' });
tap.same(parseHttpHeader('  '), false);
