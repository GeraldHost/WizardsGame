// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "./lib/ArbSys.sol";
import "./lib/AddressAliasHelper.sol";

contract Wizards {
	ArbSys constant arbsys = ArbSys(address(100));

	address public l1Target;

	mapping(uint256 => bool) public tokenIds;

	mapping(uint256 => string) public tokenURIs;

	mapping(uint256 => address) public tokenOwners;

	constructor(address _l1Target) {
		l1Target = _l1Target;
	}

	function updateL1Target(address _l1Target) public {
        l1Target = _l1Target;
    }

	function claim(uint256 tokenId, address owner, string memory tokenURI) public {
		require(msg.sender == AddressAliasHelper.applyL1ToL2Alias(l1Target), "only updateable by L1");
		tokenIds[tokenId] = true;
		tokenURIs[tokenId] = tokenURI;
		tokenOwners[tokenId] = owner;
	}

	function exists(uint256 tokenId) public view returns (bool) {
		return tokenIds[tokenId];
	}

	function ownerOf(uint256 tokenId) public view returns (address) {
		return tokenOwners[tokenId];
	}
}
