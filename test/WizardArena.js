const { expect, use } = require("chai");
const chaiAsPromised = require("chai-as-promised");
use(chaiAsPromised);

const gracePeriod = 0;

const zeroAddress = "0x0000000000000000000000000000000000000000";

describe("Wizards", function () {
  let rick, morty, account, wizards, wizardArena;

  const tokenId = { rick: 1, morty: 2 };
  const tokenURI = "random-uri-content";
  const inputs = [
    [1, 32141, 0],
    [0, 321314, 1231],
    [32131, 0, 3211],
  ];
  const commitment = ethers.utils.solidityKeccak256(
    ["uint256[3][3]"],
    [inputs]
  );

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    account = signers[0];

    rick = signers[1];
    morty = signers[2];

    const Wizards = await ethers.getContractFactory("TestWizards");
    wizards = await Wizards.deploy();

    const WizardArena = await ethers.getContractFactory("WizardArena");
    wizardArena = await WizardArena.deploy(gracePeriod, wizards.address);

    await wizards.init(zeroAddress, wizardArena.address);
  });

  async function printStatus(name, tokenId) {
    const status = await wizardArena.status(tokenId);
    console.log(
      `[*] ${name} status: ${
        [
          "commit",
          "waiting for commit",
          "reveal",
          "waiting for reveal",
          "settle",
        ][status]
      }`
    );
  }

  async function printXpLevelOf(name, tokenId) {
    console.log(`[*] ${name} Level: ${await wizards.tokenMetadatas(tokenId)}`);
  }

  it("default", async () => {
    // claim wizards
    wizards.claim(tokenId.rick, rick.address, tokenURI);
    wizards.claim(tokenId.morty, morty.address, tokenURI);

    // simulate plays
    for (let i = 0; i < 100; i++) {
      await printStatus("Rick", tokenId.rick);
      await printStatus("Morty", tokenId.morty);

      await wizardArena.connect(rick).commit(tokenId.rick, commitment);
      await wizardArena.connect(morty).commit(tokenId.morty, commitment);

      await printStatus("Rick", tokenId.rick);
      await printStatus("Morty", tokenId.morty);

      await wizardArena.connect(rick).reveal(tokenId.rick, inputs);
      await wizardArena.connect(morty).reveal(tokenId.morty, inputs);

      await printStatus("Rick", tokenId.rick);
      await printStatus("Morty", tokenId.morty);

      await wizardArena.connect(rick).settle(tokenId.rick);
      await wizardArena.connect(morty).settle(tokenId.morty);

      await printStatus("Rick", tokenId.rick);
      await printStatus("Morty", tokenId.morty);

      await printXpLevelOf("Rick", tokenId.rick);
      await printXpLevelOf("Morty", tokenId.morty);
    }

    // check xp updates

    // upgrade wizard

    // claim mana
  });
});
