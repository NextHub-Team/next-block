// src/config/helpers/create-toggleable-config.ts
import validateConfig from 'src/utils/validate-config';
import { registerAs, ConfigObject } from '@nestjs/config';
import { ClassConstructor } from 'class-transformer';

export interface ToggleableConfigOptions<
  T extends ConfigObject,
  V extends object,
> {
  enableKey: keyof T;
  enableEnvKey: string;
  mapEnabledConfig?: (env: V) => Partial<T>;
  mapDisabledConfig?: () => Partial<T>;
}

export function createToggleableConfig<
  T extends ConfigObject,
  V extends object,
>(
  namespace: string,
  validator: ClassConstructor<V>,
  defaults: T,
  options: ToggleableConfigOptions<T, V>,
) {
  const { enableKey, enableEnvKey, mapEnabledConfig, mapDisabledConfig } =
    options;

  return registerAs<T>(namespace, () => {
    const defaultEnabled = Boolean(defaults[enableKey]);
    const isEnabled = parseBool(process.env[enableEnvKey], defaultEnabled);

    if (!isEnabled) {
      const disabledOverrides = mapDisabledConfig ? mapDisabledConfig() : {};
      return {
        ...defaults,
        ...disabledOverrides,
        [enableKey]: false as T[keyof T],
      };
    }

    const env = validateConfig(process.env, validator) as V;
    const enabledOverrides = mapEnabledConfig ? mapEnabledConfig(env) : {};

    return {
      ...defaults,
      ...enabledOverrides,
      [enableKey]: true as T[keyof T],
    };
  });
}

// Helper: parse a string into a boolean
export function parseBool(
  value: string | undefined,
  defaultValue = false,
): boolean {
  if (!value) return defaultValue;
  switch (value.toLowerCase().trim()) {
    case 'true':
    case '1':
    case 'yes':
    case 'y':
      return true;
    case 'false':
    case '0':
    case 'no':
    case 'n':
      return false;
    default:
      return defaultValue;
  }
}
