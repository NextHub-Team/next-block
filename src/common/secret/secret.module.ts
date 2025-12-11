import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SecretConfigService } from './secret.service';
import { GLOBAL_SECRET_PATH } from './const.type';
import { AwsSecretsManagerService } from './aws-secrets-manager.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    SecretConfigService,
    AwsSecretsManagerService,
    {
      provide: 'GLOBAL_SECRET_PATH',
      useFactory: (configService: ConfigService) => {
        return (
          configService.get<string>('GLOBAL_SECRET_PATH', { infer: true }) ||
          GLOBAL_SECRET_PATH
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [SecretConfigService, AwsSecretsManagerService],
})
export class SecretManagerModule {}
