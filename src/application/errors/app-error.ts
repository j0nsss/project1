export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export type AppErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'DATABASE_ERROR'
  | 'DUPLICATE_ENTRY'
  | 'BUSINESS_RULE_ERROR'
  | 'UNKNOWN_ERROR';

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
