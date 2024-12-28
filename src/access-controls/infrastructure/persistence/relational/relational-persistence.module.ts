import { Module } from '@nestjs/common';
import { AccessControlRepository } from '../access-control.repository';
import { AccessControlRelationalRepository } from './repositories/access-control.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlEntity } from './entities/access-control.entity';

@Module({
	imports: [TypeOrmModule.forFeature([AccessControlEntity])],
	providers: [
		{
			provide: AccessControlRepository,
			useClass: AccessControlRelationalRepository,
		},
	],
	exports: [AccessControlRepository],
})
export class RelationalAccessControlPersistenceModule {}
