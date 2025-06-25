import pinataSDK from '@pinata/sdk';

export const pinata = new pinataSDK({
  pinataJWTKey: process.env.PINATA_API_KEY!,
});
