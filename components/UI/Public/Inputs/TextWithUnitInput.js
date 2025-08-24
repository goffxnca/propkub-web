import { useEffect } from 'react';
import BaseInput from './BaseInput';

const TextWithUnitInput = ({
  id,
  unitId,
  unitDefaultValues = [],
  unitDefaultValue = '',
  unitItems = [],
  unitPrefix = '',
  type = 'number',
  decimalPlaces = 0,
  label,
  placeholder,
  leadingSlot,
  error,
  register = () => ({}),
  registerUnit = () => ({}),
  unregister = () => ({}),
  setValue
}) => {
  useEffect(() => {
    if (unitItems.length === 0) {
      unregister(unitId);
    } else {
      const defaultUnit =
        unitDefaultValue ||
        unitItems.find((u) => unitDefaultValues.includes(u.id))?.id ||
        '';
      if (defaultUnit) {
        if (setValue) {
          setTimeout(() => {
            setValue(unitId, defaultUnit);
          }, 100);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitItems.length]);

  useEffect(() => {
    return () => {
      unregister(id);
      unregister(unitId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputAttributes = {
    step: decimalPlaces === 1 ? 0.1 : decimalPlaces === 2 ? 0.01 : 1
  };

  const inputRingAndBorderStyle = error
    ? 'focus:ring-red-300  border-red-200 focus:border-red-300'
    : 'focus:ring-indigo-500 focus:border-indigo-500';

  return (
    <BaseInput id={id} label={label} error={error?.message}>
      <div>
        <div className="mt-1 relative rounded-md shadow-sm hide-spin">
          {leadingSlot && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{leadingSlot}</span>
            </div>
          )}
          <input
            id={id}
            type={type}
            name={id}
            className={`${inputRingAndBorderStyle} block w-full pr-12 sm:text-sm border-gray-300 rounded-md ${
              leadingSlot && 'pl-7'
            }`}
            placeholder={placeholder}
            {...inputAttributes}
            {...register()}
          />
          {unitItems.length > 0 && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              <select
                id={unitId}
                name={unitId}
                className={`${inputRingAndBorderStyle} h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md ${
                  error && 'rounded-l-none'
                } text-right`}
                {...registerUnit()}
              >
                {unitItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {!item?.ignorePrefix && unitPrefix}
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </BaseInput>
  );
};

export default TextWithUnitInput;
