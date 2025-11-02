import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <div className="rounded-lg border border-solid border-gray-200 p-4 my-1">
      {children}
    </div>
  );
};

export default Card;
