module.exports = (path, prefix) => {
    if (path.replaceAll)
        path = path.replaceAll(prefix, '');
    else
        path = path.replace(new RegExp(prefix, 'g'), '');
    return path;
};
