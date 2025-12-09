import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../../core/fireblocks-core.module';
import { AdminAuditService } from './admin-audit.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [AdminAuditService],
  exports: [AdminAuditService],
})
export class AdminAuditModule {}
