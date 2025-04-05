const SpecItem = ({ label, Icon, className }) => {
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
