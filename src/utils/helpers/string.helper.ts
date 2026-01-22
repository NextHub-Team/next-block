// Helper: capitalize the first character of a string
export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function isEmpty(value: string): boolean {
  return value.length > 0 ? false : true;
}
