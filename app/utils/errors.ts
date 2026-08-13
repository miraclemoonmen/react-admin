export function isFormValidationError(
  error: unknown,
): error is { errorFields: unknown[] } {
  return (
    typeof error === "object" &&
    error !== null &&
    "errorFields" in error &&
    Array.isArray(error.errorFields)
  );
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
