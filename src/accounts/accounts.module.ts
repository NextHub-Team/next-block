import { UsersModule } from '../users/users.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { RelationalAccountPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,

    // do not remove this comment
    RelationalAccountPersistenceModule,
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService, RelationalAccountPersistenceModule],
})
export class AccountsModule {}
