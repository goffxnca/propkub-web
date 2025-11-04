import { ReactNode } from 'react';
import { ReactHookFormError } from '../../../../types/misc/form';

interface BaseInputProps {
  id: string;
  label?: string;
  error?: ReactHookFormError;
  info?: string;
  counter?: number;
  children?: ReactNode;
}

const BaseInput = ({
  id,
  label,
  error,
  info,
  counter = 0,
  children
}: BaseInputProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div>{children ? children : <p>Default BaseInput Children</p>}</div>
      <div className="flex justify-between">
        {error && (
          <p className="text-red-400 text-xs py-1 w-full">{`${error?.message || ''}`}</p>
        )}
        {counter > 0 && (
          <p className="text-gray-500 text-xs py-1 w-full text-right">
            {counter}
          </p>
        )}
      </div>

      {info && <p className="text-gray-400 text-xs py-1 font-light">{info}</p>}
    </div>
  );
};

export default BaseInput;
