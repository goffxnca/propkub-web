import { ReactNode, createElement } from 'react';

interface HeadingProps {
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  label: ReactNode;
}

const Heading = ({ size = 1, label }: HeadingProps) => {
  const tagName = `h${size}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return createElement(
    tagName,
    { className: 'text-lg font-bold text-gray-dark mb-2' },
    label
  );
};

export default Heading;
