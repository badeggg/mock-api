module.exports = (path, prefix) => {
    path = path.replace(new RegExp(prefix, 'g'), '');
    return path;
};
