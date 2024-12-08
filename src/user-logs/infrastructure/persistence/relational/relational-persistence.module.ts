import { Module } from '@nestjs/common';
import { UserLogRepository } from '../user-log.repository';
import { UserLogRelationalRepository } from './repositories/user-log.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLogEntity } from './entities/user-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserLogEntity])],
  providers: [
    {
      provide: UserLogRepository,
      useClass: UserLogRelationalRepository,
    },
  ],
  exports: [UserLogRepository],
})
export class RelationalUserLogPersistenceModule {}
