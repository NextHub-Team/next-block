// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC1155, Ownable {
    uint256 public constant REWARD = 1;
    uint256 public constant STATUS = 2;
    uint256 public constant SUBSCRIPTION = 3;

    constructor(string memory uri_) ERC1155(uri_) Ownable(msg.sender) {}

    function _validateTokenId(uint256 id) internal pure {
        require(
            id == REWARD || id == STATUS || id == SUBSCRIPTION,
            "Invalid token id"
        );
    }

    function mint(address to, uint256 id, uint256 amount) external onlyOwner {
        _validateTokenId(id);
        _mint(to, id, amount, "");
    }

    function burn(address from, uint256 id, uint256 amount) external {

        _validateTokenId(id);
        require(
            msg.sender == owner() ||
                from == msg.sender ||
                isApprovedForAll(from, msg.sender),
            "Not allowed"
        );
        _burn(from, id, amount);
    }

    function transferToken(address from, address to, uint256 id, uint256 amount) external {
      
        _validateTokenId(id);
        require(
            msg.sender == owner() ||
                from == msg.sender ||
                isApprovedForAll(from, msg.sender),
            "Not allowed"
        );
        safeTransferFrom(from, to, id, amount, "");
    }

    function userBalances(address account)
        external
        view
        returns (uint256 rewardBalance, uint256 statusBalance, uint256 subscriptionBalance)
    {
        rewardBalance = balanceOf(account, REWARD);
        statusBalance = balanceOf(account, STATUS);
        subscriptionBalance = balanceOf(account, SUBSCRIPTION);
    }
}