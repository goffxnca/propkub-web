const Badge = ({ 
  children, 
  variant = "gray", 
  showDot = true 
}) => {
  const variants = {
    gray: {
      bg: "bg-gray-100",
      text: "text-gray-600", 
      dot: "fill-gray-400"
    },
    error: {
      bg: "bg-red-100",
      text: "text-red-700",
      dot: "fill-red-500"
    },
    warning: {
      bg: "bg-yellow-100", 
      text: "text-yellow-800",
      dot: "fill-yellow-500"
    },
    success: {
      bg: "bg-green-100",
      text: "text-green-700", 
      dot: "fill-green-500"
    },
    info: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      dot: "fill-blue-500"
    },
    indigo: {
      bg: "bg-indigo-100",
      text: "text-indigo-700",
      dot: "fill-indigo-500"
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-700", 
      dot: "fill-purple-500"
    },
    pink: {
      bg: "bg-pink-100",
      text: "text-pink-700",
      dot: "fill-pink-500"
    }
  };

  const variantClasses = variants[variant] || variants.gray;
  const baseClasses = "inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium";

  return (
    <span className={`${baseClasses} ${variantClasses.bg} ${variantClasses.text}`}>
      {showDot && (
        <svg viewBox="0 0 6 6" aria-hidden="true" className={`size-1.5 ${variantClasses.dot}`}>
          <circle r={3} cx={3} cy={3} />
        </svg>
      )}
      {children}
    </span>
  );
};

export default Badge; 