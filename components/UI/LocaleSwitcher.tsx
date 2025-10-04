import Link from 'next/link';
import { useRouter } from 'next/router';

interface LocaleConfig {
  code: string;
  name: string;
  flag: string;
}

const localeConfig: Record<string, LocaleConfig> = {
  th: {
    code: 'th',
    name: 'ไทย',
    flag: '🇹🇭'
  },
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  }
};

export default function LocaleSwitcher() {
  const router = useRouter();
  const { locales, locale: activeLocale, pathname, query, asPath } = router;

  return (
    <div className="flex items-center gap-2">
      {(locales || []).map((locale) => {
        const config = localeConfig[locale];
        const isActive = locale === activeLocale;

        return (
          <Link
            key={locale}
            href={{ pathname, query }}
            as={asPath}
            locale={locale}
            className={`
              text-2xl transition-all duration-200 cursor-pointer`}
            title={config.name}
          >
            {config.flag}
          </Link>
        );
      })}
    </div>
  );
}
