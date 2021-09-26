// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.6;

import "ds-test/test.sol";

import "./WizardArena.sol";

contract WizardArenaTest is DSTest {
    WizardArena wizardArena;

    function setUp() public {
        wizardArena = new WizardArena();
    }

    function testFail_basic_sanity() public {
        assertTrue(false);
    }

    function test_basic_sanity() public {
        assertTrue(true);
    }
}
