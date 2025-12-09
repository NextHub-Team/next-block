import { FireblocksEnvironmentType } from '../types/fireblocks-enum.type';

export type FireblocksConfig = {
  enable: boolean;
  apiKey: string;
  secretKey: string;
  basePath: string;
  envType: FireblocksEnvironmentType;
};
