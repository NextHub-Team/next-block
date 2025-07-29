import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ZeroXClient {
  private api;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('ZEROX_API_KEY');

    this.api = axios.create({
      baseURL: 'https://api.0x.org',
      headers: {
        '0x-api-key': apiKey,
        '0x-version': 'v2',
      },
    });
  }

private async get(path: string, params: any) {
  try {
    const res = await this.api.get(path, { params });
    return res.data;
  } catch (e) {
    console.error('[ZeroXClient ERROR]', {
      path,
      params,
      response: e?.response?.data,
      status: e?.response?.status,
      details: e?.response?.data?.data?.details, 
    });
    throw new Error(e?.response?.data?.message || 'ZeroX API error');
  }
}

  getPermit2Price(params: any) {
    return this.get('/swap/permit2/price', params);
  }

  getPermit2Quote(params: any) {
    return this.get('/swap/permit2/quote', params);
  }

  getAllowanceHolderPrice(params: any) {
    return this.get('/swap/allowance-holder/price', params);
  }

  getAllowanceHolderQuote(params: any) {
    return this.get('/swap/allowance-holder/quote', params);
  }

  getChains() {
    return this.get('/swap/chains', {});
  }
}
