module.exports = function(str) {
    if (!str) return false;
    str = str.replace(/\s+/g, '');
    if (!str) return false;

    let ret = {};
    const splited = str.split(':');
    ret[splited[0]] = splited[1];

    return ret;
};
