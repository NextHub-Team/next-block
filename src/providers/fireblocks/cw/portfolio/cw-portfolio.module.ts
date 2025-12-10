import { Module } from '@nestjs/common';
import { FireblocksCoreModule } from '../core/fireblocks-core.module';
import { CwPortfolioService } from './cw-portfolio.service';

@Module({
  imports: [FireblocksCoreModule],
  providers: [CwPortfolioService],
  exports: [CwPortfolioService],
})
export class CwPortfolioModule {}
