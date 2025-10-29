import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegisterReturn,
  UseFormUnregister
} from 'react-hook-form';

export type ReactHookFormRegister = () => Partial<UseFormRegisterReturn>;
export type ReactHookFormUnRegister = UseFormUnregister<FieldValues>;

export type ReactHookFormError =
  | FieldError
  | Merge<FieldError, FieldErrorsImpl<any>>;
