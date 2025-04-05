const PostFeature = ({ label, Icon, circle = true }) => {
  return (
    <div className="flex items-center mr-4">
      <div className={`${circle && "p-1.5 bg-gray-light rounded-full"}`}>
        <Icon className="text-gray-medium" />
      </div>
      <div className="text-gray-hard ml-1 text-sm">{label}</div>
    </div>
  );
};

export default PostFeature;
