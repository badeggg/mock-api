module.exports = (path) => {
    /**
     * String.prototype.replaceAll compatible with nodejs v15+. We take v12+ in consideration.
     * @zhaoxuxu @2022-2-5
     */
    while (path.includes('\\')) {
        path = path.replace('\\', '/');
    }
    return path;
};
