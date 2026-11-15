import { ethers } from "ethers";
import {
    WORKCHAIN_CONTRACT_ADDRESS,
    WORKCHAIN_CONTRACT_ABI
} from "./config";
import { connectSepoliaWallet } from "./ethereum";

function requireContractAddress() {
    if (!WORKCHAIN_CONTRACT_ADDRESS) {
        throw new Error(
            "WorkChain smart contract address is not configured. Add NEXT_PUBLIC_WORKCHAIN_CONTRACT_ADDRESS to .env.local."
        );
    }
}

export async function getWorkChainContract() {
    requireContractAddress();

    const { signer } = await connectSepoliaWallet();

    return new ethers.Contract(
        WORKCHAIN_CONTRACT_ADDRESS,
        WORKCHAIN_CONTRACT_ABI,
        signer
    );
}

export async function registerWalletOnChain() {
    const contract = await getWorkChainContract();
    const tx = await contract.register();

    return tx.wait();
}

export async function checkWalletRegistration(address: string) {
    requireContractAddress();

    const { provider } = await connectSepoliaWallet();

    const contract = new ethers.Contract(
        WORKCHAIN_CONTRACT_ADDRESS,
        WORKCHAIN_CONTRACT_ABI,
        provider
    );

    return contract.isRegistered(address);
}
