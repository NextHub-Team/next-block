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
  value: string | undefined,
  defaultValue: boolean,
): boolean {
  const v = value?.trim();
  if (!v) return defaultValue;

  // strict: only "true" => true, anything else => false
  return v.toLowerCase() === 'true';
}

/**
 * Parses a number from string.
 * - Returns defaultValue if value is undefined/empty/whitespace or not a valid finite number.
 * - Accepts integers and floats (e.g., "10", "10.5", "-3").
 * - Rejects NaN / Infinity.
 */
export function numberValidator(
  value: string | undefined | number,
  defaultValue: number,
): number {
  const v = value?.trim();
  if (!v) return defaultValue;

  const n = Number(v);
  return Number.isFinite(n) ? n : defaultValue;
}
