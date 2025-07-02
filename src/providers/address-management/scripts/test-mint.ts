import { ethers } from 'ethers';
import { toJson } from '../utils/abi';

const CONTRACT_ADDRESS = '0xf4c0840e8c0aa6c8e85b4bcdf9a2411f30022fc1';
const PRIVATE_KEY =
  'd5a22e0c13a0c19a4e2f4f4305d079bcc41a92256cc5ea597499a601a84dc343';
const RPC_URL = 'https://sepolia.infura.io/v3/50bfbcb5b1a1468b82d8a5ac3ad42df3';

async function main(): Promise<void> {
  const abi = toJson(
    'function mint(uris: string[], datas: string[], royaltyWallets: address[], royaltyPercentages: uint256[], paymentMethodName: string):() payable',
  );

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

  const uris = ['ipfs://QmaE4R8tKmBmMrGK1ZmFh21HaqvaPXfht9mr4axH6Xgx6C'];
  const datas: string[] = [];
  const royaltyWallets: string[] = [];
  const royaltyPercentages: number[] = [0];
  const paymentMethodName = 'WEI';

  try {
    const tx = await contract.mint(
      uris,
      datas,
      royaltyWallets,
      royaltyPercentages,
      paymentMethodName,
      {
        value: ethers.parseEther('0'),
      },
    );
    console.log('Minting transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Minted in block:', receipt.blockNumber);
  } catch (error: any) {
    console.error('Mint failed:', error.reason || error.message);
  }
}

void main();
