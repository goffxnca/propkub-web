import Head from 'next/head';
import FAQ from '../components/FAQ/FAQ';
import { BASE_SITE_URL } from '../libs/constants';
import { genPageTitle } from '../libs/seo-utils';

const FAQPage = () => {
  return (
    <>
      <Head>
        <title>{genPageTitle('คำถามที่พบบ่อยเกี่ยวกับ PropKub.com')}</title>
        <meta
          name="description"
          content="เราได้รวบรวมคำถามสำคัญต่างๆ ที่ Agentหรือนายหน้าอสังหาถามเราเข้ามาบ่อยที่สุดเกี่ยวกับบริการและการใช้งาน PropKub.com"
        />
        <link rel="canonical" href={BASE_SITE_URL + '/faq'} />
      </Head>
      <FAQ />
    </>
  );
};

export default FAQPage;
