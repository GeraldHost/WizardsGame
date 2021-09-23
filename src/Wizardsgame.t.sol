// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.6;

import "ds-test/test.sol";

import "./Wizardsgame.sol";

contract WizardsgameTest is DSTest {
    Wizardsgame wizardsgame;

    function setUp() public {
        wizardsgame = new Wizardsgame();
    }

    function testFail_basic_sanity() public {
        assertTrue(false);
    }

    function test_basic_sanity() public {
        assertTrue(true);
    }
}
