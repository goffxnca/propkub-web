import FacebookIcon from "../Icons/FacebookIcon";

const LinkFacebookAccountButton = ({ 
  currentUserEmail,
  size = "sm",
  buttonText = "เชื่อมต่อ"
}) => {
  const handleFacebookLinking = () => {
    if (!currentUserEmail) {
      console.error('[Auth] Cannot link Facebook account: Missing current user email');
      return;
    }

    console.log('[Auth] Initiating Facebook account linking', { currentUserEmail });
    
    // Create structured state object
    const stateObject = {
      mode: "link",
      email: currentUserEmail,
      provider: "facebook"
    };
    
    const state = JSON.stringify(stateObject);
    const linkingUrl = `http://localhost:3000/auth/facebook?state=${encodeURIComponent(state)}`;
    window.location.href = linkingUrl;
  };

  const getButtonClasses = () => {
    const baseClasses = "flex items-center justify-center border border-gray-300 rounded-md shadow-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
    if (size === "sm") {
      return `${baseClasses} px-3 py-2 text-sm`;
    }
    return `${baseClasses} w-full px-4 py-3 text-sm`;
  };

  return (
    <button
      type="button"
      onClick={handleFacebookLinking}
      className={getButtonClasses()}
      disabled={!currentUserEmail}
    >
      <div className="flex items-center">
        <FacebookIcon className={`w-4 h-4 ${size === "sm" ? "mr-2" : "mr-3"}`} />
        <span className="font-medium text-sm">{buttonText}</span>
      </div>
    </button>
  );
};

export default LinkFacebookAccountButton; 