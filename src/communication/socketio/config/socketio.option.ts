import { ConfigService } from '@nestjs/config';
import { SocketIOConfig } from './socketio-config.type';
import { SOCKETIO_DEFAULT_ENABLE } from '../types/socketio-const.type';

export function socketIoOptionsFactory(
  configService: ConfigService,
): SocketIOConfig {
  return {
    enable:
      configService.get<boolean>('socketIO.enable', { infer: true }) ??
      SOCKETIO_DEFAULT_ENABLE,
    pingInterval: configService.get<number>('socketIO.pingInterval', {
      infer: true,
    }),
    pingTimeout: configService.get<number>('socketIO.pingTimeout', {
      infer: true,
    }),
    maxHttpBufferSize: configService.get<number>('socketIO.maxHttpBufferSize', {
      infer: true,
    }),
    defaultReauthGraceMs: configService.get<number>(
      'socketIO.defaultReauthGraceMs',
      { infer: true },
    ),
    maxReauthTries: configService.get<number>('socketIO.maxReauthTries', {
      infer: true,
    }),
  };
}
