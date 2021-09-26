const { initialize } = require("zokrates-js/node");

async function main() {
  const zok = await initialize();

  const source = `
    import "hashes/keccak/256bit" as keccak

    def swap_u64(u64 val) -> u64:
        val = ((val << 8) & 0xFF00FF00FF00FF00) | ((val >> 8) & 0x00FF00FF00FF00FF)
        val = ((val << 16) & 0xFFFF0000FFFF0000) | ((val >> 16) & 0x0000FFFF0000FFFF)
        return (val << 32) | (val >> 32)

    def main() -> u64[4]:
        u64[12] inputs = [0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3]
        
        // swap endianness
        for u32 i in 0..12 do
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

  const artifacts = zok.compile(source);

  const { witness, output } = zok.computeWitness(artifacts, []);

  console.log(witness);

  console.log(output);

  const keypair = zok.setup(artifacts.program);

  const proof = zok.generateProof(artifacts.program, witness, keypair.pk);  

  console.log(proof);
}

if (require.main === module) {
  main();
}
