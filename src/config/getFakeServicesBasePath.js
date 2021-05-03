const pathUtil = require('path');
const projectRoot = require('../utils/getProjectRoot.js')();

module.exports = function() {
    return pathUtil.resolve(projectRoot, './fake-services');
};
