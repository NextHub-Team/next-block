import { ethers } from 'ethers';

export const getSigner = () => {
  const privateKey = process.env.TREASURY_PRIVATE_KEY!;
  const rpcUrl = process.env.SEPOLIA_RPC_URL!;

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);
  return signer;
};
