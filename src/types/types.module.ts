import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { RelationalTypePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalTypePersistenceModule,
  ],
  controllers: [TypesController],
  providers: [TypesService],
  exports: [TypesService, RelationalTypePersistenceModule],
})
export class TypesModule {}
