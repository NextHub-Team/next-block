import { Module } from '@nestjs/common';
import { EventLogsService } from './event-logs.service';
import { EventLogsController } from './event-logs.controller';
import { RelationalEventLogPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalEventLogPersistenceModule,
  ],
  controllers: [EventLogsController],
  providers: [EventLogsService],
  exports: [EventLogsService, RelationalEventLogPersistenceModule],
})
export class EventLogsModule {}
