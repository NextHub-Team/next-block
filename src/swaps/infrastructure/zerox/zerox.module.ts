import { Module } from '@nestjs/common';
import { ZeroXClient } from './zerox.client';
import { ZeroXService } from './zerox.service';

@Module({
  providers: [ZeroXClient, ZeroXService],
  exports: [ZeroXService],
})
export class ZeroXModule {}
