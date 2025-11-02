import type { ComponentType } from 'react';
import type { SVGProps } from 'react';

interface SpecItemProps {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
}

const SpecItem = ({ label, Icon, className }: SpecItemProps) => {
  return (
    <li className={className}>
      <div className="flex items-center">
        <Icon className="text-gray-soft" />
        <div className="text-gray-dark pl-2">{label}</div>
      </div>
    </li>
  );
};

export default SpecItem;
