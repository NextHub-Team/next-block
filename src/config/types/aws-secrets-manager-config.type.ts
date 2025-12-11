export interface AwsSecretsManagerConfig {
  enable: boolean;
  region: string;
  secretIds: string[];
  setToEnv: boolean;
  debug: boolean;
}
