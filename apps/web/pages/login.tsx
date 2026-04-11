import GuestOnlyRoute from '@/components/Auth/GuestOnlyRoute';
import SigninForm from '@/components/Auth/Signin/SigninForm';
import AuthLayout from '@/components/Layouts/AuthLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { BASE_SITE_URL } from '@/libs/constants';
import { genPageTitle } from '@/libs/seo-utils';
import Head from 'next/head';

const LoginPage = () => {
  const { t } = useTranslation('pages/login');
  const { t: tCommon } = useTranslation('common');

  return (
    <GuestOnlyRoute>
      <Head>
        <title>{genPageTitle(t('title'))}</title>
        <meta
          name="description"
          content={tCommon('meta.defaultDescription', { page: t('title') })}
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
