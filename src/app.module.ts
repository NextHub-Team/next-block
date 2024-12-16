import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './mail/config/mail.config';
import fileConfig from './files/config/file.config';
import googleConfig from './auth-google/config/google.config';
import appleConfig from './auth-apple/config/apple.config';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthAppleModule } from './auth-apple/auth-apple.module';
import { AuthGoogleModule } from './auth-google/auth-google.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MailModule } from './mail/mail.module';
import { HomeModule } from './home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from './config/config.type';
import { SessionModule } from './session/session.module';
import { MailerModule } from './mailer/mailer.module';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});

import { DevicesModule } from './devices/devices.module';

import { PermissionsModule } from './permissions/permissions.module';

import { MainWalletsModule } from './main-wallets/main-wallets.module';

import { PassphrasesModule } from './passphrases/passphrases.module';

import { WalletsModule } from './wallets/wallets.module';

import { SupportedAssetsModule } from './supported-assets/supported-assets.module';

import { UserLogsModule } from './user-logs/user-logs.module';

import { SwapTransactionsModule } from './swap-transactions/swap-transactions.module';

import { OrderTransactionsModule } from './order-transactions/order-transactions.module';

import { TransferTransactionsModule } from './transfer-transactions/transfer-transactions.module';

import { NftTransactionsModule } from './nft-transactions/nft-transactions.module';

import { EventLogsModule } from './event-logs/event-logs.module';

import { NftsModule } from './nfts/nfts.module';

import { TransactionLogsModule } from './transaction-logs/transaction-logs.module';

import { AccessControlsModule } from './access-controls/access-controls.module';

import { TypesModule } from './types/types.module';

import { StatusesModule } from './statuses/statuses.module';

import { RolesModule } from './roles/roles.module';

import { WhiteListAddressesModule } from './white-list-addresses/white-list-addresses.module';

import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    NotificationsModule,
    WhiteListAddressesModule,
    RolesModule,
    StatusesModule,
    TypesModule,
    PermissionsModule,
    AccessControlsModule,
    TransactionLogsModule,
    NftsModule,
    EventLogsModule,
    NftTransactionsModule,
    TransferTransactionsModule,
    OrderTransactionsModule,
    SwapTransactionsModule,
    UserLogsModule,
    SupportedAssetsModule,
    WalletsModule,
    PassphrasesModule,
    MainWalletsModule,
    PermissionsModule,
    DevicesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        googleConfig,
        appleConfig,
      ],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    AuthGoogleModule,
    AuthAppleModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
  ],
})
export class AppModule {}
