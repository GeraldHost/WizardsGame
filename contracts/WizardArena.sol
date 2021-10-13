// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./Wizards.sol";

contract WizardArena {

  struct Battle {
    uint256 startedAt;
    uint256[2] players;
  }

  struct Queued {
    uint256 tokenId;
    bytes32 commitment;
  }
  
  struct InputsOption {
    uint256[3][3] value;
    bool isSet;
  }

  uint256 public gracePeriod;

  Wizards public wizards;

  Queued public queued;
  
  mapping(bytes32 => Battle) public battles;

  mapping(uint256 => bytes32) public tokenIdToBattle;

  mapping(bytes32 => mapping(uint256 => bytes32)) public commitments;

  mapping(bytes32 => mapping(uint256 => InputsOption)) public revelations;

  enum Status{ COMMIT, WAITING_FOR_COMMITS, REVEAL, WAITING_FOR_REVEAL, SETTLE }

  event Commit(address sender, uint256 tokenId);

  event Reveal(address sender, uint256 tokenId, uint256[3][3] inputs);

  constructor(uint64 _gracePeriod, Wizards _wizards) {
    gracePeriod = _gracePeriod;
    wizards = _wizards;
  }

  modifier tokenExists(uint256 tokenId) {
    require(wizards.exists(tokenId), "tokenExists: non existant token");
    require(wizards.ownerOf(tokenId) == msg.sender, "tokenExists: not token owner");
    _;
  }
  
  function commit(uint256 tokenId, bytes32 commitment) public tokenExists(tokenId) {
    require(queued.tokenId != tokenId, "commit: you are already queued");
    require(status(tokenId) == Status.COMMIT, "commit: status not ready");

    if(queued.tokenId == 0) {
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

  function reveal(uint256 tokenId, uint256[3][3] memory inputs) public tokenExists(tokenId) {
    require(status(tokenId) == Status.REVEAL, "reveal: status not ready");
    bytes32 battleHash = tokenIdToBattle[tokenId];
    require(commitments[battleHash][tokenId] == keccak256(abi.encodePacked(inputs)), "reveal: commitment hash does not match");
    revelations[battleHash][tokenId] = InputsOption(inputs, true);

    emit Reveal(msg.sender, tokenId, inputs);
  }

  function settle(uint256 tokenId) public tokenExists(tokenId) {
    require(status(tokenId) == Status.SETTLE, "reveal: status not ready");
    bytes32 battleHash = tokenIdToBattle[tokenId];
    
    uint256 score = _score(battleHash, tokenId);
    wizards.update(tokenId, score);

    _resetTokenId(tokenId);
  }

  function status(uint256 tokenId) public view returns (Status) {
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
    InputsOption memory revelation = revelations[battleHash][tokenId];
    InputsOption memory opponentRevelation = revelations[battleHash][opponent(tokenId)];
  
    if(!_hasRevelations(battleHash)) {
      // players haven't both revealed yet so just early return
      return 0;
    }
    
    uint256[3] memory selection = _inputsToSelection(revelation.value);
    uint256[3] memory opponentSelection = _inputsToSelection(opponentRevelation.value);
    
    uint256 score = 0;

    for(uint256 i = 0; i < 3; i++) {
      if(selection[i] == 0 && opponentSelection[i] == 2
        || selection[i] == 1 && opponentSelection[i] == 0
        || selection[i] == 2 && opponentSelection[i] == 1) {
        score++;
      }
    }

    return score;
  }

  function _hasRevealed(bytes32 battleHash, uint256 tokenId) internal view returns (bool) {
    InputsOption memory revelation = revelations[battleHash][tokenId];
    return revelation.isSet;
  }

  function _hasRevelations(bytes32 battleHash) internal view returns (bool) {
    Battle memory battle = battles[battleHash];
    for(uint256 i = 0; i < battle.players.length; i++) {
      if(!_hasRevealed(battleHash, battle.players[i])) {
        return false;
      }
    }
    return true;
  }
  
  // Convert inputs into selections i.e
  // inputs: uint[3][3] [[11, 22, 0], [33, 44, 0], [55, 55, 0]]
  // selection: uint[3] [2, 2, 2]
  function _inputsToSelection(uint256[3][3] memory inputs) internal pure returns (uint256[3] memory) {
    uint256[3] memory selection;

    for(uint i = 0; i < 3; i++) {
      if(inputs[i][0] == 0) {
        selection[i] = 0;
      } else if(inputs[i][1] == 0) {
        selection[i] = 1;
      } else if(inputs[i][2] == 0) {
        selection[i] = 2;
      }
    }

    return selection;
  }

  function _resetQueued() internal {
    queued = Queued(0, 0);
  }

  function _resetTokenId(uint256 tokenId) internal {
    tokenIdToBattle[tokenId] = 0;
  }
}
