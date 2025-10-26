import { AreaUnit, AreaUnitData } from '../../src/types/misc/areaUnit';
import { Locale } from '../../src/types/locale';

const areaUnits: AreaUnitData[] = [
  { id: 'whole', labelTH: 'ยกแปลง', labelEN: 'Whole Plot', ignorePrefix: true },
  { id: 'sqm', labelTH: 'ตรม.', labelEN: 'Sq.m.' },
  { id: 'sqw', labelTH: 'ตรว.', labelEN: 'Sq.w.' },
  { id: 'ngan', labelTH: 'งาน', labelEN: 'Ngan' },
  { id: 'rai', labelTH: 'ไร่', labelEN: 'Rai' }
];

const getAreaUnits = (locale: Locale = 'th'): AreaUnit[] => {
  return areaUnits.map((au) => ({
    id: au.id,
    label: locale === 'en' ? au.labelEN : au.labelTH,
    ignorePrefix: au.ignorePrefix
  }));
};

const getStandardAreaUnits = (locale: Locale = 'th'): AreaUnit[] => {
  return getAreaUnits(locale).filter((a) => a.id !== 'whole');
};

const getAreaUnitLabel = (
  areaUnitId: string,
  locale: Locale = 'th'
): string => {
  const areaUnit = areaUnits.find((a) => a.id === areaUnitId);
  if (!areaUnit) return '';
  return locale === 'en' ? areaUnit.labelEN : areaUnit.labelTH;
};

export { getAreaUnits, getAreaUnitLabel, getStandardAreaUnits };
