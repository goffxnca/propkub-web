import { useEffect, ChangeEventHandler } from 'react';
import {
  ReactHookFormError,
  ReactHookFormRegister,
  ReactHookFormUnRegister
} from '../../../types/misc/form';
import BaseInput from '../Public/Inputs/BaseInput';

interface SelectOption {
  id: string | number;
  label?: string;
  name?: string;
}

interface SelectInputProps {
  id: string;
  label?: string;
  options: SelectOption[];
  showPreOption?: boolean;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
  error?: ReactHookFormError;
  register?: ReactHookFormRegister;
  unregister?: ReactHookFormUnRegister;
}

const SelectInput = ({
  id,
  label,
  options,
  showPreOption = true,
  value,
  onChange,
  disabled = false,
  error,
  register = () => ({}),
  unregister = () => ({})
}: SelectInputProps) => {
  const inputRingAndBorderStyle = error
    ? 'focus:ring-red-300 border-red-200 focus:border-red-300 '
    : 'focus:ring-indigo-500 focus:border-indigo-500';

  const applyInputAttributes: Partial<
    React.SelectHTMLAttributes<HTMLSelectElement>
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

  return (
    <BaseInput id={id} label={label} error={error}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`mt-1 ${inputRingAndBorderStyle} block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm`}
        {...register()}
        {...applyInputAttributes}
      >
        {showPreOption && <option value="">-</option>}
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name || option.label}
          </option>
        ))}
      </select>
    </BaseInput>
  );
};

export default SelectInput;
