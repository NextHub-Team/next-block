import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../../fireblocks-core.module';
import { AdminAuditService } from '../services/admin-audit.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [AdminAuditService],
  exports: [AdminAuditService],
})
export class AdminAuditModule {}
