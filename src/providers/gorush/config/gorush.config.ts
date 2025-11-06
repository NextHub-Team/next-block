import { IsString, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { GorushConfig } from './gorush-config.type';
import {
  GORUSH_ENABLE,
  GORUSH_URL,
  GORUSH_TIMEOUT_INTERVAL,
} from '../types/gorush-const.type';
import { createToggleableConfig } from '../../../config/config.helper';

class EnvironmentVariablesValidator {
  @IsString()
  GORUSH_URL: string;

  @IsBoolean()
  GORUSH_ENABLE: boolean;

  @IsInt()
  @Min(5000)
  @Max(10000)
  GORUSH_REQUEST_TIMEOUT: number;
}

const defaults: GorushConfig = {
  baseUrl: GORUSH_URL,
  requestTimeOut: GORUSH_TIMEOUT_INTERVAL,
  enable: GORUSH_ENABLE,
};

export default createToggleableConfig<GorushConfig, EnvironmentVariablesValidator>(
  'gorush',
  EnvironmentVariablesValidator,
  defaults,
  {
    enableKey: 'enable',
    enableEnvKey: 'GORUSH_ENABLE',
    mapEnabledConfig: (env) => ({
      baseUrl: env.GORUSH_URL ?? defaults.baseUrl,
      requestTimeOut: env.GORUSH_REQUEST_TIMEOUT ?? defaults.requestTimeOut,
    }),
  },
);
