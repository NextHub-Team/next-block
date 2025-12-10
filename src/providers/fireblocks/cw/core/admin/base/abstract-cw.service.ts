import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../../../../../config/config.type';
import { AbstractAdminService } from './abstract-admin.service';

export abstract class AbstractCwService extends AbstractAdminService {
  protected constructor(
    context: string,
    protected readonly configService: ConfigService<AllConfigType>,
  ) {
    super(context);
  }

  protected debugBasePath(): void {
    const basePath = this.configService.get('fireblocks.basePath', { infer: true }) ?? '';
    this.debug(`Using basePath ${basePath}`);
  }
}
