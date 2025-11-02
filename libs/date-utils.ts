import type { Locale } from '../types/locale';

const getUnixEpochTime = () => {
  return Date.now().toString();
};

const getLocalDateByISODateString = (isoDateString: string) => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString('th');
};

const getLocalDateTimeByISODateString = (isoDateString: string) => {
  const date = new Date(isoDateString);
  const timeSegments = date.toLocaleTimeString('th').split(':');
  const time = timeSegments[0] + ':' + timeSegments[1];
  return `${date.toLocaleDateString('th')} ${time}`;
};

const getThaiFullDateTimeString = (isoDateString: string) => {
  return new Date(isoDateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getDateTimeString = (isoDateString: string, locale: Locale | string) => {
  const localeMap: Record<string, string> = {
    th: 'th-TH',
    en: 'en-US'
  };

  return new Date(isoDateString).toLocaleDateString(
    localeMap[locale] || 'th-TH',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  );
};

const getDateString = (isoDateString: string, locale: Locale | string) => {
  const localeMap: Record<string, string> = {
    th: 'th-TH',
    en: 'en-US'
  };

  return new Date(isoDateString).toLocaleDateString(
    localeMap[locale] || 'th-TH',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  );
};

const getTestTimestamp = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, ''); // yyyymmdd
  const time = now.toISOString().slice(11, 16).replace(':', ''); // hhmm
  return `${date}_${time}`;
};

export {
  getUnixEpochTime,
  getLocalDateByISODateString,
  getLocalDateTimeByISODateString,
  getThaiFullDateTimeString,
  getDateTimeString,
  getDateString,
  getTestTimestamp
};
