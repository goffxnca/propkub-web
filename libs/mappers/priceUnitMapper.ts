import { Locale } from '@/types/locale';
import { PriceUnit } from '@/types/misc/priceUnit';
import { getAreaUnits } from './areaUnitMapper';

interface TimeUnitData {
  id: string;
  labelTH: string;
  labelEN: string;
}

const timeUnitsData: TimeUnitData[] = [
  { id: 'year', labelTH: 'ปี', labelEN: 'Year' },
  { id: 'month', labelTH: 'เดือน', labelEN: 'Month' },
  { id: 'week', labelTH: 'สัปดาห์', labelEN: 'Week' },
  { id: 'day', labelTH: 'วัน', labelEN: 'Day' }
];

const getTimeUnits = (locale: Locale = 'th'): PriceUnit[] => {
  return timeUnitsData.map((tu) => ({
    id: tu.id,
    label: locale === 'en' ? tu.labelEN : tu.labelTH
  }));
};

const getPriceUnit = (
  unitId: string,
  tCommon: (key: string, params?: Record<string, any>) => string
): string => {
  if (!unitId) return '';
  const area = tCommon(`areaUnits.${unitId}`);
  if (area !== `areaUnits.${unitId}`) return area;
  const time = tCommon(`timeUnits.${unitId}`);
  if (time !== `timeUnits.${unitId}`) return time;
  return '';
};

const getPriceUnitList = (
  assetType: string,
  postType: string,
  locale: Locale = 'th'
): PriceUnit[] => {
  const timeUnits = getTimeUnits(locale);
  const areaUnits = getAreaUnits(locale);

  const mapping: Record<string, Record<string, PriceUnit[]>> = {
    condo: { sale: [], rent: timeUnits },
    townhome: { sale: [], rent: timeUnits },
    house: { sale: [], rent: timeUnits },
    commercial: { sale: [], rent: timeUnits },
    land: { sale: areaUnits, rent: areaUnits }
  };

  return mapping[assetType]?.[postType] || [];
};

export { getPriceUnit, getPriceUnitList };
