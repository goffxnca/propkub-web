import Head from 'next/head';
import SigninForm from '../components/Auth/Signin/SigninForm';
import AuthLayout from '../components/Layouts/AuthLayout';
import GuestOnlyRoute from '../components/Auth/GuestOnlyRoute';
import { BASE_SITE_URL } from '../libs/constants';
import { genPageTitle } from '../libs/seo-utils';
import { useTranslation } from '../hooks/useTranslation';

const LoginPage = () => {
  const { t } = useTranslation('pages/login');

  return (
    <GuestOnlyRoute>
      <Head>
        <title>{genPageTitle(t('title'))}</title>
        <meta
          name="description"
          content={t('meta.description')}
        />
        <link rel="canonical" href={BASE_SITE_URL + '/login'} />
      </Head>
      <SigninForm />
    </GuestOnlyRoute>
  );
};

export default LoginPage;

LoginPage.getLayout = (page) => {
  return <AuthLayout>{page}</AuthLayout>;
};
