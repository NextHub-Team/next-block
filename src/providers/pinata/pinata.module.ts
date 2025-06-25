// src/providers/pinata/pinata.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { pinataConfig } from './config/pinata.config';
import { PinataService } from './pinata.service';
import { PinataController } from './pinata.controller';

@Module({
  imports: [ConfigModule.forFeature(pinataConfig)],
  providers: [PinataService],
  controllers: [PinataController],
  exports: [PinataService],
})
export class PinataModule {}
