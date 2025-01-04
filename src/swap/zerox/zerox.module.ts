import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SwapController } from './zerox.controller';
import { ZeroxService } from './zerox.service';
// import { FireblocksModule } from '../../fireblocks/fireblocks.module';

@Module({
  // imports: [HttpModule, FireblocksModule],
  imports: [HttpModule],
  controllers: [SwapController],
  providers: [ZeroxService],
})
export class SwapModule {}
