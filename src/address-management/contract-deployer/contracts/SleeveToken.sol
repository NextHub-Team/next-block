// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SleeveToken is ERC1155, Ownable {
    uint256 public constant REWARD = 1;
    uint256 public constant STATUS = 2;
    uint256 public constant SUBSCRIPTION = 3;

    constructor() ERC1155("") Ownable(msg.sender) {}

    function _validate(uint256 id) internal pure {
        require(
            id == REWARD || id == STATUS || id == SUBSCRIPTION,
            "Invalid token type"
        );
    }

    function mint(address to, uint256 id, uint256 amount) external onlyOwner {
        _validate(id);
        _mint(to, id, amount, "");
    }

    function burn(address from, uint256 id, uint256 amount) external {
        _validate(id);
        require(
            msg.sender == owner() ||
            msg.sender == from ||
            isApprovedForAll(from, msg.sender),
            "Not allowed"
        );
        _burn(from, id, amount);
    }

    function balances(address user)
        external
        view
        returns (uint256 reward, uint256 status, uint256 subscription)
    {
        reward = balanceOf(user, REWARD);
        status = balanceOf(user, STATUS);
        subscription = balanceOf(user, SUBSCRIPTION);
    }

    function balanceByType(address user, uint256 id)
        external
        view
        returns (uint256)
    {
        _validate(id);
        return balanceOf(user, id);
    }
}
