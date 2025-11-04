import { useEffect } from 'react';
import {
  ReactHookFormError,
  ReactHookFormRegister,
  ReactHookFormUnRegister
} from '../../../types/misc/form';
import BaseInput from '../Public/Inputs/BaseInput';

interface CheckboxInputProps {
  id: string;
  label?: string;
  register?: ReactHookFormRegister;
  unregister?: ReactHookFormUnRegister;
  error?: ReactHookFormError;
}

const CheckboxInput = ({
  id,
  label,
  register = () => ({}),
  unregister = () => ({}),
  error
}: CheckboxInputProps) => {
  useEffect(() => {
    return () => {
      unregister(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseInput id={id} error={error}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id}
            name={id}
            type="checkbox"
            {...register(id)}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
          />
        </div>
        <div className="ml-1.5 text-sm">
          <label
            htmlFor={id}
            className="text-gray-700 cursor-pointer select-none"
          >
            {label}
          </label>
        </div>
      </div>
    </BaseInput>
  );
};

export default CheckboxInput;
