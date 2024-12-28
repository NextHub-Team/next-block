import { UsersModule } from '../users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { RelationalPermissionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
	imports: [
		forwardRef(() => UsersModule),
		// import modules, etc.
		RelationalPermissionPersistenceModule,
	],
	controllers: [PermissionsController],
	providers: [PermissionsService],
	exports: [PermissionsService, RelationalPermissionPersistenceModule],
})
export class PermissionsModule {}
