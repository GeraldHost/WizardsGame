// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./Wizards.sol";
import "./interfaces/ICommitVerifier.sol";

contract WizardArena {

  struct Battle {
    uint256 startedAt;
    uint256[2] players;
  }

  struct Queued {
    uint256 tokenId;
    bytes32 commitment;
  }

  uint256 public gracePeriod;

  Wizards public wizards;

  Queued public queued;

  ICommitVerifier public commitVerifier;
  
  mapping(bytes32 => Battle) public battles;

  mapping(uint256 => bytes32) public tokenIdToBattle;

  mapping(bytes32 => mapping(uint256 => bytes32)) public commitments;

  mapping(bytes32 => mapping(uint256 => uint64[4])) public revelations;

  enum Status{ COMMIT, WAITING_FOR_COMMITS, REVEAL, WAITING_FOR_REVEAL, SETTLE }

  event Commit(address sender, uint256 tokenId);

  event Reveal(address sender, uint256 tokenId, uint64[4] attacks);

  constructor(uint64 _gracePeriod, Wizards _wizards) {
    gracePeriod = _gracePeriod;
    wizards = _wizards;
  }

  modifier tokenExists(uint256 tokenId) {
    require(wizards.exists(tokenId), "tokenExists: non existant token");
    require(wizards.ownerOf(tokenId) == msg.sender, "tokenExists: not token owner");
    _;
  }
  
  function commit(uint256 tokenId, ICommitVerifier.Proof memory proof, uint64[4] memory input) public tokenExists(tokenId) {
    require(queued.tokenId != tokenId, "commit: you are already queued");
    require(status(tokenId) == Status.COMMIT, "commit: status not ready");
    // TODO: ugly
    require(commitVerifier.verifyTx(proof, [uint(input[0]),uint(input[1]),uint(input[2]),uint(input[3])]), "commit: commit proof invalid");

    bytes32 commitment = _inputToBytes32(input);

    if(queued.tokenId != 0) {
      queued = Queued(tokenId, commitment);
    } else {
      bytes32 battleHash = keccak256(abi.encodePacked(queued.tokenId, tokenId, block.number));
      
      Battle storage battle = battles[battleHash];
      battle.startedAt = block.timestamp;
      
      battle.players[0] = queued.tokenId;
      commitments[battleHash][queued.tokenId] = queued.commitment;
      
      battle.players[1] = tokenId;
      commitments[battleHash][tokenId] = commitment;

      tokenIdToBattle[queued.tokenId] = battleHash;
      tokenIdToBattle[tokenId] = battleHash;

      _resetQueued();
    }

    emit Commit(msg.sender, tokenId);
  }

  function reveal(uint256 tokenId, uint64[4] memory attacks) public tokenExists(tokenId) {
    require(status(tokenId) == Status.REVEAL, "reveal: status not ready");
    bytes32 battleHash = tokenIdToBattle[tokenId];
    require(commitments[battleHash][tokenId] == keccak256(abi.encodePacked(attacks)), "reveal: commitment hash does not match");
    revelations[battleHash][tokenId] = attacks;

    emit Reveal(msg.sender, tokenId, attacks);
  }

  function settle(uint256 tokenId) public tokenExists(tokenId) {
    require(status(tokenId) == Status.SETTLE, "reveal: status not ready");
    bytes32 battleHash = tokenIdToBattle[tokenId];
    
    uint256 score = _score(battleHash, tokenId);
        
    // TODO: settle winner

    _resetTokenId(tokenId);
  }

  function status(uint256 tokenId) public view tokenExists(tokenId) returns (Status) {
    bytes32 battleHash = tokenIdToBattle[tokenId];

    if(battleHash == 0) {
      // commit phase
      // not battle has been created yet
      if(queued.tokenId == tokenId) {
        return Status.WAITING_FOR_COMMITS;
      } else {
        return Status.COMMIT;
      }
    } else if (!_hasRevelations(battleHash)) {
      // revelation phase
      // At this point a battle has been created which can only
      // happen when both players have made commitments
      if(_hasRevealed(battleHash, tokenId)) {
        // token ID has revealed but we are still waiting for the
        // other player to reveal
        return Status.WAITING_FOR_REVEAL;
      } else {
        // token ID hasn't revealed
        return Status.REVEAL;
      }
    } else {
      // settlement phase
      return Status.SETTLE;
    }
  }

  function abort(uint256 tokenId) public {
    bytes32 battleHash = tokenIdToBattle[tokenId];
    if(block.timestamp - battles[battleHash].startedAt >= gracePeriod) {
      _resetTokenId(tokenId);
    }
  }

  function opponent(uint256 tokenId) public view returns (uint256) {
    bytes32 battleHash = tokenIdToBattle[tokenId];
    Battle memory battle = battles[battleHash];
    if(battle.players[0] == tokenId) {
      return battle.players[1];
    } else {
      return battle.players[0];
    }
  }

  function _score(bytes32 battleHash, uint256 tokenId) internal view returns (uint256) {
    uint64[4] memory revelation = revelations[battleHash][tokenId];
    uint64[4] memory opponentRevelation = revelations[battleHash][opponent(tokenId)];

    uint256 score = 0;

    for(uint256 i = 0; i < 3; i++) {
      if(revelation[i] == 1 && opponentRevelation[i] == 3
        || revelation[i] == 2 && opponentRevelation[i] == 1
        || revelation[i] == 3 && opponentRevelation[i] == 2) {
        score++;
      }
    }

    return score;
  }

  function _hasRevealed(bytes32 battleHash, uint256 tokenId) internal view returns (bool) {
    uint64[4] memory revelation = revelations[battleHash][tokenId];
    return revelation[0] != 0 && revelation[1] != 0 && revelation[2] != 0;
  }

  function _hasRevelations(bytes32 battleHash) internal view returns (bool) {
    Battle memory battle = battles[battleHash];
    bool has = true;
    for(uint256 i = 0; i < 2; i++) {
      if(_hasRevealed(battleHash, battle.players[i])) {
        has = false;
      }
    }
    return has;
  }

  function _inputToBytes32(uint64[4] memory input) internal pure returns (bytes32) {
    bytes8 a = bytes8(uint64(input[0]));
    bytes8 b = bytes8(uint64(input[1]));
    bytes8 c = bytes8(uint64(input[2]));
    bytes8 d = bytes8(uint64(input[3]));

    return bytes32(abi.encodePacked(a,b,c,d));
  }

  function _resetQueued() internal {
    queued = Queued(0, 0);
  }

  function _resetTokenId(uint256 tokenId) internal {
    tokenIdToBattle[tokenId] = 0;
  }
}
