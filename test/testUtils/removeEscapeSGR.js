/**
 * Refer https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters
 *
 * @zhaoxuxu @2022-1-29  created
 * @zhaoxuxu @2021-1-29 last modified
 */

module.exports = (str) => {
    // eslint-disable-next-line no-control-regex
    const reg = /\x1b\[(\d+)?(;\d+)*m/g;
    str = str.replace(reg, '');
    return str;
};
