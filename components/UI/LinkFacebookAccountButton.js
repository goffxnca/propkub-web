import { envConfig } from '../../libs/envConfig';
import FacebookIcon from '../Icons/FacebookIcon';

const LinkFacebookAccountButton = ({
  currentUserEmail,
  size = 'sm',
  buttonText
}) => {
  const handleFacebookLinking = () => {
    if (!currentUserEmail) {
      console.error(
        '[Auth] Cannot link Facebook account: Missing current user email'
      );
      return;
    }

    // Create structured state object
    const stateObject = {
      mode: 'link',
      email: currentUserEmail,
      provider: 'facebook'
    };

    const state = JSON.stringify(stateObject);
    const linkingUrl = `${envConfig.apiUrl()}/auth/facebook?state=${encodeURIComponent(state)}`;
    window.location.href = linkingUrl;
  };

  const getButtonClasses = () => {
    const baseClasses =
      'flex items-center justify-center border rounded-md shadow-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
    if (size === 'sm') {
      return `${baseClasses} px-3 py-2 text-sm border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100`;
    }
    return `${baseClasses} w-full px-4 py-3 text-sm border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100`;
  };

  return (
    <button
      type="button"
      onClick={handleFacebookLinking}
      className={getButtonClasses()}
      disabled={!currentUserEmail}
    >
      <div className="flex items-center">
        <FacebookIcon
          className={`w-4 h-4 ${size === 'sm' ? 'mr-2' : 'mr-3'}`}
        />
        <span className="font-medium text-sm">{buttonText}</span>
      </div>
    </button>
  );
};

export default LinkFacebookAccountButton;
