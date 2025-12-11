import { Module, forwardRef } from '@nestjs/common';
import { FireblocksCoreModule } from '../fireblocks-core.module';
import { CwPortfolioService } from '../services/cw-portfolio.service';

@Module({
  imports: [forwardRef(() => FireblocksCoreModule)],
  providers: [CwPortfolioService],
  exports: [CwPortfolioService],
})
export class CwPortfolioModule {}
