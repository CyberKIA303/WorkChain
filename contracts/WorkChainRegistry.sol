// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * WorkChainRegistry
 *
 * Minimal real smart contract for the WorkChain prototype.
 * It registers a wallet address on Ethereum Sepolia so the
 * Next.js prototype has an actual on-chain interaction.
 */
contract WorkChainRegistry {
    mapping(address => uint256) public registeredAt;

    event Registered(address indexed user, uint256 timestamp);

    function register() external {
        require(registeredAt[msg.sender] == 0, "Wallet already registered");

        registeredAt[msg.sender] = block.timestamp;

        emit Registered(msg.sender, block.timestamp);
    }

    function isRegistered(address user) external view returns (bool) {
        return registeredAt[user] != 0;
    }
}
