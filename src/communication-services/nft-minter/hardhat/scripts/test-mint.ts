// // import { ethers } from 'ethers';
// // import { toJson } from '../utils/abi';

// // const CONTRACT_ADDRESS = '0xf4c0840e8c0aa6c8e85b4bcdf9a2411f30022fc1';
// // const PRIVATE_KEY =
// //   'd5a22e0c13a0c19a4e2f4f4305d079bcc41a92256cc5ea597499a601a84dc343';
// // const RPC_URL = 'https://sepolia.infura.io/v3/50bfbcb5b1a1468b82d8a5ac3ad42df3';

// // async function main(): Promise<void> {
// //   const abi = toJson(
// //     'function mint(uris: string[], datas: string[], royaltyWallets: address[], royaltyPercentages: uint256[], paymentMethodName: string):() payable',
// //   );

// //   const provider = new ethers.JsonRpcProvider(RPC_URL);
// //   const signer = new ethers.Wallet(PRIVATE_KEY, provider);
// //   const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

// //   const uris = ['QmRTnaHkE1FAPExGBPo6cBV98R62svbnj1pzsJitr9NGtU'];
// //   const datas: string[] = [];
// //   const royaltyWallets: string[] = [];
// //   const royaltyPercentages: number[] = [0];
// //   const paymentMethodName = 'WEI';

// //   try {
// //     const tx = await contract.mint(
// //       uris,
// //       datas,
// //       royaltyWallets,
// //       royaltyPercentages,
// //       paymentMethodName,
// //       {
// //         value: ethers.parseEther('0'),
// //       },
// //     );
// //     console.log('Minting transaction sent:', tx.hash);
// //     const receipt = await tx.wait();
// //     console.log('Minted in block:', receipt.blockNumber);
// //   } catch (error: any) {
// //     console.error('Mint failed:', error.reason || error.message);
// //   }
// // }

// // void main();

// import Web3 from 'web3';
// import { toJson } from '../../utils/abi';  // مسیرش رو با مسیر واقعی خودت چک کن

// // مقادیر ثابت
// const RPC_URL = 'https://sepolia.infura.io/v3/50bfbcb5b1a1468b82d8a5ac3ad42df3';
// const CONTRACT_ADDRESS = '0xf4c0840e8c0aa6c8e85b4bcdf9a2411f30022fc1';
// const WALLET_ADDRESS = '0xE6Cd1B1E60c7fDfe5d2CD03eCf37617A1170853F';  // به آدرس خودت تغییر بده

// // تعریف interface خروجی
// interface OwnedTokensResult {
//   totalCount: string;
//   tokenIdArr: string[];
//   tokenURIArr: string[];
//   tokenDataArr: string[];
// }

// async function main() {
//   const web3 = new Web3(RPC_URL);

//   const abi = toJson(
//     `function ownedTokens2(account: address, startIndex: uint256, count: uint256, reverse: bool):
//     (totalCount: uint256, tokenIdArr: uint256[], tokenURIArr: string[], tokenDataArr: string[]) view`
//   );

//   const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

//   try {
//     console.log(`🚀 Calling ownedTokens2 for address: ${WALLET_ADDRESS}`);
//     const tokens = await contract.methods
//       .ownedTokens2(WALLET_ADDRESS, 0, 0, false)
//       .call({ from: WALLET_ADDRESS }) as OwnedTokensResult;

//     if (!tokens || !tokens.tokenIdArr) {
//       console.warn('⚠ No tokens found or invalid response');
//       return;
//     }

//     console.log(`✅ Total Count: ${tokens.totalCount}`);
//     console.log(`✅ Token IDs: ${tokens.tokenIdArr}`);
//     console.log(`✅ Token URIs: ${tokens.tokenURIArr}`);
//     console.log(`✅ Token Data: ${tokens.tokenDataArr}`);
//   } catch (err: any) {
//     console.error(`❌ Error fetching tokens: ${err.message || err}`);
//   }
// }

// main().catch(err => {
//   console.error(`❌ Fatal error: ${err.message || err}`);
// });
