import Head from "next/head";
import SigninForm from "../components/Auth/Signin/SigninForm";
import AuthLayout from "../components/Layouts/AuthLayout";
import { BASE_SITE_URL } from "../libs/constants";
import { genPageTitle } from "../libs/seo-utils";

const LoginPage = () => (
  <>
    <Head>
      <title>{genPageTitle("ล็อกอินเข้าสู่ระบบ")}</title>
      <meta
        name="description"
        content="ล็อกอินเพื่อเข้าใช้งาน PropKub.com ตัวช่วยค้นหา/ลงประกาศ อสังหาริมทรัพย์ทุกประเทศ ไม่ว่าจะเป็นการซื้อ-ขาย-เช่า บ้าน ที่ดิน ทาวน์โฮม คอนโด อาคารพาณิชย์ ใช้งานฟรีไม่มีค่าใช้จ่าย"
      />
      <link rel="canonical" href={BASE_SITE_URL + "/login"} />
    </Head>
    <SigninForm />
  </>
);

export default LoginPage;

LoginPage.getLayout = (page) => {
  return <AuthLayout>{page}</AuthLayout>;
};
