const Card = ({ children }) => {
  return (
    <div className="rounded-lg border border-solid border-gray-200 p-4 my-1">
      {children}
    </div>
  );
};

export default Card;
