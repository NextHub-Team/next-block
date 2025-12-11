import { FireblocksEnvironmentType } from '../types/fireblocks-enum.type';
import {
  FIREBLOCKS_ENVIRONMENT_BASE_URL,
  FireblocksEnvironmentUrlKey,
} from '../types/fireblocks-const.type';

const FIREBLOCKS_ENV_URL_MAP: Record<
  FireblocksEnvironmentType,
  FireblocksEnvironmentUrlKey
> = {
  [FireblocksEnvironmentType.SANDBOX]: 'SANDBOX',
  [FireblocksEnvironmentType.PROD_US]: 'PROD_US',
  [FireblocksEnvironmentType.PROD_EU]: 'PROD_EU',
};

export const getFireblocksBaseUrl = (
  envType: FireblocksEnvironmentType,
): string => FIREBLOCKS_ENVIRONMENT_BASE_URL[FIREBLOCKS_ENV_URL_MAP[envType]];

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
