const fs = require('fs');
const pathUtil = require('path');
const getProjectRoot = require('../utils/getProjectRoot.js');

module.exports = function() {
    return pathUtil.resolve(projectRoot(), './fake-services');
};
