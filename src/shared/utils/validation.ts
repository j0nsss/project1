import { ZodError } from 'zod';

export function getZodErrorMessage(error: ZodError): string {
  return error.errors
    .map((e) => `${e.path.join('.')}: ${e.message}`)
    .join('\n');
}

export function getFirstZodError(error: ZodError): string {
  const first = error.errors[0];
  return first ? first.message : 'Validasi gagal';
}
