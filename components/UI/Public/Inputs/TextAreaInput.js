import { useEffect } from "react";
import BaseInput from "./BaseInput";

const TextAreaInput = ({
  id,
  rows = 3,
  label,
  placeholder,
  note,
  value,
  onChange,
  error,
  register = () => ({}),
  unregister = () => ({}),
}) => {
  const inputRingAndBorderStyle = error
    ? "focus:ring-red-300  border-red-200 focus:border-red-300"
    : "focus:ring-indigo-500 focus:border-indigo-500";

  useEffect(() => {
    return () => {
      unregister(id);
    };
  }, []);

  return (
    <BaseInput id={id} label={label} error={error?.message}>
      <div className="relative">
        <textarea
          id={id}
          name={id}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`shadow-sm ${inputRingAndBorderStyle} block w-full sm:text-sm border border-gray-300 rounded-md`}
          {...register()}
        />
      </div>
    </BaseInput>
  );
};

export default TextAreaInput;
