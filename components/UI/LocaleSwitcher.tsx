import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

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

  const activeConfig = localeConfig[activeLocale || 'th'];

  const handleLocaleChange = (locale: string) => {
    router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none">
          <span className="text-lg">{activeConfig.flag}</span>
          <span>{activeConfig.code.toUpperCase()}</span>
          <ChevronDownIcon
            className="w-5 h-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {(locales || []).map((locale) => {
              const config = localeConfig[locale];

              return (
                <Menu.Item key={locale}>
                  {({ active }) => (
                    <button
                      onClick={() => handleLocaleChange(locale)}
                      className={`
                        ${active ? 'bg-gray-100' : ''}
                        text-gray-700 group flex items-center w-full px-4 py-2 text-sm
                      `}
                    >
                      <span className="text-lg mr-3">{config.flag}</span>
                      <span className="flex-1 text-left">{config.name}</span>
                      <span className="text-xs font-semibold ml-2 text-gray-400">
                        {config.code.toUpperCase()}
                      </span>
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
