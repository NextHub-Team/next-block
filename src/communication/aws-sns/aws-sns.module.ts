import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  AwsSnsModuleAsyncOptions,
  AwsSnsOptionsFactory,
} from './config/aws-sns.option';
import {
  AWS_SNS_CONSUMER_OPTIONS,
  AWS_SNS_STRATEGY,
} from './types/aws-sns-const.type';
import { AwsSnsStrategy } from './aws-sns.strategy';
import { AwsSnsService } from './aws-sns.service';

@Module({})
export class AwsSnsModule {
  /**
   * Registers the AWS SNS module using async configuration.
   * Supports useFactory, useClass, and useExisting.
   */
  static forRootAsync(options: AwsSnsModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: AwsSnsModule,
      imports: options.imports || [],
      providers: [
        ...asyncProviders,
        AwsSnsService,
        {
          provide: AWS_SNS_STRATEGY,
          useClass: AwsSnsStrategy,
        },
      ],
      exports: [AWS_SNS_STRATEGY],
    };
  }

  /**
   * Handles creation of async providers for the module.
   * Supports useFactory, useClass, useExisting.
   */
  private static createAsyncProviders(
    options: AwsSnsModuleAsyncOptions,
  ): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: AWS_SNS_CONSUMER_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    if (options.useExisting) {
      return [
        {
          provide: AWS_SNS_CONSUMER_OPTIONS,
          useFactory: async (factory: AwsSnsOptionsFactory) =>
            await factory.createAwsSnsOptions(),
          inject: [options.useExisting],
        },
      ];
    }

    const useClass = options.useClass!;

    return [
      {
        provide: AWS_SNS_CONSUMER_OPTIONS,
        useFactory: async (factory: AwsSnsOptionsFactory) =>
          await factory.createAwsSnsOptions(),
        inject: [useClass],
      },
      {
        provide: useClass,
        useClass,
      },
    ];
  }
}
