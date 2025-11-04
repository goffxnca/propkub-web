import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import MyPostList from '@/components/Dashboard/MyPostList';
import { genPageTitle } from '@/libs/seo-utils';
import Head from 'next/head';

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <Head>
        <title>{genPageTitle('แดชบอร์ด')}</title>
      </Head>
      <MyPostList />
    </ProtectedRoute>
  );
};

export default DashboardPage;
