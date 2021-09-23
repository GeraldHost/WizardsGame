// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.6;

IGame interface {
  function commit(uint256 tokenId) public; 

  function reveal(uint256 tokenId) public;

  function settle(uint256 tokenId) public;

  function cancel(uint256 tokenId) public;

  function gameStatus(uint256 tokenId) public view returns (bool, bool, bool);
}

contract Wizardsgame is IGame {

  address public queued;
  
  // battle hash => battle
  mapping(bytes32 => Battle) public battles;
  
  function commit(uint256 tokenId) public {
  
  }
}
