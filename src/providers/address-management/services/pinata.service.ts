import { Injectable } from '@nestjs/common';
import { pinata } from '../utils/pinata.singleton';

@Injectable()
export class PinataService {
  async uploadJson(
    json: Record<string, any>,
  ): Promise<{ cid: string; url: string }> {
    const result = await pinata.pinJSONToIPFS(json);
    return {
      cid: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    };
  }

  async isCidPinned(cid: string): Promise<boolean> {
    const result = await pinata.pinList({
      hashContains: cid,
      status: 'pinned',
    });
    return result.rows.length > 0;
  }
}
