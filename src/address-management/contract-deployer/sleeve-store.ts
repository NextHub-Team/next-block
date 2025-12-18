import * as fs from 'fs';
import * as path from 'path';
import { ethers } from 'ethers';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const FILE_PATH = path.resolve(DATA_DIR, 'sleeves.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE_PATH)) fs.writeFileSync(FILE_PATH, JSON.stringify({}, null, 2));
}

export function readSleeves(): Record<string, string> {
  ensureFile();
  return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
}

export function writeSleeve(sleeveId: string, contractAddress: string): void {
  ensureFile();

  const data = readSleeves();
  data[String(sleeveId).trim()] = ethers.getAddress(contractAddress);

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}
