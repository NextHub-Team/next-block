import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../../core/fireblocks-core.module';
import { AdminSecurityService } from './admin-security.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [AdminSecurityService],
  exports: [AdminSecurityService],
})
export class AdminSecurityModule {}
