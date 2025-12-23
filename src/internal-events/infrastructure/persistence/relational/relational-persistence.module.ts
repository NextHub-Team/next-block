import { Module } from '@nestjs/common';
import { InternalEventRepository } from '../internal-event.repository';
import { InternalEventRelationalRepository } from './repositories/internal-event.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternalEventEntity } from './entities/internal-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InternalEventEntity])],
  providers: [
    {
      provide: InternalEventRepository,
      useClass: InternalEventRelationalRepository,
    },
  ],
  exports: [InternalEventRepository],
})
export class RelationalInternalEventPersistenceModule {}
