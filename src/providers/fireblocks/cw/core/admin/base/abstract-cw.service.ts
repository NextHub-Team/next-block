import { AbstractAdminService } from './abstract-admin.service';
import { FireblocksCwService } from '../../../fireblocks-cw.service';

export abstract class AbstractCwService extends AbstractAdminService {
  protected constructor(
    context: string,
    protected readonly client: FireblocksCwService,
  ) {
    super(context);
  }

  protected debugBasePath(): void {
    this.debug(`Using basePath ${this.client.getOptions().basePath}`);
  }
}
