import { useEffect } from 'react';
import BaseInput from './BaseInput';

const CheckboxInput = ({
  id,
  groupId,
  label,
  register = () => ({}),
  unregister = () => ({}),
  error
}) => {
  useEffect(() => {
    return () => {
      unregister(id);
    };
  }, []);

  return (
    <BaseInput id={id} error={error?.message}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id}
            name={id}
            type="checkbox"
            {...register(groupId ? `${groupId}.${id}` : id)}
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
