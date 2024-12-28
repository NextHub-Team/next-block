import { UsersModule } from '../users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { UserLogsService } from './user-logs.service';
import { UserLogsController } from './user-logs.controller';
import { RelationalUserLogPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
	imports: [
		forwardRef(() => UsersModule),

		// import modules, etc.
		RelationalUserLogPersistenceModule,
	],
	controllers: [UserLogsController],
	providers: [UserLogsService],
	exports: [UserLogsService, RelationalUserLogPersistenceModule],
})
export class UserLogsModule {}
