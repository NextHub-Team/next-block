import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ZeroxService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey =
      this.configService.get<string>('zerox.apiKey', { infer: true }) ?? '';
    this.apiUrl =
      this.configService.get<string>('zerox.apiUrl', { infer: true }) ?? '';

    if (!this.apiKey || !this.apiUrl) {
      throw new Error(
        'ZeroX configuration is missing. Check environment variables.',
      );
    }
  }

  // Get current peice
  async getPrice(sellToken: string, buyToken: string, sellAmount: string) {
    const url = `${this.apiUrl}/price?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}`;
    const headers = { '0x-api-key': this.apiKey };

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers }),
      );
      return response.data;
    } catch (error) {
      const errorResponse = error.response?.data || error.message;
      console.error('Error fetching price:', errorResponse);

      throw new HttpException(
        `Failed to fetch price: ${JSON.stringify(errorResponse)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Get Quote Detail
  async getQuote(
    sellToken: string,
    buyToken: string,
    sellAmount: string,
    takerAddress?: string,
  ) {
    let url = `${this.apiUrl}/quote?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}`;
    if (takerAddress) {
      url += `&takerAddress=${takerAddress}`;
    }

    const headers = { '0x-api-key': this.apiKey };

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers }),
      );
      return response.data;
    } catch (error) {
      const errorResponse = error.response?.data || error.message;
      console.error('Error fetching quote:', errorResponse);

      throw new HttpException(
        `Failed to fetch quote: ${JSON.stringify(errorResponse)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
