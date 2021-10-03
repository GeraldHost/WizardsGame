// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "./lib/openzeppelin-contracts/token/ERC20/ERC20.sol";

interface IWizards {
  function ownerOf(uint256 tokenId) external view returns (address);

  function xpLevelOf(uint256 tokenId) external view returns (uint256);

  function tokenMetadatas(uint256 tokenId)
    external
    view
    returns (uint256, uint256);
}

contract Mana is ERC20("Mana", "Mana") {
  IWizards public wizards;

  // tokenId => level => claimed amount
  mapping(uint256 => mapping(uint256 => uint256)) public claims;

  event Claim(address sender, uint256 amount);

  constructor(IWizards _wizards) {
    wizards = _wizards;
  }

  function claim(uint256 tokenId) public {
    require(
      wizards.ownerOf(tokenId) == msg.sender,
      "claim: not owner of token ID"
    );
    uint256 level = wizards.xpLevelOf(tokenId);
    uint256 claimed = claims[tokenId][level];
    (uint256 xp, ) = wizards.tokenMetadatas(tokenId);
    uint256 amount = xp - claimed;
    if (amount > 0) {
      _mint(msg.sender, amount);
      emit Claim(msg.sender, amount);
    }
  }
}

