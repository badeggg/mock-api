module.exports = function(str) {
    if (typeof str !== 'string') {
        throw new Error(`Argument 'str' should be type of string, got a ${typeof str} type.`);
    }
    const poundSignIndex = str.search(/(?<!\\)#/); // \# (escaped pound) in consideration
    if (poundSignIndex >= 0) {
        return str.slice(0, poundSignIndex);
    }
    return str.replace(/\\#/g, '#');
};
