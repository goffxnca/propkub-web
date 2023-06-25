const LinkButton = ({
  variant = "primary",
  href = "",
  target = "_blank",
  children,
  onClick,
}) => {
  const bgStyle =
    variant === "secondary"
      ? "bg-secondary hover:bg-secondary-hover"
      : variant === "accent"
      ? "bg-accent hover:bg-accent-hover"
      : "bg-primary hover:bg-primary-hover";
  const textStyle = variant === "secondary" ? "text-gray-700" : "text-white";
  const borderStyle = variant === "secondary" ? "border border-gray-300" : "";

  return (
    <a
      className={`w-full whitespace-nowrap py-4 md:py-2 px-4 my-1 text-sm rounded-md font-medium hover:text-opacity-90 ${bgStyle} ${textStyle} ${borderStyle} `}
      href={href}
      target={target}
      rel="noopener noreferrer"
      onClick={onClick}
    >
      <div className="flex items-center justify-center">{children}</div>
    </a>
  );
};

export default LinkButton;
