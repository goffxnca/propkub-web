import enServerErrors from '../public/locales/en/server-errors.json';
import thServerErrors from '../public/locales/th/server-errors.json';

const SERVER_ERRORS = {
  en: enServerErrors,
  th: thServerErrors
};

/**
 * Translates server error messages to the appropriate locale
 * @param errorMessage - The error message from the server
 * @param locale - The current locale ('en' or 'th')
 * @returns Translated error message
 */
export const translateServerError = (
  errorMessage: string,
  locale: string = 'th'
): string => {
  if (!errorMessage) {
    return SERVER_ERRORS[locale]._generic;
  }

  // Check if the error message exists in our translations
  const translatedError =
    SERVER_ERRORS[locale][errorMessage as keyof typeof SERVER_ERRORS.th];

  // Return translated error or generic error message
  return translatedError || SERVER_ERRORS[locale]._generic;
};
