// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

interface ICommitVerifier {
	struct G1Point {
        uint X;
        uint Y;
    }
    
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }

	struct Proof {
        G1Point a;
        G2Point b;
        G1Point c;
    }

	function verifyTx(Proof memory proof, uint[4] memory input) external view returns (bool r);
}
