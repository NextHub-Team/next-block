import { Module } from '@nestjs/common';
import { FireblocksService } from './fireblocks.service';

@Module({
  providers: [FireblocksService],
  exports: [FireblocksService], // Export service for use in other modules
})
export class FireblocksModule {}
