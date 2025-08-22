import {  CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";
import GoogleIcon from "../Icons/GoogleIcon";
import FacebookIcon from "../Icons/FacebookIcon";
import { MailIcon } from "@heroicons/react/outline";
import LinkGoogleAccountButton from "../UI/LinkGoogleAccountButton";
import LinkFacebookAccountButton from "../UI/LinkFacebookAccountButton";

const SocialConnectionsSection = ({ user }) => {

  const getConnectionStatus = (provider) => {
    switch (provider) {
      case 'google':
        return user.provider === 'google' || !!user.googleId;
      case 'facebook':
        return user.provider === 'facebook' || !!user.facebookId;
      case 'email':
        return true;
      default:
        return false;
    }
  };

  const getProviderInfo = (provider) => {
    const providerMap = {
      'email': { 
        name: 'อีเมล', 
        icon: <MailIcon className="w-5 h-5 text-gray-600" />, 
        color: 'text-gray-600',
        description: 'เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน'
      },
      'google': { 
        name: 'Google', 
        icon: <GoogleIcon className="w-5 h-5" />, 
        color: 'text-blue-600',
        description: 'เข้าสู่ระบบด้วยบัญชี Google'
      }
      ,
      'facebook': { 
        name: 'Facebook', 
        icon: <FacebookIcon className="w-5 h-5 text-blue-600" />, 
        color: 'text-blue-800',
        description: 'เข้าสู่ระบบด้วยบัญชี Facebook'
      }
    };
    return providerMap[provider];
  };

  const getAllProviders = () => {
    // If user signed up with Google or Facebook, don't show email option
    // (since we don't allow linking back to email accounts)
    if (user.provider === 'google' || user.provider === 'facebook') {
      return ['google', 'facebook'];
    }
    
    // If user signed up with email, show all options
    return ['email', 'google', 'facebook'];
  };

  const renderConnectionStatus = (provider) => {
    const isConnected = getConnectionStatus(provider);
    const info = getProviderInfo(provider);

    if (isConnected) {
      return (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            {info.icon}
            <div>
              <div className="font-medium text-green-900">{info.name}</div>
              <div className="text-sm text-green-700">{info.description}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">เชื่อมต่อแล้ว</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-3">
          {info.icon}
          <div>
            <div className="font-medium text-gray-600">{info.name}</div>
            <div className="text-sm text-gray-500">{info.description}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {provider === 'google' ? (
            <LinkGoogleAccountButton
              currentUserEmail={user.email}
              size="sm"
              buttonText="เชื่อมต่อ"
            />
          ) 
          // : provider === 'facebook' ? (
          //   <LinkFacebookAccountButton
          //     currentUserEmail={user.email}
          //     size="sm"
          //     buttonText="เชื่อมต่อ"
          //   />
          // ) 
          : (
            <>
              <XCircleIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">ยังไม่เชื่อมต่อ</span>
            </>
          )}
        </div>
      </div>
    );
  };

  const allProviders = getAllProviders();

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            🔗 การเชื่อมต่อโซเชียล
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            เชื่อมต่อบัญชีโซเชียลเพื่อความสะดวกในการเข้าสู่ระบบ
          </p>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="space-y-4">
            {/* All Social Connection Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                สถานะการเชื่อมต่อบัญชี
              </label>
              <div className="space-y-3">
                {allProviders.map((provider) => (
                  <div key={provider}>
                    {renderConnectionStatus(provider)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialConnectionsSection; 