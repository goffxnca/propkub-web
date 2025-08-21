import { useEffect } from 'react';
import BaseInput from '../BaseInput';
import RadioVerticalListDetail from './RadioVerticalListDetail';

const RadioVerticalListInput = ({
  id,
  label,
  items = [],
  error,
  register = () => ({}),
  unregister = () => ({}),
  setValue
}) => {
  useEffect(() => {
    return () => {
      unregister(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeHandler = (val) => {
    setValue(id, val, { shouldValidate: true });
  };

  return (
    <BaseInput id={id} label={label} error={error?.message}>
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
