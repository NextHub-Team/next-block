import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FireblocksClientProvider } from './providers/fireblocks-client.provider';
import { FireblocksErrorMapper } from '../infrastructure/persistence/relational/mappers/fireblocks-error.mapper';
import { FireblocksResilience } from './providers/fireblocks-resilience';

@Module({
  imports: [ConfigModule],
  providers: [FireblocksClientProvider, FireblocksErrorMapper, FireblocksResilience],
  exports: [FireblocksClientProvider, FireblocksErrorMapper, FireblocksResilience],
})
export class FireblocksCoreModule {}
