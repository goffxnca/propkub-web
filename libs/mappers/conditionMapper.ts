import { Condition, ConditionData } from '../../src/types/misc/condition';
import { Locale } from '../../src/types/locale';

const conditions: ConditionData[] = [
  { id: 'used', labelTH: 'มือสอง', labelEN: 'Used' },
  { id: 'new', labelTH: 'โครงการใหม่', labelEN: 'New' }
];

const getConditions = (locale: Locale = 'th'): Condition[] => {
  return conditions.map((c) => ({
    id: c.id,
    label: locale === 'en' ? c.labelEN : c.labelTH
  }));
};

const getConditionLabel = (conditionId: string, locale: Locale = 'th'): string => {
  const condition = conditions.find((c) => c.id === conditionId);
  if (!condition) return '';
  return locale === 'en' ? condition.labelEN : condition.labelTH;
};

export { getConditions, getConditionLabel };
