/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/utils/semiParseConfigFile.js TAP backslash is the last character of the file > semi parse result 1`] = `
[
    [
        "backslash",
        "is",
        "the",
        "last",
        "character",
        "of",
        "the",
        "file"
    ]
]
`

exports[`test/utils/semiParseConfigFile.js TAP normal parse function > semi parse result 1`] = `
[
    [
        "basic",
        "general",
        "config"
    ],
    [
        "multiple",
        "spaces"
    ],
    [
        "tab",
        "as",
        "a",
        "white",
        "space"
    ],
    [
        "one",
        "config",
        "line",
        "writen",
        "in",
        "multiple",
        "lines"
    ]
]
`

exports[`test/utils/semiParseConfigFile.js TAP pair chars > semi parse result 1`] = `
[
    [
        "should be together",
        "should",
        "be",
        "separated"
    ],
    [
        "should be together",
        "should",
        "be",
        "separated"
    ],
    [
        "should be together",
        "should",
        "be",
        "separated"
    ],
    [
        "multiple   spaces in pair chars are reserved"
    ],
    [
        "minus-char in or out",
        "should",
        "be-fine"
    ],
    [
        "should be together (although has) other pair chars",
        "should",
        "be",
        "separated"
    ],
    [
        "should be together \\"although has\\" other pair chars",
        "should",
        "be",
        "separated"
    ],
    [
        "half pair char\\" in another pair chars",
        "is",
        "ignored"
    ],
    [
        "cross line"
    ],
    [
        "pair",
        "chars",
        "is",
        "not",
        "effective"
    ],
    [
        "cross line with backslash     pair chars is ok"
    ],
    [
        "  ",
        "spaces",
        "in",
        "pair",
        "chars"
    ],
    [
        "empty",
        "in",
        "pair",
        "chars"
    ],
    [
        "pair",
        "start",
        "has",
        "separator",
        "effection",
        "hello there "
    ]
]
`
