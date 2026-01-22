import { registerAs } from '@nestjs/config';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import validateConfig from '../../../utils/validate-config';
import { AwsSnsConfig } from './aws-sns-config.type';
import {
  booleanValidator,
  numberValidator,
} from 'src/utils/helpers/env.helper';
import { AWS_SNS_DEFAULTS } from '../types/aws-sns-const.type';

// Validator class for env vars
class AwsSnsEnvironmentVariablesValidator {
  @IsBoolean()
  @IsOptional()
  AWS_SNS_ENABLE?: boolean;

  @IsString()
  @IsOptional()
  AWS_REGION?: string;

  @IsString()
  @IsOptional()
  AWS_SQS_QUEUE_URL?: string;

  @IsInt()
  @IsOptional()
  AWS_SQS_POLL_INTERVAL?: number;

  @IsInt()
  @IsOptional()
  AWS_SQS_MAX_MESSAGES?: number;

  @IsInt()
  @IsOptional()
  AWS_SQS_VISIBILITY_TIMEOUT?: number;

  @IsInt()
  @IsOptional()
  AWS_SQS_WAIT_TIME_SECONDS?: number;
}

export default registerAs<AwsSnsConfig>('awsSns', () => {
  validateConfig(process.env, AwsSnsEnvironmentVariablesValidator);

  return {
    enableAwsSns: booleanValidator(
      process.env.AWS_SNS_ENABLE,
      AWS_SNS_DEFAULTS.ENABLE,
    ),
    awsRegion: process.env.AWS_REGION?.trim() || AWS_SNS_DEFAULTS.REGION,
    sqsQueueUrl: process.env.AWS_SQS_QUEUE_URL?.trim() || '',

    sqsPollingInterval: numberValidator(
      process.env.AWS_SQS_POLL_INTERVAL,
      AWS_SNS_DEFAULTS.POLL_INTERVAL,
    ),

    sqsMaxMessages: numberValidator(
      process.env.AWS_SQS_MAX_MESSAGES,
      AWS_SNS_DEFAULTS.MAX_MESSAGES,
    ),

    sqsVisibilityTimeout: numberValidator(
      process.env.AWS_SQS_VISIBILITY_TIMEOUT,
      AWS_SNS_DEFAULTS.VISIBILITY_TIMEOUT,
    ),

    sqsWaitTimeSeconds: numberValidator(
      process.env.AWS_SQS_WAIT_TIME_SECONDS,
      AWS_SNS_DEFAULTS.WAIT_TIME_SECONDS,
    ),
  };
});
