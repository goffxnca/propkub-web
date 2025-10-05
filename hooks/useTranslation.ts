import { useRouter } from 'next/router';
import thCommon from '../public/locales/th/common.json';
import enCommon from '../public/locales/en/common.json';
import thPosts from '../public/locales/th/posts.json';
import enPosts from '../public/locales/en/posts.json';

const translations = {
  th: {
    common: thCommon,
    posts: thPosts
  },
  en: {
    common: enCommon,
    posts: enPosts
  }
};

type Namespace = 'common' | 'posts';

export function useTranslation(namespace: Namespace = 'common') {
  const router = useRouter();
  const { locale = 'th' } = router;

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[locale as 'th' | 'en']?.[namespace];

    for (const k of keys) {
      value = value?.[k];
    }

    // Handle interpolation like {{count}}
    if (typeof value === 'string' && params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return params[key]?.toString() || match;
      });
    }

    return value || key;
  };

  return { t, locale };
}

