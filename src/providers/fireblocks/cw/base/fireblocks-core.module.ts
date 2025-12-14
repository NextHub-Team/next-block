import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FireblocksCwService } from '../fireblocks-cw.service';
import { FireblocksErrorMapper } from '../infrastructure/persistence/relational/mappers/fireblocks-error.mapper';
import { UsersModule } from '../../../../users/users.module';

@Global()
@Module({
  imports: [ConfigModule, UsersModule],
  providers: [FireblocksCwService, FireblocksErrorMapper],
  exports: [ConfigModule, FireblocksCwService, FireblocksErrorMapper],
})
export class FireblocksCoreModule {}
