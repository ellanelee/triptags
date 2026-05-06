export function requiredString(
  value: string | null | undefined,
  message: string,
) {
  if (value === null || value === undefined) throw new Error(message)
  return value
}

export function requiredValue<T>(
  value: T | null | undefined,
  message: string,
): T {
  if (value === null || value === undefined) throw new Error(message)
  return value
}
