import { Module } from '@nestjs/common';
import { SleevesRepository } from '../sleeves.repository';
import { SleevesRelationalRepository } from './repositories/sleeves.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SleevesEntity } from './entities/sleeves.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SleevesEntity])],
  providers: [
    {
      provide: SleevesRepository,
      useClass: SleevesRelationalRepository,
    },
  ],
  exports: [SleevesRepository],
})
export class RelationalSleevesPersistenceModule {}
