// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HelloCounter {
    uint256 public counter;
    event CounterChanged(uint256 newValue);

    constructor() {
        counter = 1;
        emit CounterChanged(counter);
    }

    function inc() external {
        counter += 1;
        emit CounterChanged(counter);
    }

    function set(uint256 v) external {
        counter = v;
        emit CounterChanged(counter);
    }
}
