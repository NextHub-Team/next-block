import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../../fireblocks-core.module';
import { AdminDestinationsService } from '../services/admin-destinations.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [AdminDestinationsService],
  exports: [AdminDestinationsService],
})
export class AdminDestinationsModule {}
