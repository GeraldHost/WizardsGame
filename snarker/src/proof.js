const fs = require("fs");
const path = require("path");
const { bufferToUint8Array } = require("./utils");

const PROGRAMS_DIR = path.resolve(`${__dirname}/../programs`);
const DATA_DIR = path.resolve(`${__dirname}/../data`);

class Proof {
  constructor(zok, name) {
    this.zok = zok;
    this.name = name;

    this.sourcePath = `${PROGRAMS_DIR}/${this.name}.zok`;

    this.dataDir = `${DATA_DIR}/${this.name}`;
    this.programPath = `${this.dataDir}/program`;
    this.abiPath = `${this.dataDir}/abi.json`;
    this.keyPairVkPath = `${this.dataDir}/vk.json`;
    this.keyPairPkPath = `${this.dataDir}/pk.dat`;
    this.contractPath = `${this.dataDir}/Verifier.sol`;
  }

  get source() {
    const contents = fs.readFileSync(this.sourcePath);
    return contents.toString();
  }

  get artifacts() {
    const programBuffer = fs.readFileSync(this.programPath);
    const abiBuffer = fs.readFileSync(this.abiPath);

    return {
      program: bufferToUint8Array(programBuffer),
      abi: abiBuffer.toString(),
    };
  }

  get keypair() {
    const vkString = fs.readFileSync(this.keyPairVkPath);
    const vk = JSON.parse(vkString.toString());
    const pkBuffer = fs.readFileSync(this.keyPairPkPath);

    return {
      vk,
      pk: bufferToUint8Array(pkBuffer),
    };
  }

  compile() {
    return this.zok.compile(this.source);
  }

  setup() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir);
    }

    // check if program and abi already exist
    if (!(fs.existsSync(this.programPath) && fs.existsSync(this.abiPath))) {
      const artifacts = this.compile();
      fs.writeFileSync(this.programPath, artifacts.program);
      fs.writeFileSync(this.abiPath, artifacts.abi);
    }

    if (
      !(fs.existsSync(this.keyPairVkPath) && fs.existsSync(this.keyPairPkPath))
    ) {
      const keypair = this.zok.setup(this.artifacts.program);
      fs.writeFileSync(this.keyPairVkPath, JSON.stringify(keypair.vk));
      fs.writeFileSync(this.keyPairPkPath, keypair.pk);
    }
  }

  proof(args) {
    console.log(`[*] ${this.name} :: proof`);
    console.log(args);
    const witness = this._witness(args);
    return this.zok.generateProof(
      this.artifacts.program,
      witness,
      this.keypair.pk
    );
  }

  exportContract() {
    const contract = this.zok.exportSolidityVerifier(this.keypair.vk, "v1");
    fs.writeFileSync(this.contractPath, contract);
  }

  _witness(args) {
    const { witness } = this.zok.computeWitness(this.artifacts, args);
    console.log({ witness });
    return witness;
  }
}

module.exports = { Proof };
