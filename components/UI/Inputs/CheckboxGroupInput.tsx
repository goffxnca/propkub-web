import {
  ReactHookFormError,
  ReactHookFormRegister,
  ReactHookFormUnRegister
} from '@/types/misc/form';
import { useEffect } from 'react';
import BaseInput from './BaseInput';
import CheckboxInput from './CheckboxInput';

interface CheckboxGroupItem {
  id: string;
  label: string;
}

interface CheckboxGroupInputProps {
  id: string;
  groupLabel: string;
  items: CheckboxGroupItem[];
  error?: ReactHookFormError;
  register?: ReactHookFormRegister;
  unregister?: ReactHookFormUnRegister;
}

const CheckboxGroupInput = ({
  id,
  groupLabel,
  items,
  error,
  register = () => ({}),
  unregister = () => ({})
}: CheckboxGroupInputProps) => {
  useEffect(() => {
    return () => {
      unregister(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    // TODO: Will make this component support parent level error later ex. when there's no checkboxes in this group selected
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
              register={() => register(`${id}.${item.id}`)}
              unregister={unregister}
            />
          ))}
        </div>
      </fieldset>
    </BaseInput>
  );
};

export default CheckboxGroupInput;
