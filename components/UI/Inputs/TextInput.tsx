import {
  useEffect,
  useState,
  ReactNode,
  ChangeEventHandler,
  KeyboardEventHandler
} from 'react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import {
  ReactHookFormError,
  ReactHookFormRegister,
  ReactHookFormUnRegister
} from '@/types/misc/form';
import BaseInput from './BaseInput';

interface TextInputProps {
  id: string;
  type?: 'text' | 'password' | 'email' | 'tel' | 'number';
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  onKeyPress?: KeyboardEventHandler<HTMLInputElement>;
  leadingSlot?: ReactNode;
  tailingSlot?: ReactNode;
  error?: ReactHookFormError;
  info?: string;
  register?: ReactHookFormRegister;
  unregister?: ReactHookFormUnRegister;
  children?: ReactNode;
  spacingY?: boolean;
}

const TextInput = ({
  id,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  onKeyPress,
  leadingSlot,
  tailingSlot,
  error,
  info,
  register = () => ({}),
  unregister = () => ({}),
  children,
  spacingY = false
}: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRingAndBorderStyle = error
    ? 'focus:ring-red-300  border-red-200 focus:border-red-300'
    : 'focus:ring-indigo-500 focus:border-indigo-500';

  const disabledStyle = disabled ? 'bg-gray-50 text-gray-500' : '';

  const textboxSpacingY = spacingY ? 'py-3' : '';

  const applyInputAttributes: Partial<
    React.InputHTMLAttributes<HTMLInputElement>
  > = {};
  if (disabled) {
    applyInputAttributes.disabled = true;
  }

  useEffect(() => {
    return () => {
      unregister(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <BaseInput id={id} label={label} error={error} info={info}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{leadingSlot}</span>
        </div>
        <input
          id={id}
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          name={id}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onKeyPress={onKeyPress}
          className={`mt-1 ${textboxSpacingY} ${inputRingAndBorderStyle} block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${disabledStyle} ${
            leadingSlot && 'pl-7'
          } ${type === 'password' ? 'pr-10' : ''}`}
          {...register()}
          {...applyInputAttributes}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {type === 'password' && !disabled && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-500 focus:outline-none relative"
              style={{ zIndex: 1 }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          )}
          <span className="text-gray-500 sm:text-sm">{tailingSlot}</span>
        </div>
        {children}
      </div>
    </BaseInput>
  );
};

export default TextInput;
