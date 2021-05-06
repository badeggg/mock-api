/**
 * Most of the config files of mock-api have the convention:
 *   - the basic config unit is a line of text
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
 * @zhaoxuxu @2021-5-3
 */

const fs = require('fs');
const log = require('./log.js');
const trimPoundSignComment = require('./trimPoundSignComment.js');

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
    let lines = fileContent.split('\n');
    lines = lines.map(trimPoundSignComment)
        .filter(line => Boolean(line.trim().length))
        .map(line => {
            line = line.replace(/\s+/g, ' ');
            const parsedLine = line.split(' ')
                .filter(item => Boolean(item.length));
            return parsedLine;
        });

    return lines;
};
