import { AccessControlsModule } from '../access-controls/access-controls.module';
import { UserLogsModule } from '../user-logs/user-logs.module';
import { MainWalletsModule } from '../main-wallets/main-wallets.module';
import { DevicesModule } from '../devices/devices.module';
import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FilesModule } from '../files/files.module';

const infrastructurePersistenceModule = RelationalUserPersistenceModule;

@Module({
	imports: [
		forwardRef(() => AccessControlsModule),
		forwardRef(() => UserLogsModule),
		forwardRef(() => MainWalletsModule),
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
