module.exports = function(str) {
    str = '' + str;
    let time;
    if (str.match(/^\d+(ms)?$/))
        time = parseInt(str);
    if (str.match(/^\d+(s)$/))
        time = parseInt(str) * 1000;
    if (str.match(/^\d+\.(s)$/))
        time = parseFloat(str) * 1000;
    if (str.match(/^\.\d+(s)$/))
        time = parseFloat(str) * 1000;
    if (str.match(/^\d+\.\d+(s)$/))
        time = parseFloat(str) * 1000;

    if (time || time === 0) {
        time = parseInt(time.toFixed());
        if (Number.isSafeInteger(time))
            return time;
    }

    return false;
};
