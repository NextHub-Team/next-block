import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export const normalizeNumericUserId = (
  id: string | number | null | undefined,
): number | undefined => {
  if (typeof id === 'number' && Number.isFinite(id)) {
    return id;
  }

  if (typeof id === 'string' && id.trim().length > 0) {
    const numeric = Number(id);
    if (!Number.isNaN(numeric)) {
      return numeric;
    }
  }

  return undefined;
};

export const cleanMetadata = (
  metadata: Record<string, unknown>,
): Record<string, unknown> | undefined => {
  const cleaned = Object.fromEntries(
    Object.entries(metadata).filter(([_, value]) => {
      if (value === null || value === undefined) {
        return false;
      }

      if (typeof value === 'string' && value.trim().length === 0) {
        return false;
      }

      return true;
    }),
  );

  return Object.keys(cleaned).length ? cleaned : undefined;
};

export const logFireblocksError = (
  logger: Logger,
  action: string,
  error: unknown,
): void => {
  const message = error instanceof Error ? error.message : `${error}`;
  const errObj = error as any;
  const details =
    errObj?.response?.data ?? errObj?.data ?? errObj?.response ?? undefined;

  let detailsString = '';
  try {
    if (details !== undefined) {
      detailsString =
        typeof details === 'string'
          ? details
          : JSON.stringify(details, null, 2);
    }
  } catch {
    detailsString = `${details ?? ''}`;
  }

  logger.error(
    `[Fireblocks] ${action} failed: ${message}${
      errObj?.response?.status ? ` (status=${errObj.response.status})` : ''
    }`,
    detailsString,
  );
};

export const getFireblocksMessage = (error: unknown): string | undefined => {
  const errObj = error as any;
  const candidate =
    errObj?.response?.data?.errorMessage ??
    errObj?.response?.data?.message ??
    errObj?.data?.errorMessage ??
    errObj?.data?.message ??
    errObj?.message;

  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return candidate;
  }
  return undefined;
};

export const ensureIdempotencyKey = (key?: string): string =>
  key && key.trim().length > 0 ? key.trim() : uuidv4();
