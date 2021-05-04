function log_func(level) {
    console.log(new Date(), level, ...[...arguments].slice(1));
}

const log = {};

log.error = function() {
    log_func('ERROR', ...arguments);
};

log.info = function() {
    log_func('INFO ', ...arguments);
};

log.debug = function() {
    log_func('DEBUG', ...arguments);
};

module.exports = log;
