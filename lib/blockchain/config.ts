export const SEPOLIA_CHAIN_ID = 11155111;

export const WORKCHAIN_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_WORKCHAIN_CONTRACT_ADDRESS || "";

export const WORKCHAIN_CONTRACT_ABI = [
    "function register() external",
    "function isRegistered(address user) external view returns (bool)",
    "function registeredAt(address user) external view returns (uint256)",
    "event Registered(address indexed user, uint256 timestamp)"
];
