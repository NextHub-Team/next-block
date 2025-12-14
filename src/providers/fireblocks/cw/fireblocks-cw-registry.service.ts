import { Injectable, Type } from '@nestjs/common';
import { FireblocksCwAdminVaultModule } from './modules/fireblocks-cw-admin-vault.module';
import { FireblocksCwVaultModule } from './modules/fireblocks-cw-vault.module';

const ADMIN_MODULES: Array<Type> = [FireblocksCwAdminVaultModule];

const NON_ADMIN_MODULES: Array<Type> = [FireblocksCwVaultModule];

@Injectable()
export class FireblocksCwRegistryService {
  getAdminModules(): Array<Type> {
    return [...ADMIN_MODULES];
  }

  getNonAdminModules(): Array<Type> {
    return [...NON_ADMIN_MODULES];
  }

  getAllModules(): Array<Type> {
    return [...ADMIN_MODULES, ...NON_ADMIN_MODULES];
  }
}
