import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ethers } from 'ethers';

type SleeveMap = Record<string, string>;

@Injectable()
export class SleeveContractService {
  private readonly logger = new Logger(SleeveContractService.name);

  private readonly storePath = path.resolve(process.cwd(), 'data', 'sleeves.json');

  constructor() {
    this.ensureStoreFile();
    this.logger.log(`Sleeve storePath=${this.storePath}`);
  }

  private normalizeSleeveId(sleeveId: string): string {
    return String(sleeveId ?? '').trim();
  }

  private ensureStoreFile(): void {
    const dir = path.dirname(this.storePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (!fs.existsSync(this.storePath)) {
      fs.writeFileSync(this.storePath, JSON.stringify({}, null, 2));
    }
  }

  private readStore(): SleeveMap {
    // TODO: replace with DB read
    const raw = fs.readFileSync(this.storePath, 'utf8');
    const parsed = JSON.parse(raw) as SleeveMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  }

  private writeStore(data: SleeveMap): void {
    // TODO: replace with DB write
    fs.writeFileSync(this.storePath, JSON.stringify(data, null, 2));
  }

  getAddressOrThrow(sleeveId: string): string {
    const key = this.normalizeSleeveId(sleeveId);
    if (!key) throw new Error('sleeveId is required');

    const latest = this.readStore();
    const addr = latest[key];

    if (!addr) {
      this.logger.error(
        `Sleeve not registered. key=${JSON.stringify(key)} keysInStore=${JSON.stringify(Object.keys(latest))}`,
      );
      throw new Error(`No contract address registered for sleeveId=${key}`);
    }

    return ethers.getAddress(addr);
  }

  registerOrUpdate(sleeveId: string, contractAddress: string): void {
    const key = this.normalizeSleeveId(sleeveId);
    if (!key) throw new Error('sleeveId is required');

    const normalized = ethers.getAddress(String(contractAddress ?? '').trim());

    const latest = this.readStore();
    latest[key] = normalized;
    this.writeStore(latest);

    this.logger.log(`Sleeve registered. sleeveId=${key} address=${normalized}`);
  }

  list(): Array<{ sleeveId: string; contractAddress: string }> {
    const latest = this.readStore();
    return Object.entries(latest).map(([sleeveId, contractAddress]) => ({
      sleeveId,
      contractAddress,
    }));
  }
}
