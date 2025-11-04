import ContactForm from '@/components/Contact/ContactForm';
import { useTranslation } from '@/hooks/useTranslation';
import { BASE_SITE_URL } from '@/libs/constants';
import { genPageTitle } from '@/libs/seo-utils';
import Head from 'next/head';

const ContactPage = () => {
  const { t } = useTranslation('pages/contact');

  return (
    <>
      <Head>
        <title>{genPageTitle(t('hero.title'))}</title>
        <meta name="description" content={t('hero.subtitle')} />
        <link rel="canonical" href={BASE_SITE_URL + '/contact'} />
      </Head>
      <ContactForm />
    </>
  );
};

export default ContactPage;
