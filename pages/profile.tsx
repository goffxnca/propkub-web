import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import ProfileScreen from '@/components/Profile/ProfileScreen';
import { useTranslation } from '@/hooks/useTranslation';
import { genPageTitle } from '@/libs/seo-utils';
import Head from 'next/head';

const ProfilePage = () => {
  const { t } = useTranslation('pages/profile');

  return (
    <ProtectedRoute>
      <Head>
        <title>{genPageTitle(t('title'))}</title>
      </Head>
      <ProfileScreen />
    </ProtectedRoute>
  );
};

export default ProfilePage;
