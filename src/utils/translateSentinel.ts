export const translateSentinel = (
  value: string | null | undefined,
  sentinel: string,
  translated: string,
): string => (value === sentinel ? translated : value ?? "");
