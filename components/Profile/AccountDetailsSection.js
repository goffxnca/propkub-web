import { CalendarIcon, LoginIcon, MailIcon } from '@heroicons/react/outline';
import { getDateTimeString } from '../../libs/date-utils';
import GoogleIcon from '../Icons/GoogleIcon';
import FacebookIcon from '../Icons/FacebookIcon';
import { useTranslation } from '../../hooks/useTranslation';
import { useRouter } from 'next/router';

const AccountDetailsSection = ({ user }) => {
  const router = useRouter();
  const { t } = useTranslation('pages/profile');
  const { t: tCommon } = useTranslation('common');
  const getProviderDisplay = (provider) => {
    const providerMap = {
      email: {
        name: tCommon('providers.email'),
        icon: <MailIcon className="w-4 h-4 text-gray-600" />,
        color: 'text-gray-600'
      },
      google: {
        name: tCommon('providers.google'),
        icon: <GoogleIcon />,
        color: 'text-blue-600'
      },
      facebook: {
        name: tCommon('providers.facebook'),
        icon: <FacebookIcon className="text-blue-600" />,
        color: 'text-blue-800'
      }
    };
    return (
      providerMap[provider] || {
        name: provider,
        icon: '🔗',
        color: 'text-gray-600'
      }
    );
  };

  const getLoginProviderInfo = (provider) => {
    if (!provider)
      return {
        icon: <MailIcon className="w-4 h-4 text-gray-600" />,
        name: tCommon('providers.email')
      };

    const normalizedProvider = provider.toLowerCase();
    switch (normalizedProvider) {
      case 'email':
        return {
          icon: <MailIcon className="w-4 h-4 text-gray-600" />,
          name: tCommon('providers.email')
        };
      case 'google':
        return {
          icon: <GoogleIcon />,
          name: tCommon('providers.google')
        };
      case 'facebook':
        return {
          icon: <FacebookIcon className="text-blue-600" />,
          name: tCommon('providers.facebook')
        };
      default:
        return {
          icon: <MailIcon className="w-4 h-4 text-gray-600" />,
          name: tCommon('providers.email')
        };
    }
  };

  const providerInfo = getProviderDisplay(user.provider);

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            👤 {t('sections.account.title')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t('sections.account.subtitle')}
          </p>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="space-y-4">
            {/* Account Registration Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('sections.account.registeredWith')}
              </label>
              <div className="mt-1 flex items-center space-x-2">
                {providerInfo.icon}
                <span className={`text-sm font-medium ${providerInfo.color}`}>
                  {providerInfo.name}
                </span>
              </div>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('sections.account.memberSince')}
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900">
                  {user.createdAt
                    ? getDateTimeString(user.createdAt, router.locale)
                    : t('sections.account.notSpecified')}
                </span>
              </div>
            </div>

            {/* User ID */}
            {user.cid && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('sections.account.memberId')}
                </label>
                <div className="mt-1">
                  <span className="text-sm text-gray-900 font-mono">
                    #{user.cid}
                  </span>
                </div>
              </div>
            )}

            {/* Last Login */}
            {user.lastLoginAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('sections.account.lastLogin')}
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <LoginIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {getDateTimeString(user.lastLoginAt, router.locale)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {t('sections.account.via')}
                  </span>
                  <div className="inline-flex items-center">
                    <span className="text-sm text-gray-900">
                      {getLoginProviderInfo(user.lastLoginProvider).name}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Last Updated */}
            {user.updatedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('sections.account.lastUpdated')}
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {getDateTimeString(user.updatedAt, router.locale)}
                  </span>
                </div>
              </div>
            )}

            {/* Terms of Service */}
            {user.tos && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('sections.account.termsOfService')}
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-sm text-green-600">
                    {t('sections.account.termsAccepted')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsSection;
