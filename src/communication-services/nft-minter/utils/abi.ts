export const NFT_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'string[]',
        name: 'uris',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'datas',
        type: 'string[]',
      },
      {
        internalType: 'address[]',
        name: 'royaltyWallets',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'royaltyPercentages',
        type: 'uint256[]',
      },
      {
        internalType: 'string',
        name: 'paymentMethodName',
        type: 'string',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];
