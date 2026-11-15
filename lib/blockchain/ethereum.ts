import { ethers } from "ethers";
import { SEPOLIA_CHAIN_ID } from "./config";

export async function getWalletProvider() {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    let network = await provider.getNetwork();

    if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
        await switchToSepolia();
        network = await provider.getNetwork();
    }

    if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
        throw new Error("Please switch MetaMask to Ethereum Sepolia.");
    }

    return provider;
}

export async function connectSepoliaWallet() {
    const provider = await getWalletProvider();
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return { provider, signer, address };
}

export async function signWorkChainLogin() {
    const { signer, address } = await connectSepoliaWallet();

    const message =
        `WorkChain Login\n\n` +
        `Wallet: ${address}\n` +
        `Network: Ethereum Sepolia\n\n` +
        `Sign this message to prove wallet ownership.`;

    const signature = await signer.signMessage(message);

    return { address, signature, message };
}

export async function switchToSepolia() {
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
    }

    await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }]
    });
}
