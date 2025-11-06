import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { createToggleableConfig } from '../../../config/config.helper';
import { SocketIOConfig } from './socketio-config.type';
import {
  SOCKETIO_DEFAULT_ENABLE,
  SOCKETIO_DEFAULT_PING_INTERVAL,
  SOCKETIO_DEFAULT_PING_TIMEOUT,
  SOCKETIO_DEFAULT_MAX_HTTP_BUFFER_SIZE,
  SOCKETIO_DEFAULT_REAUTH_GRACE_MS,
  SOCKETIO_DEFAULT_MAX_REAUTH_TRIES,
} from '../types/socketio-const.type';

class SocketIoEnvironmentVariablesValidator {
  @IsBoolean()
  @IsOptional()
  SOCKETIO_ENABLE?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  SOCKETIO_PING_INTERVAL?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  SOCKETIO_PING_TIMEOUT?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  SOCKETIO_MAX_HTTP_BUFFER_SIZE?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  SOCKETIO_DEFAULT_REAUTH_GRACE_MS?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  SOCKETIO_MAX_REAUTH_TRIES?: number;
}

const defaults: SocketIOConfig = {
  enable: SOCKETIO_DEFAULT_ENABLE,
  pingInterval: SOCKETIO_DEFAULT_PING_INTERVAL,
  pingTimeout: SOCKETIO_DEFAULT_PING_TIMEOUT,
  maxHttpBufferSize: SOCKETIO_DEFAULT_MAX_HTTP_BUFFER_SIZE,
  defaultReauthGraceMs: SOCKETIO_DEFAULT_REAUTH_GRACE_MS,
  maxReauthTries: SOCKETIO_DEFAULT_MAX_REAUTH_TRIES,
};

export default createToggleableConfig<
  SocketIOConfig,
  SocketIoEnvironmentVariablesValidator
>('socketIO', SocketIoEnvironmentVariablesValidator, defaults, {
  enableKey: 'enable',
  enableEnvKey: 'SOCKETIO_ENABLE',
  mapEnabledConfig: (env) => ({
    pingInterval: env.SOCKETIO_PING_INTERVAL ?? defaults.pingInterval,
    pingTimeout: env.SOCKETIO_PING_TIMEOUT ?? defaults.pingTimeout,
    maxHttpBufferSize:
      env.SOCKETIO_MAX_HTTP_BUFFER_SIZE ?? defaults.maxHttpBufferSize,
    defaultReauthGraceMs:
      env.SOCKETIO_DEFAULT_REAUTH_GRACE_MS ?? defaults.defaultReauthGraceMs,
    maxReauthTries: env.SOCKETIO_MAX_REAUTH_TRIES ?? defaults.maxReauthTries,
  }),
});
