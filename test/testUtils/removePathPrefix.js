module.exports = (path, prefix) => {
    /**
     * String.prototype.replaceAll compatible with nodejs v15+. We take v12+ in consideration.
     * @zhaoxuxu @2022-2-5
     */
    while (path.includes(prefix)) {
        path = path.replace(prefix, '');
    }
    return path;
};
