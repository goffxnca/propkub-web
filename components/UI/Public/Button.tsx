import { ReactNode, MouseEventHandler } from 'react';
import SpinnerIcon from '../../Icons/SpinnerIcon';
import Overlay from '../Common/modals/Overlay';

interface ButtonProps {
  type: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'accent';
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  Icon?: ReactNode;
  disabled?: boolean;
  spacingY?: boolean;
  children?: ReactNode;
}

const Button = ({
  type = 'button',
  variant = 'primary',
  loading = false,
  onClick,
  Icon,
  disabled = false,
  spacingY = false,
  children
}: ButtonProps) => {
  const bgStyle = disabled
    ? 'bg-primary bg-opacity-50'
    : variant === 'secondary'
      ? 'bg-secondary hover:bg-secondary-hover'
      : variant === 'accent'
        ? 'bg-accent hover:bg-accent-hover'
        : 'bg-primary hover:bg-primary-hover';
  const textStyle = variant === 'secondary' ? 'text-gray-700' : 'text-white';
  const borderStyle = variant === 'secondary' ? 'border border-gray-300' : '';
  const buttonSpacingY = spacingY ? 'py-3' : 'py-4 md:py-2';

  return (
    <button
      className={`w-full whitespace-nowrap ${buttonSpacingY} px-4 my-1 text-sm rounded-md font-medium hover:text-opacity-90 ${bgStyle} ${textStyle} ${borderStyle} `}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      <div className="flex items-center justify-center overflow-hidden">
        {loading && (
          <div className="animate-spin text-white">
            <SpinnerIcon className="w-4 h-4" />
          </div>
        )}

        {Icon && <div className=" mr-1">{Icon}</div>}

        <div className={`${loading && 'ml-1'}`}>{children}</div>
      </div>
      {loading && <Overlay {...({} as any)} />}
    </button>
  );
};

export default Button;
