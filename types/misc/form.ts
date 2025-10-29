import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegisterReturn
} from 'react-hook-form';

export type ReactHookFormRegister = () => Partial<UseFormRegisterReturn>;
export type ReactHookFormUnRegister = (name: string) => void;

export type ReactHookFormError =
  | FieldError
  | Merge<FieldError, FieldErrorsImpl<any>>;
