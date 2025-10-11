import { useRouter } from 'next/router';
import thCommon from '../public/locales/th/common.json';
import enCommon from '../public/locales/en/common.json';
import thPosts from '../public/locales/th/posts.json';
import enPosts from '../public/locales/en/posts.json';
import thContact from '../public/locales/th/pages/contact.json';
import enContact from '../public/locales/en/pages/contact.json';
import thDashboard from '../public/locales/th/pages/dashboard.json';
import enDashboard from '../public/locales/en/pages/dashboard.json';
import thAccountPost from '../public/locales/th/pages/account-post.json';
import enAccountPost from '../public/locales/en/pages/account-post.json';
import thLogin from '../public/locales/th/pages/login.json';
import enLogin from '../public/locales/en/pages/login.json';
import thForgotPassword from '../public/locales/th/pages/forgot-password.json';
import enForgotPassword from '../public/locales/en/pages/forgot-password.json';
import thServerErrors from '../public/locales/th/server-errors.json';
import enServerErrors from '../public/locales/en/server-errors.json';

const translations = {
  th: {
    common: thCommon,
    posts: thPosts,
    'server-errors': thServerErrors,
    'pages/contact': thContact,
    'pages/dashboard': thDashboard,
    'pages/account-post': thAccountPost,
    'pages/login': thLogin,
    'pages/forgot-password': thForgotPassword
  },
  en: {
    common: enCommon,
    posts: enPosts,
    'server-errors': enServerErrors,
    'pages/contact': enContact,
    'pages/dashboard': enDashboard,
    'pages/account-post': enAccountPost,
    'pages/login': enLogin,
    'pages/forgot-password': enForgotPassword
  }
};

type Namespace =
  | 'common'
  | 'posts'
  | 'server-errors'
  | 'pages/contact'
  | 'pages/dashboard'
  | 'pages/account-post'
  | 'pages/login'
  | 'pages/forgot-password';

export function useTranslation(namespace: Namespace = 'common') {
  const router = useRouter();
  const { locale = 'th' } = router;

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[locale as 'th' | 'en']?.[namespace];

    for (const k of keys) {
      value = value?.[k];
    }

    // Handle interpolation like {{count}} and {{title|lowercase}} and {{title|capitalize}}
    if (typeof value === 'string' && params) {
      return value.replace(
        /\{\{(\w+)(?:\|(\w+))?\}\}/g,
        (match, key, modifier) => {
          const paramValue = params[key]?.toString() || match;

          if (modifier === 'lowercase') {
            return paramValue.toLowerCase();
          }

          if (modifier === 'capitalize') {
            return (
              paramValue.charAt(0).toUpperCase() +
              paramValue.slice(1).toLowerCase()
            );
          }

          return paramValue;
        }
      );
    }

    return value || key;
  };

  return { t, locale };
}
