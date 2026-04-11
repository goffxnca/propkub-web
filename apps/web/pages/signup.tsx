import GuestOnlyRoute from '@/components/Auth/GuestOnlyRoute';
import SignupForm from '@/components/Auth/Signup/SignupForm';
import AuthLayout from '@/components/Layouts/AuthLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { BASE_SITE_URL } from '@/libs/constants';
import { genPageTitle } from '@/libs/seo-utils';
import Head from 'next/head';

const SignupPage = () => {
  const { t } = useTranslation('pages/signup');
  const { t: tCommon } = useTranslation('common');

  return (
    <GuestOnlyRoute>
      <Head>
        <title>{genPageTitle(t('title'))}</title>
        <meta
          name="description"
          content={tCommon('meta.defaultDescription', { page: t('title') })}
        />
        <link rel="canonical" href={BASE_SITE_URL + '/signup'} />
      </Head>
      <SignupForm />
    </GuestOnlyRoute>
  );
};

export default SignupPage;

SignupPage.getLayout = (page) => {
  return <AuthLayout>{page}</AuthLayout>;
};
