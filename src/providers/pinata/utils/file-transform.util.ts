import { Readable } from 'stream';

export const bufferToStream = (buffer: Buffer): Readable => {
  return Readable.from(buffer);
};
