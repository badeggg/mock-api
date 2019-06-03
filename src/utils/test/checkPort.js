const checkPort = require('../checkPort');

checkPort(3000)
    .then(
        () => console.log('resolve'),
        () => console.log('reject'),
    );
