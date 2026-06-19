import { useCallback } from 'react';
import {
  useForm as useRHForm,
  UseFormProps,
  FieldValues,
  DefaultValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { useUIStore } from '../../application/stores/ui.store';

interface UseAppFormProps<T extends FieldValues> {
  schema: ZodSchema;
  defaultValues?: DefaultValues<T>;
  onSubmit: (data: T) => Promise<void>;
}

export function useAppForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
}: UseAppFormProps<T>) {
  const showToast = useUIStore((s) => s.showToast);

  const form = useRHForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = useCallback(
    async (data: T) => {
      try {
        await onSubmit(data);
      } catch (err) {
        showToast('error', (err as Error).message);
      }
    },
    [onSubmit, showToast]
  );

  return {
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
    errors: form.formState.errors,
  };
}
