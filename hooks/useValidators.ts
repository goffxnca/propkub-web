import { useTranslation } from './useTranslation';

type ValidationTranslation = (
  key: string,
  params?: Record<string, any>
) => string;

const min = (min: number, t: ValidationTranslation) => ({
  min: {
    value: min,
    message: t('validation.min', { min })
  }
});

const max = (max: number, t: ValidationTranslation) => ({
  max: {
    value: max,
    message: t('validation.max', { max })
  }
});

const minLength = (minLength: number, t: ValidationTranslation) => ({
  minLength: {
    value: minLength,
    message: t('validation.minLength', { minLength })
  }
});

const maxLength = (maxLength: number, t: ValidationTranslation) => ({
  maxLength: {
    value: maxLength,
    message: t('validation.maxLength', { maxLength })
  }
});

const EmailPattern = (t: ValidationTranslation) => ({
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: t('validation.email')
  }
});

const GenericPhonePattern = (t: ValidationTranslation) => ({
  pattern: {
    value: /^[0-9]{9,10}$/g,
    message: t('validation.phone')
  }
});

const MobilePhonePattern = (t: ValidationTranslation) => ({
  pattern: {
    value: /^[0-9]{10}$/g,
    message: t('validation.mobilePhone')
  }
});

const LineIdPattern = (t: ValidationTranslation) => ({
  pattern: {
    value: /^@?[a-z0-9._-]{3,18}$/,
    message: t('validation.lineId')
  }
});

const required = (t: ValidationTranslation) => ({
  required: {
    value: true,
    message: t('validation.required')
  }
});

export const useValidators = () => {
  const { t: tCommon } = useTranslation('common');

  return {
    min: (minValue: number) => min(minValue, tCommon),
    max: (maxValue: number) => max(maxValue, tCommon),
    minLength: (minLengthValue: number) => minLength(minLengthValue, tCommon),
    maxLength: (maxLengthValue: number) => maxLength(maxLengthValue, tCommon),
    EmailPattern: () => EmailPattern(tCommon),
    GenericPhonePattern: () => GenericPhonePattern(tCommon),
    MobilePhonePattern: () => MobilePhonePattern(tCommon),
    LineIdPattern: () => LineIdPattern(tCommon),
    required: () => required(tCommon)
  };
};
