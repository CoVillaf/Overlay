export function ArrayBufferToRawString(arr) {
    // This is the "Buffer"-based solution.  It's commented out because
    // it's not as fast as the "chungus" solution below.
    // ----------------------------------------------------------------
    // let buffer = Buffer.from(arr);
    // let rawString = buffer.toString("binary");
    // ----------------------------------------------------------------

    // Behold the "chungus" solution (thanks to Adam13531 for his help
    // coming up with this).  It's uglier but performs better (roughly 8x-10x
    // faster) than the above "Buffer"-based solution.
    let rawString = "";
    const chunkSize = 2**15;
    let i = 0;
    while (i < arr.byteLength) {
        let chungus = Math.min(chunkSize, arr.byteLength - i);
        rawString += String.fromCharCode.apply(
            null,
            new Uint8Array(arr, i, chungus)
        );
        i += chunkSize;
    }
    return rawString;
}

export function RawStringToArrayBuffer(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
