import { ModuleMetadata, Type } from '@nestjs/common';
import { AwsSnsConfig } from './aws-sns-config.type';

/**
 * Factory interface for creating AWS SNS consumer options.
 * Used when configuration is provided via a class.
 */
export interface AwsSnsOptionsFactory {
  createAwsSnsOptions(): AwsSnsConfig | Promise<AwsSnsConfig>;
}

/**
 * Async configuration options for AwsSnsModule.
 * Supports useFactory, useClass, and useExisting patterns.
 */
export interface AwsSnsModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Use an existing provider that implements AwsSnsOptionsFactory
   */
  useExisting?: Type<AwsSnsOptionsFactory>;

  /**
   * Use a class that implements AwsSnsOptionsFactory
   */
  useClass?: Type<AwsSnsOptionsFactory>;

  /**
   * Use a factory function to create AwsSnsConsumerOptions
   */
  useFactory?: (...args: any[]) => AwsSnsConfig | Promise<AwsSnsConfig>;

  /**
   * Providers to inject into the factory function
   */
  inject?: any[];
}
