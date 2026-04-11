import type { ReactNode } from 'react';

interface PageTitleProps {
  label: ReactNode;
}

const PageTitle = ({ label }: PageTitleProps) => {
  return (
    <div className="flex items-center">
      <h1 className="text-2xl font-bold leading-7 text-gray-700 sm:truncate sm:text-3xl sm:tracking-tight py-6  underline">
        {label}
      </h1>
    </div>
  );
};

export default PageTitle;
