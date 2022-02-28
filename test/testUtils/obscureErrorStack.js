module.exports = (str) => {
    str = str.replace(/((\s+at).+\r?\n?\r?)+/, '\n$2 ...\n$2 ...');
    return str;
};
