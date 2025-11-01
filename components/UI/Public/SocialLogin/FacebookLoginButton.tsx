import { envConfig } from '../../../../libs/envConfig';

const FacebookLoginButton = ({ text = 'Connect with Facebook' }) => {
  const handleFacebookOAuth = () => {
    window.location.href = `${envConfig.apiUrl()}/auth/facebook`;
  };

  return (
    <button
      type="button"
      onClick={handleFacebookOAuth}
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm font-medium text-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <div className="flex items-center">
        {/* Facebook Logo */}
        <svg
          className="w-5 h-5 mr-3"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            fill="#1877F2"
          />
        </svg>
        <span className="font-medium">{text}</span>
      </div>
    </button>
  );
};

export default FacebookLoginButton;
