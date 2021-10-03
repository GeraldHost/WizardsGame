const { expect, use } = require("chai");
const chaiAsPromised = require("chai-as-promised");
use(chaiAsPromised);

const gracePeriod = 0;

const zeroAddress = "0x0000000000000000000000000000000000000000";

describe("ClaimVouch", function () {
  let accounts, account, wizards, wizardArena;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    account = signers[0];

    const Wizards = await ethers.getContractFactory("TestWizards");
    wizards = await Wizards.deploy();

    const WizardArena = await ethers.getContractFactory("WizardArena");
    wizardArena = await WizardArena.deploy(gracePeriod, wizards.address);

    await wizards.init(zeroAddress, wizardArena.address);
  });

  it("default", async () => {
    expect(true).to.equal(true);
  });
});
