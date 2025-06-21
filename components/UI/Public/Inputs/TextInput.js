import { useEffect } from "react";
import BaseInput from "./BaseInput";

const TextInput = ({
  id,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  onKeyPress,
  leadingSlot,
  tailingSlot,
  error,
  info,
  register = () => ({}),
  unregister = () => ({}),
  children,
  spacingY = false,
}) => {
  const inputRingAndBorderStyle = error
    ? "focus:ring-red-300  border-red-200 focus:border-red-300"
    : "focus:ring-indigo-500 focus:border-indigo-500";

  const disabledStyle = disabled ? "bg-gray-50 text-gray-500" : "";

  const textboxSpacingY = spacingY ? "py-3" : "";

  let applyInputAttributes = {};
  if (disabled) {
    applyInputAttributes.disabled = true;
  }

  useEffect(() => {
    return () => {
      unregister(id);
    };
  }, []);

  return (
    <BaseInput id={id} label={label} error={error?.message} info={info}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{leadingSlot}</span>
        </div>
        <input
          id={id}
          type={type}
          name={id}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onKeyPress={onKeyPress}
          className={`mt-1 ${textboxSpacingY} ${inputRingAndBorderStyle} block w-full shadow-sm sm:text-sm border-gray-300 rounded-md z-30 ${disabledStyle} ${
            leadingSlot && "pl-7"
          }`}
          {...register()}
          {...applyInputAttributes}
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-20">
          <span className="text-gray-500 sm:text-sm">{tailingSlot}</span>
        </div>
        {children}
      </div>
    </BaseInput>
  );
};

export default TextInput;
