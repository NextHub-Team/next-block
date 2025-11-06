// src/config/helpers/create-toggleable-config.ts
import validateConfig from 'src/utils/validate-config';
import { registerAs, ConfigObject } from '@nestjs/config';
import { ClassConstructor } from 'class-transformer';

type EnvKeyOverrides<T> = Partial<Record<keyof T, string>>;

function toEnvKey(propertyKey: string): string {
  return propertyKey
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toUpperCase();
}

export function createToggleableConfig<T extends ConfigObject>(
  namespace: string,
  validator: ClassConstructor<any>,
  defaults: T,
  enableKey: keyof T,
  enableEnvKey: string,
  envKeyOverrides: EnvKeyOverrides<T> = {},
  postProcess?: (resolved: T) => T,
) {
  return registerAs<T>(namespace, () => {
    const enableEnvValue = process.env[enableEnvKey];
    const defaultEnabled = Boolean(defaults[enableKey]);
    const isEnabled = parseBool(enableEnvValue, defaultEnabled);

    const resolved = {
      ...defaults,
      ...loadEnvOverrides(defaults, enableKey, envKeyOverrides),
      [enableKey]: isEnabled,
    } as T;

    if (isEnabled) {
      validateConfig(process.env, validator);
    }

    return postProcess ? postProcess(resolved) : resolved;
  });
}

// Optional: helper to load overrides dynamically
function loadEnvOverrides<T>(
  defaults: T,
  enableKey: keyof T,
  envKeyOverrides: EnvKeyOverrides<T>,
): Partial<T> {
  const overrides: Partial<T> = {};
  for (const key of Object.keys(defaults as object) as Array<keyof T>) {
    if (key === enableKey) {
      continue;
    }

    const envKey = envKeyOverrides[key] ?? toEnvKey(String(key));
    const rawValue = envKey ? process.env[envKey] : undefined;

    if (rawValue === undefined) {
      continue;
    }

    overrides[key] = parseEnvValue(defaults[key], rawValue) as T[keyof T];
  }
  return overrides;
}

// Small type converter
function parseEnvValue(originalValue: any, envValue: string) {
  if (typeof originalValue === 'boolean') {
    return parseBool(envValue, originalValue);
  }
  if (typeof originalValue === 'number') {
    const parsed = Number(envValue);
    return Number.isFinite(parsed) ? parsed : originalValue;
  }
  return envValue;
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
