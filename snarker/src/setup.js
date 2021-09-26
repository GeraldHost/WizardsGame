const fs = require("fs");
const { initialize } = require("zokrates-js/node");
const { Proof } = require("./proof");

async function main() {
  const zok = await initialize();
  const proof = new Proof(zok, "commit");
  proof.setup();
  proof.exportContract();
}

if (require.main === module) {
  main();
}
