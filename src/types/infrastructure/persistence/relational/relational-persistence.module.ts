import { Module } from '@nestjs/common';
import { TypeRepository } from '../type.repository';
import { TypeRelationalRepository } from './repositories/type.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeEntity } from './entities/type.entity';

@Module({
	imports: [TypeOrmModule.forFeature([TypeEntity])],
	providers: [
		{
			provide: TypeRepository,
			useClass: TypeRelationalRepository,
		},
	],
	exports: [TypeRepository],
})
export class RelationalTypePersistenceModule {}
