import Head from 'next/head';
import SignupForm from '../components/Auth/Signup/SignupForm';
import AuthLayout from '../components/Layouts/AuthLayout';
import GuestOnlyRoute from '../components/Auth/GuestOnlyRoute';
import { BASE_SITE_URL } from '../libs/constants';
import { genPageTitle } from '../libs/seo-utils';

const SignupPage = () => (
  <GuestOnlyRoute>
    <Head>
      <title>{genPageTitle('ลงทะเบียนใช้งาน')}</title>
      <meta
        name="description"
        content="ลงทะเบียนใช้งาน PropKub.com ตัวช่วยค้นหา/ลงประกาศ อสังหาริมทรัพย์ทุกประเทศ ไม่ว่าจะเป็นการซื้อ-ขาย-เช่า บ้าน ที่ดิน ทาวน์โฮม คอนโด อาคารพาณิชย์ ใช้งานฟรีไม่มีค่าใช้จ่าย"
      />
      <link rel="canonical" href={BASE_SITE_URL + '/signup'} />
    </Head>
    <SignupForm />
  </GuestOnlyRoute>
);

export default SignupPage;

SignupPage.getLayout = (page) => {
  return <AuthLayout>{page}</AuthLayout>;
};
