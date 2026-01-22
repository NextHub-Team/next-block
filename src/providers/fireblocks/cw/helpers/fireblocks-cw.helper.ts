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

export function getFireblocksBaseUrl(
  envType: FireblocksEnvironmentType,
): string {
  const key = ENVIRONMENT_URL_KEY[envType] ?? 'SANDBOX';
  return FIREBLOCKS_ENVIRONMENT_BASE_URL[key];
}

export function isRateLimitError(error: any): boolean {
  return Boolean(error?.response?.status === 429);
}

export function isPolicyRejection(error: any): boolean {
  return (
    error?.response?.data?.status === 'REJECTED' ||
    error?.response?.data?.code === 'POLICY_REJECTION'
  );
}

export function isPendingPolicy(error: any): boolean {
  return error?.response?.data?.status === 'PENDING_AUTHORIZATION';
}

export function isInvalidRequest(error: any): boolean {
  const status =
    error?.response?.status ??
    error?.response?.statusCode ??
    error?.status ??
    error?.statusCode;
  const code = error?.response?.data?.code ?? error?.data?.code;
  return (
    status === 400 ||
    status === 404 ||
    status === 422 ||
    code === 11001 ||
    code === '11001' ||
    code === 1504 ||
    code === '1504'
  );
}

export function buildVaultName(
  userId: string | number,
  socialId?: string | null,
): string {
  const suffix =
    typeof socialId === 'string' && socialId.trim().length > 0
      ? socialId.trim()
      : `${userId}`;
  return `user::${suffix}`;
}
