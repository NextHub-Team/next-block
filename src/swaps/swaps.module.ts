import { Module } from '@nestjs/common';
import { SwapsController } from './controller/swaps.controller';
import { SwapsService } from './application/swaps.service';
import { ZeroXModule } from './infrastructure/zerox/zerox.module';

@Module({
  imports: [ZeroXModule],
  controllers: [SwapsController],
  providers: [SwapsService],
})
export class SwapsModule {}
