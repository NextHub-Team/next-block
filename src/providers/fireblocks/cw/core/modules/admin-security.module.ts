import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../fireblocks-core.module';
import { AdminSecurityService } from '../services/admin-security.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [AdminSecurityService],
  exports: [AdminSecurityService],
})
export class AdminSecurityModule {}
