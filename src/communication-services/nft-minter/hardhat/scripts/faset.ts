// import { ethers } from 'ethers';

// const PRIVATE_KEY = '0xd5a22e0c13a0c19a4e2f4f4305d079bcc41a92256cc5ea597499a601a84dc343';  // کلید خصوصی‌ات رو اینجا بذار
// const RPC_URL = 'https://sepolia.infura.io/v3/50bfbcb5b1a1468b82d8a5ac3ad42df3';       // RPC URL

// export const getSigner = () => {
//   const provider = new ethers.JsonRpcProvider(RPC_URL);
//   const signer = new ethers.Wallet(PRIVATE_KEY, provider);
//   return signer;
// };

// async function printFacets() {
//   const diamondAddress = '0xf4c0840e8c0aa6c8e85b4bcdf9a2411f30022fc1';
//   const diamondAbi = [
//     "function getFacets() external view returns (address[])"
//   ];

//   const signer = getSigner();

//   const diamondContract = new ethers.Contract(diamondAddress, diamondAbi, signer);

//   const facets = await diamondContract.getFacets();
//   console.log('Facet addresses:', facets);
// }

// printFacets().catch(console.error);

import { ethers } from 'ethers';

const PRIVATE_KEY =
  '0xd5a22e0c13a0c19a4e2f4f4305d079bcc41a92256cc5ea597499a601a84dc343'; // کلید خصوصی‌ات رو اینجا بذار
const RPC_URL = 'https://sepolia.infura.io/v3/50bfbcb5b1a1468b82d8a5ac3ad42df3'; // RPC URL

export const getSigner = () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  return signer;
};

async function printFacetsAndFunctions() {
  const diamondAddress = '0xf4c0840e8c0aa6c8e85b4bcdf9a2411f30022fc1';
  const diamondAbi = ['function getFacets() external view returns (address[])'];

  // این ABI برای خواندن لیست توابع Facet است
  const facetAbi = ['function getFacetPI() external pure returns (string[])'];

  const signer = getSigner();

  const diamondContract = new ethers.Contract(
    diamondAddress,
    diamondAbi,
    signer,
  );

  const facets = await diamondContract.getFacets();
  console.log('Facet addresses:', facets);

  for (const facetAddress of facets) {
    try {
      const facetContract = new ethers.Contract(facetAddress, facetAbi, signer);
      const functions = await facetContract.getFacetPI();
      console.log(`Functions in facet ${facetAddress}:`);
      functions.forEach((fn: string) => console.log(`  - ${fn}`));
    } catch (err) {
      console.error(`Error reading functions from facet ${facetAddress}:`, err);
    }
  }
}

printFacetsAndFunctions().catch(console.error);
