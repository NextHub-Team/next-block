export interface SocketIOConfig {
  enable: boolean;
  pingInterval: number;
  pingTimeout: number;
  maxHttpBufferSize: number;
  defaultReauthGraceMs: number;
  maxReauthTries: number;
}
