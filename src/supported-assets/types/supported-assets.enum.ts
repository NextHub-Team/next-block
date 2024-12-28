import { createEnum } from '../../utils/types/helper.type';

export const EventLogStatusEnum = createEnum([
  'Native', // Native blockchain coins like BTC or ETH
  'EVM', // Assets operating on Ethereum Virtual Machine-based networks
  'Stable', // Tokens pegged to stable values like fiat currencies (e.g., USDT)
  'Meme', // Community-driven tokens, often created as memes (e.g., DOGE)
  'DeFi', // Tokens used in decentralized finance applications (e.g., AAVE)
  'NFTs', // Non-fungible tokens representing unique assets like art or collectibles
  'Wrapped', // Tokens representing assets on other blockchains (e.g., WBTC)
  'Governance', // Tokens enabling voting rights in protocols (e.g., UNI)
  'Utility', // Tokens used to access products or services within ecosystems (e.g., LINK)
]);
