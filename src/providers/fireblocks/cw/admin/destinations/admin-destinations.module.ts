import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../../core/fireblocks-core.module';
import { AdminDestinationsService } from './admin-destinations.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [AdminDestinationsService],
  exports: [AdminDestinationsService],
})
export class AdminDestinationsModule {}
