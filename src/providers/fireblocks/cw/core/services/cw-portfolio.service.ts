import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { FireblocksCwService } from '../../fireblocks-cw.service';

@Injectable()
export class CwPortfolioService {
  private readonly logger = new Logger(CwPortfolioService.name);

  constructor(
    @Inject(forwardRef(() => FireblocksCwService))
    private readonly client: FireblocksCwService,
  ) {}
}
