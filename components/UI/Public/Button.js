import SpinnerIcon from "../../Icons/SpinnerIcon";
import Overlay from "../Common/modals/Overlay";

const Button = ({
  type = "button",
  variant = "primary",
  loading = false,
  onClick,
  Icon,
  disabled = false,
  children,
  spacingY = false,
}) => {
  const bgStyle = disabled
    ? "bg-primary bg-opacity-50"
    : variant === "secondary"
    ? "bg-secondary hover:bg-secondary-hover"
    : variant === "accent"
    ? "bg-accent hover:bg-accent-hover"
    : "bg-primary hover:bg-primary-hover";
  const textStyle = variant === "secondary" ? "text-gray-700" : "text-white";
  const borderStyle = variant === "secondary" ? "border border-gray-300" : "";
  const buttonSpacingY = spacingY ? "py-3" : "py-4 md:py-2";

  let applyButtonAttributes = {};
  if (disabled) {
    applyButtonAttributes.disabled = true;
  }

  return (
    <button
      className={`w-full whitespace-nowrap ${buttonSpacingY} px-4 my-1 text-sm rounded-md font-medium hover:text-opacity-90 ${bgStyle} ${textStyle} ${borderStyle} `}
      onClick={onClick}
      type={type}
      {...applyButtonAttributes}
    >
      <div className="flex items-center justify-center overflow-hidden">
        {loading && (
          <div className="animate-spin text-white">
            <SpinnerIcon className="w-4 h-4" />
          </div>
        )}

        {Icon && <div className=" mr-1">{Icon}</div>}

        <div className={`${loading && "ml-1"}`}>
          {loading && "กำลัง"}
          {children}
        </div>
      </div>
      {loading && <Overlay />}
    </button>
  );
};

export default Button;
