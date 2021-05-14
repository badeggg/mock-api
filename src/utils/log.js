function log_func(level) {
    console.log(new Date().toString(), level, ...[...arguments].slice(1));
}

const log = {};

log.critical = function() {
    log_func('CRITICAL', ...arguments);
};

log.error = function() {
    log_func('ERROR', ...arguments);
};

log.warn = function() {
    log_func('WARNING', ...arguments);
};

log.info = function() {
    log_func('INFO ', ...arguments);
};

log.debug = function() {
    log_func('DEBUG', ...arguments);
};

module.exports = log;
