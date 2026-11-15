# WorkChain — Next.js Frontend Prototype

A frontend-only academic prototype for a blockchain-based work experience and credential verification platform.

## Features demonstrated
- Client view for finding verified workers
- Worker profile and blockchain credential proofs
- QR verification modal
- Agency read-only worker panel
- Contract / smart-contract preview workflow
- Mock wallet connection indicator
- Responsive layout

## Run

Requirements: Node.js 18.18+ (20 LTS recommended).

```bash
npm install
npm run dev
npm install ethers ### for Etherium Sepolia ###
```

Open http://localhost:3000

## Important
This is a UI prototype. It does not send real blockchain transactions. In the production system, credential hashes, verification records, and approved contracts can be connected to a smart contract / testnet wallet.


## Ethereum Sepolia integration

The prototype now supports:
- MetaMask connection on Ethereum Sepolia
- wallet-ownership login using an EIP-191 signature
- a real WorkChain registry smart contract
- on-chain wallet registration
- checking whether a wallet has been registered

Configure the deployed contract in `.env.local`:

```env
NEXT_PUBLIC_WORKCHAIN_CONTRACT_ADDRESS=YOUR_SEPOLIA_CONTRACT_ADDRESS
```

The included Solidity contract is `contracts/WorkChainRegistry.sol`.


## One-time smart contract deployment

1. Open Remix IDE.
2. Create/open `contracts/WorkChainRegistry.sol`.
3. Compile it with Solidity `0.8.20` or a compatible `0.8.x` compiler.
4. In Remix, select **Injected Provider - MetaMask**.
5. Switch MetaMask to **Ethereum Sepolia**.
6. Deploy `WorkChainRegistry`.
7. Copy the deployed contract address.
8. Create `.env.local` in the project root:

```env
NEXT_PUBLIC_WORKCHAIN_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_ADDRESS
```

9. Restart the Next.js development server.

### What the prototype does

- **Connect MetaMask**: connects the user to Ethereum Sepolia and asks the wallet to sign a WorkChain login message. Signing is free and does not create a blockchain transaction.
- **Register**: sends a real transaction to `WorkChainRegistry.register()`. This is the actual smart-contract interaction and requires Sepolia test ETH.
- **On-chain status**: after registration, the UI shows `✓ On-chain`.

The login signature proves wallet ownership for the prototype. It should not be treated as production authentication until a backend verifies the signature and creates a real session.
