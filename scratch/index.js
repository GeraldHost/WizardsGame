const { initialize } = require("zokrates-js/node");

const source = `
import "hashes/keccak/256bit" as keccak

// hash: 0xe90b7bceb6e7df5418fb78d8ee546e97c83a08bbccc01a0644d599ccd2a7c2e0

def swap_u64(u64 val) -> u64:
    val = ((val << 8) & 0xFF00FF00FF00FF00) | ((val >> 8) & 0x00FF00FF00FF00FF)
    val = ((val << 16) & 0xFFFF0000FFFF0000) | ((val >> 16) & 0x0000FFFF0000FFFF)
    return (val << 32) | (val >> 32)

def main(u64[8] inputs) -> u64[4]: 

    // swap endianness
    for u32 i in 0..8 do
        inputs[i] = swap_u64(inputs[i])
    endfor

    // hash
    u64[4] digest = keccak(inputs)

    // swap endianness
    for u32 i in 0..4 do
        digest[i] = swap_u64(digest[i])
    endfor

    return digest
`;

initialize().then((zokratesProvider) => {
  // compilation
  const artifacts = zokratesProvider.compile(source);

  // computation
  const { witness, output } = zokratesProvider.computeWitness(artifacts, [
    ["0", "0", "0", "1", "0", "0", "0", "2"],
  ]);
  console.log(witness, output);
});
