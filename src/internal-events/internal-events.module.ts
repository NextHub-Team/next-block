import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { InternalEventsService } from './internal-events.service';
import { InternalEventsController } from './internal-events.controller';
import { RelationalInternalEventPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { LoggerModule } from '../common/logger/logger.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // do not remove this comment
    ConfigModule,
    LoggerModule,
    RelationalInternalEventPersistenceModule,
  ],
  controllers: [InternalEventsController],
  providers: [InternalEventsService],
  exports: [InternalEventsService, RelationalInternalEventPersistenceModule],
})
export class InternalEventsModule {}
