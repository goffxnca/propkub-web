import Head from 'next/head';
import { genPageTitle } from '../libs/seo-utils';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import ProfileScreen from '../components/Profile/ProfileScreen';

const ProfilePage = () => {
  return (
    <ProtectedRoute>
      <Head>
        <title>{genPageTitle('โปรไฟล์ของฉัน')}</title>
      </Head>
      <ProfileScreen />
    </ProtectedRoute>
  );
};

export default ProfilePage;
