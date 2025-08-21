import React from 'react';
import { Variant } from '../../../libs/utils/style-utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
}

const Badge = ({ children, variant = 'gray' }: BadgeProps) => {
  const variants = {
    gray: {
      bg: 'bg-gray-100',
      text: 'text-gray-600'
    },
    error: {
      bg: 'bg-red-100',
      text: 'text-red-700'
    },
    warning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800'
    },
    success: {
      bg: 'bg-green-100',
      text: 'text-green-700'
    },
    info: {
      bg: 'bg-blue-100',
      text: 'text-blue-700'
    },
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-700'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-700'
    },
    pink: {
      bg: 'bg-pink-100',
      text: 'text-pink-700'
    }
  } as const;

  const variantClasses = variants[variant] || variants.gray;
  const baseClasses =
    'inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium';

  return (
    <span
      className={`${baseClasses} ${variantClasses.bg} ${variantClasses.text}`}
    >
      {children}
    </span>
  );
};

export default Badge;
