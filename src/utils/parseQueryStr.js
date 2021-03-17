module.exports = function(str) {
    if (!str) return false;
    let ret = {};
    if (str[0] === '?' || str[0] === '_' || str[0] === '+')
        str = str.slice(1);
    str.split('&')
        .filter(one => one.length > 0)
        .map(one => one.split('='))
        .forEach(one => ret[one[0]] = one[1] || '');
    return ret;
};
