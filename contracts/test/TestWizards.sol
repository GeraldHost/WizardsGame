pragma solidity ^0.8.0;

import "../Wizards.sol";

// Test wizards so we can test this contract locally without
// having to fuck around with forked bridge stuff
contract TestWizards is Wizards {
  function claim(
    uint256 tokenId,
    address owner,
    string memory tokenURI
  ) public override {
    tokenIds[tokenId] = true;
    tokenURIs[tokenId] = tokenURI;
    tokenOwners[tokenId] = owner;
  }
}
