import { FireblocksEnvironmentType } from './fireblocks-enum.type';

export type FireblocksClientOptions = {
  enable: boolean;
  apiKey: string;
  secretKey: string;
  envType: FireblocksEnvironmentType;
};
