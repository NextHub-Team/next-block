import { PermissionsModule } from '../permissions/permissions.module';
import { StatusesModule } from '../statuses/statuses.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { AccessControlsService } from './access-controls.service';
import { AccessControlsController } from './access-controls.controller';
import { RelationalAccessControlPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
	imports: [
		PermissionsModule,
		StatusesModule,
		RolesModule,
		forwardRef(() => UsersModule),
		// import modules, etc.
		RelationalAccessControlPersistenceModule,
	],
	controllers: [AccessControlsController],
	providers: [AccessControlsService],
	exports: [AccessControlsService, RelationalAccessControlPersistenceModule],
})
export class AccessControlsModule {}
