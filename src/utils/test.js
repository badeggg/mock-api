const parseQueryStr = require('./parseQueryStr');

console.log(parseQueryStr('sdsd=12'));
console.log(parseQueryStr('sdsd=12&qq=99&2=0'));
console.log(parseQueryStr('sdsd=&=99&2=0&'));
console.log(parseQueryStr('_sdsd=&=99&2=0&'));
console.log(parseQueryStr('?sdsd=&=99&2=0&'));
