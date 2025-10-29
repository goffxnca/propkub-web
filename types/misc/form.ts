import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

export type ReactHookFormError =
  | FieldError
  | Merge<FieldError, FieldErrorsImpl<any>>;
