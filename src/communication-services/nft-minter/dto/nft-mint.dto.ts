export class NftMintEventDto {
  event: string;
  timestamp: string;
  nfts: {
    uid: string;
    image_url: string;
    metadata: {
      title: string;
      description: string;
      attributes: { trait_type: string; value: string }[];
    };
  }[];
}
