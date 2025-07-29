import { Module } from '@nestjs/common';
import { SwapRelationalRepository } from './repositories/swap-relational.repository';

@Module({
  providers: [SwapRelationalRepository],
  exports: [SwapRelationalRepository],
})
export class RelationalPersistenceModule {}
