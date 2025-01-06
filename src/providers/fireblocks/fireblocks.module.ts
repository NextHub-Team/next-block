import { Module } from '@nestjs/common';
import { FireblocksService } from './fireblocks.service';
import { FireblocksController } from './fireblocks.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SecretModule } from '../../secret/secret.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule, // Import ConfigModule for environment variable access
    SecretModule, // Import SecretModule for secret management
  ],
  controllers: [FireblocksController],
  providers: [
    FireblocksService,
    {
      provide: 'FIREBLOCKS_SECRET_PATH',
      useFactory: (configService: ConfigService) => {
        const envPath = configService.get<string>('FIREBLOCKS_SECRET_PATH', {
          infer: true,
        });

        // Resolve to absolute path if `FIREBLOCKS_SECRET_PATH` is not set
        return envPath || path.join(__dirname, './config/secrets');
      },
      inject: [ConfigService],
    },
  ],
  exports: [FireblocksService],
})
export class FireblocksModule {}
