const PostFeature2 = ({ label, Icon, className }) => {
  return (
    <div className={className}>
      <div className="flex items-center">
        <Icon className="text-gray-soft" />
        <div className="text-gray-dark pl-2">{label}</div>
      </div>
    </div>
  );
};

export default PostFeature2;
