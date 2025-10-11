import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import GoogleIcon from '../Icons/GoogleIcon';
import FacebookIcon from '../Icons/FacebookIcon';
import { MailIcon } from '@heroicons/react/outline';
import LinkGoogleAccountButton from '../UI/LinkGoogleAccountButton';
import LinkFacebookAccountButton from '../UI/LinkFacebookAccountButton';
import { useTranslation } from '../../hooks/useTranslation';

const SocialConnectionsSection = ({ user }) => {
  const { t } = useTranslation('pages/profile');
  const { t: tCommon } = useTranslation('common');
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
      email: {
        name: tCommon('providers.email'),
        icon: <MailIcon className="w-5 h-5 text-gray-600" />,
        color: 'text-gray-600',
        description: t('sections.social.descriptions.email')
      },
      google: {
        name: tCommon('providers.google'),
        icon: <GoogleIcon className="w-5 h-5" />,
        color: 'text-blue-600',
        description: t('sections.social.descriptions.google')
      },
      facebook: {
        name: tCommon('providers.facebook'),
        icon: <FacebookIcon className="w-5 h-5 text-blue-600" />,
        color: 'text-blue-800',
        description: t('sections.social.descriptions.facebook')
      }
    };
    return providerMap[provider];
  };

  const getAllProviders = () => {
    // If user signed up with Google or Facebook, don't show email option
    // (since we don't allow linking back to email accounts)
    if (user.provider === 'google' || user.provider === 'facebook') {
      // return ['google', 'facebook']; //TODO: Use this when facebook linking ready
      return ['google'];
    }

    // If user signed up with email, show all options
    // return ['email', 'google', 'facebook']; //TODO: Use this when facebook linking ready
    return ['email', 'google'];
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
              buttonText={t('sections.social.connectButton')}
            />
          ) : provider === 'facebook' ? (
            <LinkFacebookAccountButton
              currentUserEmail={user.email}
              size="sm"
              buttonText={t('sections.social.connectButton')}
            />
          ) : (
            <>
              <XCircleIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                {t('sections.social.notConnected')}
              </span>
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
            🔗 {t('sections.social.title')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t('sections.social.subtitle')}
          </p>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="space-y-4">
            {/* All Social Connection Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('sections.social.statusLabel')}
              </label>
              <div className="space-y-3">
                {allProviders.map((provider) => (
                  <div key={provider}>{renderConnectionStatus(provider)}</div>
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
