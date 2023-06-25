const Heading = ({ size = 1, label }) => {
  const HeadingTag = `h${size}`;

  return (
    <HeadingTag className="text-lg font-bold text-gray-dark mb-2">
      {label}
    </HeadingTag>
  );
};

export default Heading;
