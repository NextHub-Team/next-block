import { Module } from '@nestjs/common';
import { EventLogRepository } from '../event-log.repository';
import { EventLogRelationalRepository } from './repositories/event-log.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventLogEntity } from './entities/event-log.entity';

@Module({
	imports: [TypeOrmModule.forFeature([EventLogEntity])],
	providers: [
		{
			provide: EventLogRepository,
			useClass: EventLogRelationalRepository,
		},
	],
	exports: [EventLogRepository],
})
export class RelationalEventLogPersistenceModule {}
