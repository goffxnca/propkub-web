import { useEffect } from 'react';
import BaseInput from './BaseInput';
import CheckboxInput from './CheckboxInput';

const CheckboxGroupInput = ({
  id,
  groupLabel,
  items,
  register = () => ({}),
  unregister = () => ({})
}) => {
  useEffect(() => {
    return () => {
      unregister(id);
    };
  }, [items]);

  return (
    <BaseInput id={id}>
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-1">
          {groupLabel}
        </legend>
        <div className="flex gap-4 flex-wrap">
          {items.map((item) => (
            <CheckboxInput
              key={item.id}
              id={item.id}
              label={item.label}
              groupId={id}
              register={register}
              unregister={unregister}
            />
          ))}
        </div>
      </fieldset>
    </BaseInput>
  );
};

export default CheckboxGroupInput;
