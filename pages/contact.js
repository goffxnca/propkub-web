import Head from "next/head";
import ContactForm from "../components/Contact/ContactForm";
import { BASE_SITE_URL } from "../libs/constants";
import { genPageTitle } from "../libs/seo-utils";

const ContactPage = () => {
  return (
    <>
      <Head>
        <title>{genPageTitle("ติดต่อทีมงาน PropKub.com")}</title>
        <meta
          name="description"
          content="ลูกค้าสามารถติดต่อทีมงาน PropKub.com ของเราได้หลายหลายช่องทางทั้ง Email, Line, โทรศัพท์ หรือส่งข้อความโดยตรงผ่านหน้า Contact Us ได้เลย"
        />
        <link rel="canonical" href={BASE_SITE_URL + "/contact"} />
      </Head>
      <ContactForm />
    </>
  );
};

export default ContactPage;
