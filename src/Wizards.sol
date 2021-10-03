// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "./lib/ArbSys.sol";
import "./lib/AddressAliasHelper.sol";

contract Wizards {
  ArbSys constant arbsys = ArbSys(address(100));

  struct Metadata {
    uint256 xp;
    uint256 level;
  }

  address public l1Target;

  address public game;

  mapping(uint256 => bool) public tokenIds;

  mapping(uint256 => string) public tokenURIs;

  mapping(uint256 => address) public tokenOwners;

  mapping(uint256 => Metadata) public tokenMetadatas;

  constructor(address _l1Target, address _game) {
    l1Target = _l1Target;
    game = _game;
  }

  modifier onlyGame() {
    require(msg.sender == game);
    _;
  }

  function setL1Target(address _l1Target) public {
    l1Target = _l1Target;
  }

  function setGame(address _game) public {
    game = _game;
  }

  function claim(
    uint256 tokenId,
    address owner,
    string memory tokenURI
  ) public virtual {
    require(
      msg.sender == AddressAliasHelper.applyL1ToL2Alias(l1Target),
      "only updateable by L1"
    );
    tokenIds[tokenId] = true;
    tokenURIs[tokenId] = tokenURI;
    tokenOwners[tokenId] = owner;
  }

  function upgrade(uint256 tokenId) public onlyGame {
    require(tokenMetadatas[tokenId].xp >= 1000, "upgrade: not enough xp");
    tokenMetadatas[tokenId].level++;
    tokenMetadatas[tokenId].xp = 0;
  }

  function xpLevelOf(uint256 tokenId) public view returns (uint256) {
    return tokenMetadatas[tokenId].xp / 1000 + 1;
  }

  function update(uint256 tokenId, uint256 score) public {
    uint256 level = xpLevelOf(tokenId);
    uint256 xp = (score / 3 + 1 / level) * 100;
    tokenMetadatas[tokenId].xp += xp;
  }

  function exists(uint256 tokenId) public view returns (bool) {
    return tokenIds[tokenId];
  }

  function ownerOf(uint256 tokenId) public view returns (address) {
    return tokenOwners[tokenId];
  }
}
