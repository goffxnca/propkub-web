import type { ComponentType } from 'react';
import type { SVGProps } from 'react';

interface SpecItemWithCircleProps {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  circle?: boolean;
}

const SpecItemWithCircle = ({
  label,
  Icon,
  circle = true
}: SpecItemWithCircleProps) => {
  return (
    <div className="flex items-center mr-4">
      <div className={`${circle && 'p-1.5 bg-gray-light rounded-full'}`}>
        <Icon className="text-gray-medium" />
      </div>
      <div className="text-gray-hard ml-1 text-xs">{label}</div>
    </div>
  );
};

export default SpecItemWithCircle;
