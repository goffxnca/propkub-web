import { useContext } from 'react';
import { useRouter } from 'next/router';
import PageTitle from '../UI/PageTitle';
import { AuthContext } from '../../contexts/authContext';
import ProfileWarnings from './ProfileWarnings';
import PersonalInfoSection from './PersonalInfoSection';
import ContactInfoSection from './ContactInfoSection';
import AccountDetailsSection from './AccountDetailsSection';
import AccountSecuritySection from './AccountSecuritySection';
import SocialConnectionsSection from './SocialConnectionsSection';
import Button from '../UI/Public/Button';
import { useTranslation } from '../../hooks/useTranslation';

const ProfileScreen = () => {
  const { t } = useTranslation('pages/profile');
  const { isProfileComplete, user } = useContext(AuthContext);
  const router = useRouter();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">{t('loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <PageTitle label={t('title')} />
        <div>
          <Button
            type="submit"
            variant="primary"
            onClick={() => {
              router.push('/account/posts/create');
            }}
          >
            {t('createPost')}
          </Button>
        </div>
      </div>

      <div className="my-6">
        <ProfileWarnings
          user={user}
          onCheckAgainClick={() => router.reload()}
        />
      </div>

      <div className="space-y-6">
        <PersonalInfoSection user={user} />
        <AccountDetailsSection user={user} />
        <ContactInfoSection user={user} />
        <SocialConnectionsSection user={user} />
        <AccountSecuritySection user={user} />
      </div>
    </div>
  );
};

export default ProfileScreen;
