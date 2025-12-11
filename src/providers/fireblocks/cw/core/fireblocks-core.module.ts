import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FireblocksCwService } from '../fireblocks-cw.service';
import { FireblocksErrorMapper } from '../infrastructure/persistence/relational/mappers/fireblocks-error.mapper';
import { FireblocksResilienceService } from './shared/fireblocks-resilience.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [FireblocksCwService, FireblocksErrorMapper, FireblocksResilienceService],
  exports: [
    ConfigModule,
    FireblocksCwService,
    FireblocksErrorMapper,
    FireblocksResilienceService,
  ],
})
export class FireblocksCoreModule {}
