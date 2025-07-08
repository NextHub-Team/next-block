import { deployNFTContract } from './deploy-nft.script';

async function main() {
  const providerUrl =
    'https://sepolia.infura.io/v3/50bfbcb5b1a1468b82d8a5ac3ad42df3';
  const privateKey =
    'd5a22e0c13a0c19a4e2f4f4305d079bcc41a92256cc5ea597499a601a84dc343';

  const address = await deployNFTContract(
    providerUrl,
    privateKey,
    'TestNFT',
    'TNFT',
  );
  console.log(`NFT Contract deployed at: ${address}`);
}

main().catch(console.error);
