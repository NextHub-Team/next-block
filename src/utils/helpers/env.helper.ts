export function mapEnvType<T>(
  input: string | undefined,
  mapping: Record<string, T>,
  defaultValue: T,
): T {
  if (!input) return defaultValue;
  const v = input.trim().toLowerCase();
  return mapping[v] ?? defaultValue;
}

export function booleanValidator(
  value: string | undefined | boolean,
  defaultValue: boolean,
): boolean {
  if (typeof value === 'boolean') return value;
  const v = value?.trim().toLowerCase();
  if (!v) return defaultValue;
  if (v === 'true') return true;
  if (v === 'false') return false;
  return defaultValue;
}

/**
 * Parses a number from string or number.
 * - Returns defaultValue if value is undefined/empty/whitespace or not a valid finite number.
 * - Accepts integers and floats (e.g., "10", "10.5", "-3").
 * - Rejects NaN / Infinity.
 */
export function numberValidator(
  value: string | undefined | number,
  defaultValue: number,
): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : defaultValue;
  }

  const v = value?.trim();
  if (!v) return defaultValue;

  const n = Number(v);
  return Number.isFinite(n) ? n : defaultValue;
}
