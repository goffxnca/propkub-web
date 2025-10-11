import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageTitle from '../UI/Private/PageTitle';
import { authContext } from '../../contexts/authContext';
import Alert from '../UI/Public/Alert';
import PersonalInfoSection from './PersonalInfoSection';
import ContactInfoSection from './ContactInfoSection';
import AccountDetailsSection from './AccountDetailsSection';
import AccountSecuritySection from './AccountSecuritySection';
import SocialConnectionsSection from './SocialConnectionsSection';
import Button from '../UI/Public/Button';
import { useTranslation } from '../../hooks/useTranslation';

const ProfileScreen = () => {
  const { t } = useTranslation('pages/profile');
  const { isProfileComplete, user } = useContext(authContext);
  const router = useRouter();
  const [warningMessages, setWarningMessages] = useState([]);

  useEffect(() => {
    if (!user) return;

    const messages = [];
    if (!user.emailVerified) {
      messages.push(t('warnings.emailNotVerified', { email: user.email }));
    }
    if (!user.name) {
      messages.push(t('warnings.nameRequired'));
    }

    if (!user.profileImg) {
      messages.push(t('warnings.profileImageRequired'));
    }

    if (!user.phone || !user.line) {
      messages.push(t('warnings.contactRequired'));
    }

    setWarningMessages(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router.locale]);

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

      {warningMessages.length > 0 && (
        <div className="my-6">
          <Alert
            alertTitle={t('warnings.title')}
            messages={warningMessages}
            showButton={true}
            buttonLabel={t('warnings.checkAgain')}
            onClick={() => {
              router.reload();
            }}
          />
        </div>
      )}

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
