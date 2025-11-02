import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegisterReturn,
  UseFormUnregister
} from 'react-hook-form';

export type ReactHookFormRegister = (
  id?: string
) => Partial<UseFormRegisterReturn>;
export type ReactHookFormUnRegister = UseFormUnregister<FieldValues>;

export type ReactHookFormError =
  | FieldError
  | Merge<FieldError, FieldErrorsImpl<any>>;
