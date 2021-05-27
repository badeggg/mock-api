const tap = require('tap');
const trimPoundSignComment = require('../../src/utils/trimPoundSignComment.js');

tap.throws(() => trimPoundSignComment(123), 'a non-string type should throw');
tap.matchSnapshot(trimPoundSignComment('some config in a line #'), 'line content');
tap.matchSnapshot(trimPoundSignComment('some config in a line # some comment'), 'line content');
tap.equal(trimPoundSignComment('# some comment'), '');
tap.equal(trimPoundSignComment('#  '), '');
tap.equal(trimPoundSignComment(''), '');
tap.matchSnapshot(trimPoundSignComment('some config \\# escaped pound sign'), 'escaped pound');
tap.matchSnapshot(trimPoundSignComment('note backslash self need escaping in js string \# comment'), 'not escaped pound');
