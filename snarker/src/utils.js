exports.bufferToUint8Array = function (buffer) {
  return new Uint8Array(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT
  );
};
