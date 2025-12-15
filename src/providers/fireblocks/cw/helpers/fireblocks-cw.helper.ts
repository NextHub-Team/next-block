import { FireblocksEnvironmentType } from '../types/fireblocks-enum.type';
import { FIREBLOCKS_ENVIRONMENT_BASE_URL } from '../types/fireblocks-const.type';

const ENVIRONMENT_URL_KEY: Record<
  FireblocksEnvironmentType,
  keyof typeof FIREBLOCKS_ENVIRONMENT_BASE_URL
> = {
  [FireblocksEnvironmentType.SANDBOX]: 'SANDBOX',
  [FireblocksEnvironmentType.PROD_US]: 'PROD_US',
  [FireblocksEnvironmentType.PROD_EU]: 'PROD_EU',
  [FireblocksEnvironmentType.PROD_EU2]: 'PROD_EU2',
};

export const getFireblocksBaseUrl = (
  envType: FireblocksEnvironmentType,
): string => {
  const key = ENVIRONMENT_URL_KEY[envType] ?? 'SANDBOX';
  return FIREBLOCKS_ENVIRONMENT_BASE_URL[key];
};

export const isRateLimitError = (error: any): boolean =>
  Boolean(error?.response?.status === 429);

export const isPolicyRejection = (error: any): boolean =>
  error?.response?.data?.status === 'REJECTED' ||
  error?.response?.data?.code === 'POLICY_REJECTION';

export const isPendingPolicy = (error: any): boolean =>
  error?.response?.data?.status === 'PENDING_AUTHORIZATION';

export const isInvalidRequest = (error: any): boolean => {
  const status = error?.response?.status;
  return status === 400 || status === 404 || status === 422;
};
