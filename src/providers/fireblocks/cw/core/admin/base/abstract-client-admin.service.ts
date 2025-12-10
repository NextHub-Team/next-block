import { AbstractAdminService } from './abstract-admin.service';
import { FireblocksClientService } from '../../shared/fireblocks-client.service';

export abstract class AbstractClientAdminService extends AbstractAdminService {
  protected constructor(
    context: string,
    protected readonly client: FireblocksClientService,
  ) {
    super(context);
  }

  protected debugBasePath(): void {
    this.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }
}
