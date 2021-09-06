/**
 * Most of the config files of mock-api have the convention:
 *   - the basic config unit is a line of text
 *   - a backslash in the last character of a line will cause the next
 *     line(if any) concated to current line.
 *   - items in a config unit(a line) is separated by one or more white
 *     space character(s), including space, tab, form feed, line feed, 
 *     and other Unicode spaces
 *   - any content after #(pound sign) is comment, which will be ignored
 *
 * The items in a config unit may have different meaning for different
 * config purpose. 'semiParseConfigFile.js' will accept a config file
 * path and 'semi parse' it. Where 'semi parse' means it will only parse
 * the common convertion part, but the special config unit meaning.
 *
 * For example, a config file have the following text content:
 *   ######
 *   first line
 *   second line # some comment
 *   ######
 * will be parsed to a js array:
 *   ```
 *   [
 *      ['first', 'line'],
 *      ['second', 'line'],
 *   ]
 *   ```
 *
 * @zhaoxuxu @2021-5-3  created
 * @zhaoxuxu @2021-5-12 last modified
 */

const fs = require('fs');
const log = require('./log.js');
const trimPoundSignComment = require('./trimPoundSignComment.js');

const PAIR_CHARS = {
    '\'': '\'',
    '"': '"',
    '(': ')',
};

function lineSplit(line) {
    /**
     * Split a string line. A single(or multiple) space is a separator while
     * pair chars in consideration.
     * @zhaoxuxu 2021-5-27
     */
    let toMatch = null;
    let toJoin = [];
    let splited = [];
    for (let i = 0; i < line.length; i++) {
        const cha = line[i];
        if (toMatch) {
            if (PAIR_CHARS[toMatch] === cha) {
                join();
                toMatch = null;
            } else {
                toJoin.push(cha);
            }
        } else {
            if (/\s/.test(cha)) {
                join();
            } else if (Object.keys(PAIR_CHARS).includes(cha)) {
                toMatch = cha;
                join();
            } else {
                toJoin.push(cha);
            }
        }
    }
    join();
    function join() {
        if (toJoin.length) {
            splited.push(toJoin.join(''));
        }
        toJoin = [];
    }
    return splited;
}

module.exports = function(filePath) {
    if (!fs.existsSync(filePath)
        || !fs.statSync(filePath).isFile()
    ) {
        const msg = `${filePath} does not exist or is not a file.`;
        log.error(msg);
        throw new Error(msg);
    }

    let fileContent = '';
    try {
        fileContent = fs.readFileSync(filePath, 'utf-8');
    } catch(err) {
        log.error(err.message);
        log.error(`Failed to read file content of '${filePath}'.`);
        return null;
    }
    fileContent = fileContent.replace(/\\\n/g, ' ');
    fileContent = fileContent.replace(/\\\r\n/g, ' ');
    if (fileContent.length && fileContent[fileContent.length - 1] === '\\') {
        fileContent = fileContent.slice(0, -1);
    }
    let lines = fileContent.split('\n');
    lines = lines.map(trimPoundSignComment)
        .filter(line => Boolean(line.trim().length))
        .map(line => {
            const splited = lineSplit(line);
            return splited;
        });

    return lines;
};
