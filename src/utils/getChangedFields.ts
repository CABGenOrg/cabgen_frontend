export function getChangedFields<T extends Record<string, unknown>>(
  initial: T,
  current: T,
): Partial<T> {
  const changed: Record<string, unknown> = {};
  for (const key of Object.keys(current) as (keyof T)[]) {
    if (current[key] !== initial[key] && current[key] !== undefined) {
      changed[key as string] = current[key];
    }
  }
  return changed as Partial<T>;
}
