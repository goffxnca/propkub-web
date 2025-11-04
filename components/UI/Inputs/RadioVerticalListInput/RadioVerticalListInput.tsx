import { useEffect } from 'react';
import {
  ReactHookFormError,
  ReactHookFormRegister,
  ReactHookFormUnRegister
} from '../../../../types/misc/form';
import type { UseFormSetValue } from 'react-hook-form';
import BaseInput from '../BaseInput';
import RadioVerticalListDetail from './RadioVerticalListDetail';

interface RadioVerticalListItem {
  id: string | number;
  name: string;
  description?: string;
}

interface RadioVerticalListInputProps {
  id: string;
  label?: string;
  items?: RadioVerticalListItem[];
  error?: ReactHookFormError;
  register?: ReactHookFormRegister;
  unregister?: ReactHookFormUnRegister;
  setValue?: UseFormSetValue<any>;
}

const RadioVerticalListInput = ({
  id,
  label,
  items = [],
  error,
  register = () => ({}),
  unregister = () => ({}),
  setValue
}: RadioVerticalListInputProps) => {
  useEffect(() => {
    return () => {
      unregister(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeHandler = (val: string | number) => {
    if (setValue) {
      setValue(id, val, { shouldValidate: true });
    }
  };

  return (
    <BaseInput id={id} label={label} error={error}>
      <div className="relative">
        <input id={id} type="text" name={id} {...register()} hidden />

        <div className="mt-1">
          <RadioVerticalListDetail
            items={items}
            error={error}
            onChange={onChangeHandler}
          />
        </div>
      </div>
    </BaseInput>
  );
};

export default RadioVerticalListInput;
