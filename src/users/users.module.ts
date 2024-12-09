import { TransactionsModule } from '../transactions/transactions.module';
import { UserLogsModule } from '../user-logs/user-logs.module';
import { MainWalletsModule } from '../main-wallets/main-wallets.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { DevicesModule } from '../devices/devices.module';
import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FilesModule } from '../files/files.module';

const infrastructurePersistenceModule = RelationalUserPersistenceModule;

@Module({
  imports: [
    forwardRef(() => TransactionsModule),
    forwardRef(() => UserLogsModule),
    forwardRef(() => MainWalletsModule),
    forwardRef(() => PermissionsModule),
    forwardRef(() => DevicesModule),
    // import modules, etc.
    infrastructurePersistenceModule,
    FilesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
