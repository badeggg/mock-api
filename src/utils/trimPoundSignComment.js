module.exports = function(str) {
    if (typeof str !== 'string') {
        throw new Error(`Argument 'str' should be type of string, got a ${typeof str} type.`);
    }
    const poundSignIndex = str.indexOf('#');
    if (poundSignIndex < 0) {
        return str;
    }
    return str.slice(0, poundSignIndex);
};
