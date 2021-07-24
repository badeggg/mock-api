module.exports = (str) => {
    const reg = /^(\s+at).+$/gm;
    if (str.replaceAll)
        str = str.replaceAll(reg, '$1 ...');
    else
        str = str.replace(reg, '$1 ...');
    return str;
};
