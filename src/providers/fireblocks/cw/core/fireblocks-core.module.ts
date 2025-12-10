import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FireblocksClientService } from './shared/fireblocks-client.service';
import { FireblocksErrorMapper } from '../infrastructure/persistence/relational/mappers/fireblocks-error.mapper';
import { FireblocksResilienceService } from './shared/fireblocks-resilience.service';

@Module({
  imports: [ConfigModule],
  providers: [FireblocksClientService, FireblocksErrorMapper, FireblocksResilienceService],
  exports: [FireblocksClientService, FireblocksErrorMapper, FireblocksResilienceService],
})
export class FireblocksCoreModule {}
