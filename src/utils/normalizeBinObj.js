/**
 * Normalize binary type object (Buffer, ArrayBuffer, TypedArray, DataView) to 'Buffer' type.
 * If argument 'object' is not a binary type object, echo it back.
 *
 * @zhaoxuxu @2021-2-24 write
 * @zhaoxuxu @2022-2-24 update
 */

module.exports = (obj) => {
    if (obj instanceof Buffer)
        return obj;
    if (obj instanceof ArrayBuffer)
        return Buffer.from(obj);
    if (obj && obj.buffer instanceof ArrayBuffer)
        return Buffer.from(obj.buffer);
    return obj;
};
