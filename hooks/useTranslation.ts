import { useRouter } from 'next/router';
import thCommon from '../public/locales/th/common.json';
import enCommon from '../public/locales/en/common.json';

const translations = {
  th: {
    common: thCommon
  },
  en: {
    common: enCommon
  }
};

export function useTranslation(namespace = 'common') {
  const router = useRouter();
  const { locale = 'th' } = router;

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any =
      translations[locale as 'th' | 'en']?.[namespace as 'common'];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return { t, locale };
}

