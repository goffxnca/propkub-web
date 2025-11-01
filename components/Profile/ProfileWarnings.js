import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LockClosedIcon } from '@heroicons/react/outline';
import Alert from '../UI/Public/Alert';
import { useTranslation } from '../../hooks/useTranslation';

const ProfileWarnings = ({
  user,
  onCheckAgainClick,
  showLockOverlay = false
}) => {
  const router = useRouter();
  const { t } = useTranslation('pages/profile');
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

  if (warningMessages.length === 0) {
    return null;
  }

  return (
    <div>
      <Alert
        title={t('warnings.title')}
        messages={warningMessages}
        showButton={true}
        buttonLabel={t('warnings.checkAgain')}
        onClick={onCheckAgainClick || (() => router.push('/profile'))}
      />

      {showLockOverlay && (
        <div className="absolute bg-black bg-opacity-5 w-full h-full z-40">
          <LockClosedIcon
            className="h-20 w-20 md:h-40 md:w-40 flex-shrink-0 text-gray-500 m-auto mt-20 md:mt-40"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};

export default ProfileWarnings;
