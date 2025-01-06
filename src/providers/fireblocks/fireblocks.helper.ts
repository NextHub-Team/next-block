import { BasePath } from '@fireblocks/ts-sdk';

/**
 * Determines the base path based on the environment mode.
 *
 * @param envMode - The current environment mode (e.g., 'production', 'staging').
 * @param productionBase - The base path for production environments (default: BasePath.EU).
 * @param fallbackBase - The fallback base path for non-production environments (default: BasePath.US).
 * @returns The appropriate base path for the given environment mode.
 */
export const basePathHelper = (
  envMode: string,
  productionBase: BasePath = BasePath.EU,
  fallbackBase: BasePath = BasePath.US,
): BasePath => {
  return envMode === 'production' ? productionBase : fallbackBase;
};
